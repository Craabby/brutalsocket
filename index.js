const brutalSocket = require("./brutalsocket");

var bot = new brutalSocket("ws://158.69.123.15:8103/");
bot.on('error') = err => {
  console.error(err);
};
bot.on('open') = () => {
  bot.spawn("sdf");
};
