const boxbotapi = require("../boxbotapi");

async function main() {
  const bot = await boxbotapi.NewBotAPI(process.env.DEBOX_BOT_API_KEY || "YOUR_BOT_API_KEY", process.env.DEBOX_BOT_API_SECRET || "YOUR_BOT_API_SECRET");
  const msg = boxbotapi.NewMessage("DEBOX_USER_ID", "private", "Hello, DeBox!");
  await bot.Send(msg);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
