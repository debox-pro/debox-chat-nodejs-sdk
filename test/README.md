# test/ README

本目录用于对齐 `debox-chat-go-sdk/boxbotapi/*_test.go` 的测试结构，目标是让 Go 与 Node.js 两套 SDK 维护时有一致的心智模型。

## 文件映射

- `params.test.js`
  - 对齐 Go: `boxbotapi/params_test.go`
  - 覆盖 `Params` 的核心行为：
    - `AddNonEmpty`
    - `AddNonZero`
    - `AddNonZero64`
    - `AddBool`
    - `AddNonZeroFloat`
    - `AddInterface`
    - `AddFirstValid`

- `helpers.test.js`
  - 对齐 Go: `boxbotapi/helpers_test.go`
  - 覆盖常用 helper 构造函数（尤其是键盘按钮与消息构造）。

- `types.test.js`
  - 对齐 Go: `boxbotapi/types_test.go`
  - 覆盖基础类型方法：
    - `User.String`
    - `Message.Time`
    - `Chat.IsPrivate/IsGroup/IsChannel/IsSuperGroup`
    - `Update.SentFrom/FromChat/CallbackData`

- `bot.test.js`
  - 对齐 Go: `boxbotapi/bot_test.go`
  - 采用离线 `MockClient`，避免依赖真实 Token 和网络。
  - 覆盖：
    - `NewBotAPIWithClient`
    - `Send`
    - `GetUpdates`
    - `MakeRequest` 非 200 错误分支
    - `EscapeText`
    - `HandleUpdate`
    - `SetHost`

## 运行测试

在仓库根目录执行：

```bash
npm test
```

当前脚本使用 Node 原生测试运行器：

```json
"test": "node --test ./test/*.test.js"
```

## 维护约定

- 优先保持与 Go SDK 同名能力的测试覆盖一致。
- 新增 API 时，按以下顺序补测试：
  1. 参数层（`params.test.js`）
  2. 配置/辅助构造（`helpers.test.js`）
  3. 类型行为（`types.test.js`）
  4. 请求链路（`bot.test.js`）
- `bot.test.js` 默认继续使用 mock，保证 CI/本地均可离线稳定运行。
