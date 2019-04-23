const debug = 0;

module.exports = buffer => {
  function readPayloadInfo() {
    const isMasked = Boolean(buffer[1] & 0x80);
    let payloadStartIndex,
      payloadLength = buffer[1] & 0x7f;

    switch (payloadLength) {
      case 126:
        payloadLength = getPayloadLengthAsInt(buffer.slice(2, 4));
        payloadStartIndex = isMasked ? 8 : 4;
        break;
      case 127:
        payloadLength = getPayloadLengthAsInt(buffer.slice(2, 9));
        payloadStartIndex = isMasked ? 14 : 10;
        break;
      default:
        payloadStartIndex = isMasked ? 6 : 2;
        break;
    }

    const maskingKey = isMasked
      ? buffer.slice(payloadStartIndex - 4, payloadStartIndex)
      : 0;

    function makeBinaryString(hex) {
      return hex.toString(2).padStart(8, "0");
    }
    function getPayloadLengthAsInt(bufferPiece) {
      return parseInt(
        Array.from(bufferPiece)
          .map(byte => makeBinaryString(byte))
          .join(""),
        2
      );
    }

    if (debug) {
      console.log(`
        Parsed payload details
        ======================
        Masked?:           ${isMasked}
        Maskingkey:        ${maskingKey}
        Payloadlength:     ${payloadLength}
        PayloadStartIndex: ${payloadStartIndex}
      `);
    }

    return {
      isMasked,
      maskingKey,
      payloadLength,
      payloadStartIndex
    };
  }

  try {
    const isFinalFrame = Boolean(buffer[0] & 0x80);
    const opCode = buffer[0] & 0xf;

    if (opCode === 8) {
      return JSON.stringify({ msg: "Connection closed" })
    }

    const {
      isMasked,
      maskingKey,
      payloadLength,
      payloadStartIndex
    } = readPayloadInfo();

    if (debug) {
      console.log(`
        Is lastframe:   ${isFinalFrame}
        Opcode:         ${opCode}
      `);
      buffer.map((byte, ix) => {
        if (ix > 11) return;
        console.log(
          `${ix < 9 ? "0" + (ix +  1) : ++ix} ${
             ix < 9 ? "0" +  ix : ix
          } ${byte.toString(2).padStart(8, "0")} :: ${byte}`
        );
      });
    }

    const payload = buffer.slice(
      payloadStartIndex,
      payloadStartIndex + payloadLength
    );

    if (isMasked) {
      for (var i = 0; i < payload.length; i++) {
        payload[i] = payload[i] ^ maskingKey[i % 4];
      }
    }

    return {
       a : payload.slice( 0, 32),
       b : payload.slice(32, 64),
       c : payload.slice(64, 96),
       debug: {
         "a": payload.slice( 0, 32).toString('base64'),
         "b": payload.slice(32, 64).toString('base64'),
         "c": payload.slice(64, 96).toString('base64'),
       }
    };
  } catch (error) {
    console.log(error);
  }
};
