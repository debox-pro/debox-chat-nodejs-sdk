# debox-chat-nodejs-sdk

`debox-chat-nodejs-sdk` is the official Node.js SDK for the DeBox Chat Service.

[Chinese version](./README_CN.md)

## Quick Start

```bash
npm install debox-chat-nodejs-sdk
```

```js
const boxbotapi = require("debox-chat-nodejs-sdk");

async function main() {
  const bot = await boxbotapi.NewBotAPI("YOUR_BOT_API_KEY");
  const msg = boxbotapi.NewMessage("DEBOX_USER_ID", "private", "Hello, DeBox!");
  await bot.Send(msg);
}

main().catch(console.error);
```

## Documentation

See [DeBox docs](https://docs.debox.pro/GO-SDK/) and API guides at [developer.debox.pro](https://developer.debox.pro/).
