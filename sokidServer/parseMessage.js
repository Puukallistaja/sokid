module.exports = buffer => {
  try {
    const payloadLengthInBytes = buffer[1] & 0x7f;
    const isMasked = buffer[1] & 0x80
    const maskingKey = isMasked ? buffer.slice(2, 6) : 0
    const payloadStartIndex = isMasked ? 6 : 2

    const payload = buffer.slice(
      payloadStartIndex,
      payloadStartIndex + payloadLengthInBytes
    );

    const decodePayload = payload =>
      payload.map((byte, ix) => byte ^ maskingKey[ix % 4]);

    const decodedPayload = decodePayload(payload)

    return decodedPayload.toString()
  } catch (error) {
    console.log(error);
  }
};
