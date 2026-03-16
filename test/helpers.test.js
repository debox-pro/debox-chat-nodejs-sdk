"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const boxbotapi = require("../boxbotapi");

test("NewInlineKeyboardButtonLoginURL", () => {
  const result = boxbotapi.NewInlineKeyboardButtonLoginURL(
    "text",
    new boxbotapi.LoginURL({
      URL: "url",
      ForwardText: "ForwardText",
      BotUsername: "username",
      RequestWriteAccess: false,
    }),
  );

  assert.equal(result.Text, "text");
  assert.equal(result.LoginURL.URL, "url");
  assert.equal(result.LoginURL.ForwardText, "ForwardText");
  assert.equal(result.LoginURL.BotUsername, "username");
  assert.equal(result.LoginURL.RequestWriteAccess, false);
});

test("NewMessage and keyboard helpers", () => {
  const msg = boxbotapi.NewMessage("chat_1", "group", "hello");
  const row = boxbotapi.NewInlineKeyboardRow(
    boxbotapi.NewInlineKeyboardButtonData("next", "next"),
  );
  msg.ReplyMarkup = boxbotapi.NewInlineKeyboardMarkup(row);

  assert.equal(msg.ChatID, "chat_1");
  assert.equal(msg.ChatType, "group");
  assert.equal(msg.method(), "sendMessage");
  assert.ok(msg.ReplyMarkup);
});
