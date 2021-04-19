const ws = require("ws");
const EventEmitter = require("events");
/**
 * @param {string} link
 * @param {object} options
 */

class BrutalSocket extends EventEmitter {
  constructor(link, options) {
    super();
    this.wsurl = link;
    this.options = options;
    this.autoReconnect = options.autoReconnect || false;
    this.bot;
    this.encodedSpawnPacket = [3];
    this.initialize();
  }
  initialize() {
    this.bot = new ws(this.wsurl, this.options);
    this.bot.binaryType = "arraybuffer";
    this.bot.on("open", () => {
      this.onopen();
    });
    this.bot.on("close", () => {
      if (this.options.autoReconnect) this.initialize();
      this.onclose();
    });
    this.bot.on("error", (errcode, errmsg) => {
      this.onerror(errcode, errmsg, this.wsurl);
    });
    this.bot.on("message", (msg) => {
      this.onmessage(msg);
    });
  }
  onopen() {
    this.bot.send(new Uint8Array([1, 55, 2, 131, 1]));
    this.bot.send(new Uint8Array([0]));
    super.emit("open");
  }
  onmessage(msg) {
    super.emit("message", msg);
  }
  onerror(errcode, errmsg) {
    this.bot.close();
    super.emit("error", errcode, errmsg, this.wsurl);
  }
  onclose() {
    this.bot.close();
  }
  close() {
    this.bot.close();
  }
  send(packet) {
    this.bot.send(packet);
  }
  crash(attempts) {
    for (let i = 0; i < attempts || 1; i++) {
      this.send(
        new Uint8Array([
          5,
          ~~(Math.random() * 0xff),
          ~~(Math.random() * 0xff),
          ~~(Math.random() * 0xff),
          ~~(Math.random() * 0xff),
          ~~(Math.random() * 0xff),
          ~~(Math.random() * 0xff),
          ~~(Math.random() * 0xff),
          ~~(Math.random() * 0xff),
          ~~(Math.random() * 0xff),
        ])
      );
    }
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
  parseLB(dataview) { // thank you Snoopy
    this.score;
    for (this.lb = [], this.c = 1; ; ) {
      this.id = dataview.getUint16(this.c, true);
      this.c += 2;
      if (this.id == 0) break;
      this.score = dataview.getUint32(this.c, true);
      this.c += 4;
      let name = this.parseName(dataview, this.c);
      (this.nick = name.nick), (this.ranking = name.offset);
      this.c = this.ranking;
      let entry = {
        score: this.score,
        name: this.nick,
        userId: this.id,
        link: this.wsurl.split("ws://").join(""),
      };
      this.lb.push(entry);
    }
    return this.lb;
  }
  parseName(dataview, iteration) {
    this.name = "";
    while (true) {
      this.bit = dataview.getUint16(iteration, true);
      iteration += 2;
      if (this.bit == 0) break;
      this.name += String.fromCharCode(this.bit);
    }
    return {
      nick: this.name,
      offset: iteration,
    };
  }
  parseMap(dataview) {
    this.offset = 1;
    this.count = dataview.getUint16(this.offset, true);
    this.offset += 2;
    this.mapInfo = [];
    try {
      for (let i = 0; i < this.count; i++) {
        this.x = dataview.getUint8(this.offset++, true);
        this.y = dataview.getUint8(this.offset++, true);
        this.r = dataview.getUint8(this.offset++, true);
        this.player = { x: this.x, y: 256 - this.y, r: this.r };
        this.mapInfo.push(this.player);
      }
      return this.mapInfo;
    } catch (a) {}
  }
}

module.exports = BrutalSocket;
exports.servers = [
  "ws://158.69.123.15:8080/",
  "ws://158.69.123.15:8081/",
  "ws://158.69.123.15:8082/",
  "ws://158.69.123.15:8083/",
  "ws://158.69.123.15:8084/",
  "ws://158.69.123.15:8085/",
  "ws://158.69.123.15:8086/",
  "ws://158.69.123.15:8087/",
  "ws://158.69.123.15:8088/",
  "ws://158.69.123.15:8089/",
  "ws://158.69.123.15:8090/",
  "ws://158.69.123.15:8091/",
  "ws://158.69.123.15:8092/",
  "ws://158.69.123.15:8093/",
  "ws://158.69.123.15:8094/",
  "ws://158.69.123.15:8095/",
  "ws://158.69.123.15:8096/",
  "ws://158.69.123.15:8097/",
  "ws://158.69.123.15:8098/",
  "ws://158.69.123.15:8099/",
  "ws://158.69.123.15:8100/",
  "ws://158.69.123.15:8101/",
  "ws://158.69.123.15:8102/",
  "ws://158.69.123.15:8103/",
  "ws://164.132.205.24:8080/",
  "ws://164.132.205.24:8081/",
  "ws://164.132.205.24:8082/",
  "ws://164.132.205.24:8083/",
  "ws://164.132.205.24:8084/",
  "ws://164.132.205.24:8085/",
  "ws://164.132.205.24:8086/",
  "ws://164.132.205.24:8087/",
  "ws://164.132.205.24:8088/",
  "ws://164.132.205.24:8089/",
  "ws://164.132.205.24:8090/",
  "ws://164.132.205.24:8091/",
  "ws://164.132.205.24:8092/",
  "ws://164.132.205.24:8093/",
  "ws://164.132.205.24:8094/",
  "ws://164.132.205.24:8095/",
  "ws://164.132.205.24:8096/",
  "ws://164.132.205.24:8097/",
  "ws://164.132.205.24:8098/",
  "ws://164.132.205.24:8099/",
  "ws://164.132.205.24:8100/",
  "ws://164.132.205.24:8101/",
  "ws://164.132.205.24:8102/",
  "ws://164.132.205.24:8103/",
  "ws://139.162.30.54:8080/",
  "ws://139.162.30.54:8081/",
];
