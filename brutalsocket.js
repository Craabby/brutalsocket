const ws = require("ws");
const EventEmitter = require("events");

/**
 * @param {string} link
 * @param {object} options
 */
class BrutalSocket extends EventEmitter {
  constructor(link, _options) {
    super();
    this.wsurl = link;
    this.options = _options;
    this.bot;
    this.encodedSpawnPacket = [3];
    this.count = 0;
    this.connect();
  }
  connect() {
    this.bot = new ws(this.wsurl, this.options);
    this.bot.on("open", () => {
      this.onopen();
    });
    this.bot.on("close", () => {
      this.onclose();
    });
    this.bot.on("error", (err) => {
      this.onerror(err);
    });
    this.bot.on("message", (msg) => {
      this.onmessage(msg);
    });
  }
  onopen() {
    this.bot.send(new Uint8Array([1, 145, 0, 96, 0]));
    this.bot.send(new Uint8Array([0]));
    this.count++;
    super.emit("open");
  }
  onmessage(msg) {
    super.emit("message", msg);
  }
  onerror(err) {
    this.bot.close();
    // console.error(err);
    super.emit("error", err);
  }
  onclose() {
    this.botcount--;
    this.bot.close();
    super.emit("close");
  }
  close() {
    this.bot.close();
  }
  send(packet) {
    this.bot.send(packet);
  }
  spawn(name) {
    for (let i = 0; i < name.length; i++) {
      this.encodedSpawnPacket.push(name.charCodeAt(i));
      this.encodedSpawnPacket.push(0);
    }
    this.encodedSpawnPacket.push(0);
    this.encodedSpawnPacket.push(0);
    return this.bot.send(new Uint8Array(this.encodedSpawnPacket));
  }
}

module.exports = BrutalSocket;
