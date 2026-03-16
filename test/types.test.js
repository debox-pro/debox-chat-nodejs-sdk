"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const boxbotapi = require("../boxbotapi");

test("User.String", () => {
  const user = new boxbotapi.User({ UserId: "u1", Name: "@test" });
  assert.equal(user.String(), "@test");

  const user2 = new boxbotapi.User({ UserId: "u2", Name: "" });
  assert.equal(user2.String(), "");
});

test("Message.Time", () => {
  const message = new boxbotapi.Message({ DateValue: 0 });
  assert.equal(message.Time().toISOString(), "1970-01-01T00:00:00.000Z");
});

test("Chat type helpers", () => {
  assert.equal(new boxbotapi.Chat({ ID: "c1", Type: "private" }).IsPrivate(), true);
  assert.equal(new boxbotapi.Chat({ ID: "c1", Type: "group" }).IsGroup(), true);
  assert.equal(new boxbotapi.Chat({ ID: "c1", Type: "channel" }).IsChannel(), true);
  assert.equal(new boxbotapi.Chat({ ID: "c1", Type: "supergroup" }).IsSuperGroup(), true);
});

test("Update helpers", () => {
  const update = new boxbotapi.Update({
    Id: 1,
    MessageValue: new boxbotapi.Message({
      Text: "hello",
      From: new boxbotapi.User({ UserId: "u1", Name: "alice" }),
      ChatValue: new boxbotapi.Chat({ ID: "chat_1", Type: "private" }),
    }),
  });

  assert.equal(update.SentFrom().Name, "alice");
  assert.equal(update.FromChat().ID, "chat_1");
  assert.equal(update.CallbackData(), "");
});
