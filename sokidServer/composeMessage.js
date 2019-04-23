const opCodes = {
  text:   0b10000001,
  binary: 0b10000010,
  ping:   0b10001001,
  close:  0b10001000
};

module.exports = ({payload, ping}) => {
  const body = Buffer.concat([payload.a, payload.b, payload.c])
  const buffer = Buffer.alloc(2 + Buffer.byteLength(body));

  const firstByte  = () => ping ? opCodes.ping : opCodes.binary;
  const secondByte = () => Buffer.byteLength(body)

  buffer.writeUInt8(firstByte(), 0);
  buffer.writeUInt8(secondByte(), 1);

  return Buffer.concat([buffer.slice(0, 2), body]);
};
