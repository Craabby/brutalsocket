const brutalSocket = require("./brutalsocket");

// setInterval(() => {
var bot = new brutalSocket("ws://158.69.123.15:8103/");
bot._onerror = function (err) {
  console.log(err);
};
bot._onopen = function () {
  bot.spawn("sdf");
};
// }, 0);
