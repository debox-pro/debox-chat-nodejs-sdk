"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const boxbotapi = require("../boxbotapi");

class MockClient {
  constructor() {
    this.calls = [];
  }

  async Do(req) {
    this.calls.push(req);

    if (req.url.endsWith("/getMe")) {
      return {
        status_code: 200,
        status: "OK",
        body: JSON.stringify({
          ok: true,
          result: {
            user_id: "bot_1",
            name: "mybot",
          },
        }),
      };
    }

    if (req.url.endsWith("/sendMessage")) {
      return {
        status_code: 200,
        status: "OK",
        body: JSON.stringify({
          ok: true,
          result: {
            message_id: "m1",
            text: "hello",
            chat: {
              id: "chat_1",
              type: "private",
            },
          },
        }),
      };
    }

    if (req.url.endsWith("/getUpdates")) {
      return {
        status_code: 200,
        status: "OK",
        body: JSON.stringify({
          ok: true,
          result: [
            {
              id: 10,
              message: {
                message_id: "m2",
                text: "ping",
                chat: {
                  id: "chat_1",
                  type: "private",
                },
              },
            },
          ],
        }),
      };
    }

    if (req.url.endsWith("/bad")) {
      return {
        status_code: 500,
        status: "Internal Server Error",
        body: "{}",
      };
    }

    return {
      status_code: 404,
      status: "Not Found",
      body: "{}",
    };
  }
}

test("NewBotAPIWithClient", async () => {
  const bot = await boxbotapi.NewBotAPIWithClient("token_x", boxbotapi.APIEndpoint, new MockClient());
  assert.equal(bot.Self.UserId, "bot_1");
  assert.equal(bot.Self.Name, "mybot");
});

test("Send message", async () => {
  const bot = await boxbotapi.NewBotAPIWithClient("token_x", boxbotapi.APIEndpoint, new MockClient());
  const msg = boxbotapi.NewMessage("chat_1", "private", "hello");
  const result = await bot.Send(msg);

  assert.equal(result.MessageID, "m1");
  assert.equal(result.Text, "hello");
  assert.equal(result.Chat.ID, "chat_1");
});

test("GetUpdates", async () => {
  const bot = await boxbotapi.NewBotAPIWithClient("token_x", boxbotapi.APIEndpoint, new MockClient());
  const updates = await bot.GetUpdates(boxbotapi.NewUpdate(0));

  assert.equal(updates.length, 1);
  assert.equal(updates[0].Id, 10);
  assert.equal(updates[0].Message.Text, "ping");
});

test("MakeRequest non-200", async () => {
  const bot = await boxbotapi.NewBotAPIWithClient("token_x", boxbotapi.APIEndpoint, new MockClient());
  await assert.rejects(async () => {
    await bot.MakeRequest("bad", new boxbotapi.Params());
  }, (err) => err instanceof boxbotapi.ErrorEx && err.Code === 500);
});

test("EscapeText", () => {
  assert.equal(boxbotapi.EscapeText(boxbotapi.ModeMarkdown, "_x_"), "\\_x\\_");
  assert.equal(boxbotapi.EscapeText(boxbotapi.ModeHTML, "<b>"), "&lt;b&gt;");
});

test("HandleUpdate", async () => {
  const bot = await boxbotapi.NewBotAPIWithClient("token_x", boxbotapi.APIEndpoint, new MockClient());
  const update = bot.HandleUpdate({
    method: "POST",
    body: { id: 7, message: { text: "x", chat: { id: "c1", type: "private" } } },
  });
  assert.equal(update.Id, 7);

  assert.throws(() => {
    bot.HandleUpdate({ method: "GET", body: {} });
  });
});

test("SetHost", () => {
  const old = boxbotapi.APIEndpoint;
  boxbotapi.SetHost("https://example.com");
  assert.equal(boxbotapi.APIEndpoint, "https://example.com/openapi/bot%s/%s");
  boxbotapi.APIEndpoint = old;
});
