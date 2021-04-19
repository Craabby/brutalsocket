# brutalsocket
This is pretty much just a ripoff of [diepsocket](https://github.com/Cazka/diepsocket/blob/master/src/diepsocket.js) but for brutal.io

for it to work you need to cd to the folder you installed it to and run 
```
npm i
```
the event listeners are `open`, `message`, `close`, and `error`

## Usage of this library
```js
const brutalSocket = require("brutalsocket");

const bot = new brutalSocket("ws://158.69.123.15:8103/");
bot.on('error') = err => {
  console.error(err);
};
bot.on('open') = () => {
  bot.spawn("sdf");
};
```
