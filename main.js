"use strict";

const boxbotapi = require("./boxbotapi");

const homeInfoContent = `<body href="%s"><b>Bot首页</b> <br/> 我是Debox官方演示机器人，展示Bot部分能力，供开发者参考。<br/>
					1、可以通过发送<b>botmother</b>消息直接唤醒我<br/>
					2、可以点击<a href="%s">@botmother</a>进入私聊交互。<br/>
					3、该Bot代码很少共218行，去掉注释后<font color="#0000ff">源码只有196行</font>，演示了以下功能：<br/>
					• 消息监听<br/>
					• 消息发送<br/>
					• 消息编辑<br/>
					• 按钮传参<br/>
					• 静默授权<br/>
					• 充话费业务交互等功能<br/>• 同时演示了用HTML构造原生消息的能力，极大丰富了富文本承载信息的能力。<br/>
					4、您可以<a href="https://docs.debox.pro/zh/GO-SDK">下载源码</a>，基于源码开发自己的Bot服务。<br/>
					基于SDK和此Demo，开发Bot的难度和成本很低，您可以轻松搭建自己的Bot服务。
					<br/>点击下面按钮体验吧。</body>
					`;

const homeButton = "首页";
const myButton = "我是谁";
const yourButton = "你是谁";
const privateChatUrl = "https://m.debox.pro/user/chat?id=";
const userHomePage = "https://m.debox.pro/card?id=";

const homeMenuMarkup = boxbotapi.NewInlineKeyboardMarkup(
  boxbotapi.NewInlineKeyboardRow(
    boxbotapi.NewInlineKeyboardButtonDataWithColor("", yourButton, "", yourButton, "#21C161"),
    boxbotapi.NewInlineKeyboardButtonDataWithColor("", myButton, "", myButton, "#21C161"),
  ),
  boxbotapi.NewInlineKeyboardRow(
    boxbotapi.NewInlineKeyboardButtonData(homeButton, homeButton),
  ),
);

const cardSample = `
<body href="%s">
	<div style="background-color1:#00ff00;width:80%;color:#8a8a8a">
		<img src="%s" style="width:10%;height:10%;vertical-align:middle;border-radius: 50%;radius:-1"/>%s
	</div>
		<b>Address: </b>%s
		<br/>
		<img src="%s" style="width:100%;height:100%;"/>
	<div style="width:70%">
		<font style="font-size:12px;color:#8a8a8a">🏠</font>
		<font style="font-size:12px;color:#8a8a8a">%s</font>
	</div>
</body>
`;

let bot;

function formatTemplate(template, ...args) {
  let i = 0;
  return template.replace(/%s/g, () => String(args[i++] ?? ""));
}

function setSelected(keyboard, row, col) {
  for (let i = 0; i < keyboard.InlineKeyboard[row].length; i += 1) {
    keyboard.InlineKeyboard[row][i].SubTextColor = "#21C161";
    if (col === i) {
      keyboard.InlineKeyboard[row][i].SubTextColor = "#ff0000";
    }
  }
}

async function handleMessage(message) {
  const user = message.From;
  const text = message.Text || "";

  if (!user) {
    return;
  }

  console.log(`${user.Name} wrote ${text}`);

  if (text.length > 0) {
    const msg = boxbotapi.NewMessage(message.Chat.ID, message.Chat.Type, message.Text);
    msg.ParseMode = boxbotapi.ModeHTML;

    if (text.toLowerCase() === "botmother" || message.Chat.Type === "private") {
      msg.Text = formatTemplate(homeInfoContent, privateChatUrl + bot.Self.UserId, privateChatUrl + bot.Self.UserId);
      setSelected(homeMenuMarkup, 0, 100);
      msg.ReplyMarkup = homeMenuMarkup;
      await bot.Send(msg);
    }
  }
}

async function handleButton(query) {
  let text = "";
  const message = query.Message;
  let markup = boxbotapi.NewInlineKeyboardMarkup();

  if (query.Data === homeButton) {
    const user = bot.Self;
    const homePage = userHomePage + user.UserId;
    text = formatTemplate(homeInfoContent, homePage, privateChatUrl + user.UserId);
    setSelected(homeMenuMarkup, 0, 100);
    markup = homeMenuMarkup;
  } else if (query.Data === yourButton) {
    const user = bot.Self;
    const homePage = userHomePage + user.UserId;
    text = formatTemplate(cardSample, homePage, user.Pic, user.Name, user.Address, user.Pic, homePage);
    markup = homeMenuMarkup;
    setSelected(homeMenuMarkup, 0, 0);
  } else if (query.Data === myButton) {
    const user = query.From;
    const homePage = userHomePage + user.UserId;
    text = formatTemplate(cardSample, homePage, user.Pic, user.Name, user.Address, user.Pic, homePage);
    markup = homeMenuMarkup;
    setSelected(homeMenuMarkup, 0, 1);
  }

  const msg = boxbotapi.NewEditMessageTextAndMarkup(message.Chat.ID, message.Chat.Type, message.MessageID, text, markup);
  msg.ParseMode = boxbotapi.ModeHTML;
  await bot.Send(msg);
}

async function handleUpdate(update) {
  if (update.Message) {
    await handleMessage(update.Message);
  } else if (update.CallbackQuery) {
    await handleButton(update.CallbackQuery);
  }
}

async function receiveUpdates(updates) {
  for await (const update of updates) {
    await handleUpdate(update);
  }
}

async function main() {
  // const token = process.env.DEBOX_BOT_API_KEY || "YOUR_BOT_API_KEY";
  const token = "9tAwKmXodvMs9zdLR9xAmGTxbN09";
  const apiSecret = process.env.DEBOX_BOT_API_SECRET || "";
  boxbotapi.Debug = true;
  boxbotapi.MessageListener = true;

  console.log(`application started, debug mode is ${boxbotapi.Debug}, message listener is ${boxbotapi.MessageListener}`);

  bot = await boxbotapi.NewBotAPI(token, apiSecret);

  const u = boxbotapi.NewUpdate(0);
  u.Timeout = 60;

  const updates = bot.GetUpdatesChan(u);
  await receiveUpdates(updates);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
