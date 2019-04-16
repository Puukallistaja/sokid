// all frames are FIN
const opCodes = {
  ping: 0b10001001,
  text: 0b10000001,
  close: 0b10001000
};

module.exports = ({payload, ping}) => {
  const payLoadAsJson = JSON.stringify(payload);
  const buffer = Buffer.alloc(2 + Buffer.byteLength(payLoadAsJson));

  const firstByte = () => ping ? opCodes.ping : opCodes.text;
  const secondByte = () => Buffer.byteLength(payLoadAsJson)
  
  buffer.writeUInt8(firstByte(), 0);
  buffer.writeUInt8(secondByte(), 1);
  buffer.write(payLoadAsJson, 2);

  return buffer;
};
