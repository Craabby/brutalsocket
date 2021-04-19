const ws = require("ws");
const EventEmitter = require("events");
const servers = require('./servers.json')
/**
 * @param {string} link
 * @param {object} options
 */

class BrutalSocket extends EventEmitter {
    constructor(link, options) {
        super();
        options = options || { autoReconnect: false }
        this.wsurl = link;
        this.options = options;
        this.autoReconnect = options.autoReconnect
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
        for (this.lb = [], this.c = 1; ;) {
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
        } catch (a) { }
    }
}

BrutalSocket.servers = servers;
module.exports = BrutalSocket;
