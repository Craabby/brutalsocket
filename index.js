const brutalSocket = require("brutalsocket");

const bot = new brutalSocket("ws://158.69.123.15:8103/");
bot.on('error', console.err);
bot.on('open', () => {
  bot.spawn('crabby')
})
