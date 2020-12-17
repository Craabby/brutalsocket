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
    this.count--;
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
//   spawn(name) {
//     var c=new ArrayBuffer(3+2*a.length),
//         d=new DataView(c);
//     d.setUint8(0,3);
//     for(var e=0;e<name.length;++e)
//       d.setUint16(1+2*e,name.charCodeAt(e),!0);
//     console.log(new Uint8Array(c))
//   }
}

module.exports = BrutalSocket;
