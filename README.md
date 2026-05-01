# debox-chat-nodejs-sdk

`debox-chat-nodejs-sdk` is the official Node.js SDK for DeBox Chat Service.

[中文文档](./README_CN.md)

## Requirements

- Node.js >= 18

## Project Entry

- SDK entry: `boxbotapi/index.js`
- Runnable demo entry: `main.js`

## Install

```bash
npm install
```

## Environment Variables

```bash
export DEBOX_BOT_API_KEY="YOUR_BOT_API_KEY"
export DEBOX_BOT_API_SECRET="YOUR_BOT_API_SECRET"
```

## Quick Usage

```js
const boxbotapi = require("./boxbotapi");

async function main() {
  const bot = await boxbotapi.NewBotAPI(
    process.env.DEBOX_BOT_API_KEY,
    process.env.DEBOX_BOT_API_SECRET,
  );

  const msg = boxbotapi.NewMessage("DEBOX_USER_ID", "private", "Hello, DeBox!");
  await bot.Send(msg);
}

main().catch(console.error);
```

## Run Demo (1:1 with Go main.go flow)

```bash
npm start
```

Demo behavior:

- Calls `bot/getMe` during startup
- Long-polls `bot/getUpdates`
- Handles text messages and callback buttons
- Edits message content with inline keyboard (`bot/editMessageText`)

## Minimal Bot Loop Example

```js
const boxbotapi = require("./boxbotapi");

async function run() {
  boxbotapi.Debug = false;
  boxbotapi.MessageListener = true;

  const bot = await boxbotapi.NewBotAPI(
    process.env.DEBOX_BOT_API_KEY,
    process.env.DEBOX_BOT_API_SECRET,
  );

  const u = boxbotapi.NewUpdate(0);
  u.Timeout = 60;

  for await (const update of bot.GetUpdatesChan(u)) {
    if (update.Message) {
      const msg = boxbotapi.NewMessage(update.Message.Chat.ID, update.Message.Chat.Type, "Received");
      await bot.Send(msg);
    }
  }
}

run().catch(console.error);
```

## API Signature Notes

- Auth headers include `X-API-KEY`, `nonce`, `timestamp`, `signature`, `X-Request-Id`
- `signature = sha1(apiSecret + nonce + timestamp)`

## Documentation

- [DeBox docs](https://docs.debox.pro/GO-SDK/)
- [developer.debox.pro](https://developer.debox.pro/)
