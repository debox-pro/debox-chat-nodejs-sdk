# debox-chat-nodejs-sdk

`debox-chat-nodejs-sdk` 是 DeBox Chat Service 的 Node.js 官方 SDK。

[English version](./README.md)

## 快速开始

```bash
npm install debox-chat-nodejs-sdk
```

```js
const boxbotapi = require("debox-chat-nodejs-sdk");

async function main() {
  const bot = await boxbotapi.NewBotAPI("YOUR_BOT_API_KEY", "YOUR_BOT_API_SECRET");
  const msg = boxbotapi.NewMessage("DEBOX_USER_ID", "private", "你好，DeBox!");
  await bot.Send(msg);
}

main().catch(console.error);
```

## 运行 Demo

```bash
export DEBOX_BOT_API_KEY="YOUR_BOT_API_KEY"
export DEBOX_BOT_API_SECRET="YOUR_BOT_API_SECRET"
npm start
```

## 文档

可参考 [DeBox 文档](https://docs.debox.pro/GO-SDK/) 以及 [developer.debox.pro](https://developer.debox.pro/) 的 API 指南。
