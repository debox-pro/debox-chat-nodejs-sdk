# debox-chat-nodejs-sdk

`debox-chat-nodejs-sdk` 是 DeBox Chat Service 的 Node.js 官方 SDK。

[English](./README.md)

## 环境要求

- Node.js >= 18

## 工程入口

- SDK 入口：`boxbotapi/index.js`
- 可直接运行 Demo 入口：`main.js`

## 安装

```bash
npm install
```

## 环境变量

```bash
export DEBOX_BOT_API_KEY="YOUR_BOT_API_KEY"
export DEBOX_BOT_API_SECRET="YOUR_BOT_API_SECRET"
```

## 快速用法

```js
const boxbotapi = require("./boxbotapi");

async function main() {
  const bot = await boxbotapi.NewBotAPI(
    process.env.DEBOX_BOT_API_KEY,
    process.env.DEBOX_BOT_API_SECRET,
  );

  const msg = boxbotapi.NewMessage("DEBOX_USER_ID", "private", "你好，DeBox!");
  await bot.Send(msg);
}

main().catch(console.error);
```

## 运行 Demo（与 Go `main.go` 同流程复刻）

```bash
npm start
```

Demo 默认流程：

- 启动时调用 `bot/getMe`
- 长轮询 `bot/getUpdates`
- 处理消息与按钮回调
- 通过 `bot/editMessageText` 编辑消息+按钮状态

## 最小监听示例

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
      const msg = boxbotapi.NewMessage(update.Message.Chat.ID, update.Message.Chat.Type, "收到");
      await bot.Send(msg);
    }
  }
}

run().catch(console.error);
```

## 签名说明

- 请求头包含：`X-API-KEY`、`nonce`、`timestamp`、`signature`、`X-Request-Id`
- 签名规则：`signature = sha1(apiSecret + nonce + timestamp)`

## 文档

- [DeBox 文档](https://docs.debox.pro/GO-SDK/)
- [开放平台](https://developer.debox.pro/)
