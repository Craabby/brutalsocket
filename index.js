const brutalSocket = require("./brutalsocket");

var bot = new brutalSocket("ws://158.69.123.15:8103/");
bot.on('error') = function (err) {
  console.log(err);
};
bot.on('open') = function () {
  bot.spawn("sdf");
};
