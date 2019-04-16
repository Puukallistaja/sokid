// Make payload, parse payload. It should show us if both modules work correctly
const assert = require("assert");
const { composeMessage, parseMessage } = require("../sokidServer");

const mock = {
  ping: false,
  payload: "Lets play ping-pong"
};

const tooMuch = 10
const newMessage = composeMessage({ payload: mock.payload })
const newMessageLarge = composeMessage({ payload: mock.payload.repeat(tooMuch) })

console.log(`
Message composer:
  ${
    assert.ok(
      Buffer.isBuffer(newMessage),
      "I returned something other than a buffer instance"
    ) || "Returns a buffer"
  }

Message parser:
  ${
    assert.equal(
      JSON.stringify(mock.payload),
      parseMessage(newMessage),
      "Cannot parse message"
    ) || "Parses messages from Message Composer"
  }
  ${
    assert.notEqual(
      JSON.stringify(mock.payload.repeat(tooMuch)),
      parseMessage(newMessageLarge),
      "Parsed a message larger than 125 bytes and this should be impossibru"
    ) || "Fails when message is larger than 125 bytes"
  }
`)
