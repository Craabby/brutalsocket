const ws = require("ws");
const EventEmitter = require("events");

/**
 * @param {String} link
 * @param {Object} options
 */
class BrutalSocket extends EventEmitter {
  constructor(link, options) {
    super();
    this.wsurl = link;
    this.options = options;
    this.bot;
    this.encodedSpawnPacket = [3];
    this.connect();
  }
  connect() {
    this.bot = new ws(this.wsurl, this.options);
    this.bot.on("open", () => this.onopen());
    this.bot.on("close", () => this.onclose());
    this.bot.on("error", (err) => this.onerror(err));
    this.bot.on("message", (msg) => this.onmessage(msg));
  }
  onopen() {
    this.bot.send(new Uint8Array([1, 145, 0, 96, 0]));
    this.bot.send(new Uint8Array([0]));
    super.emit("open");
  }
  onmessage(msg) {
    super.emit("message", msg);
  }
  onerror(errcode, errmsg) {
    this.bot.close();
    // console.error(errcode, errmesg);
    super.emit("error", errcode, errmsg);
  }
  onclose() {
    this.bot.close();
    super.emit("close");
  }
  close() {
    try {
      this.bot.close();
    } catch (e) {
      this.bot.terminate();
    }
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
