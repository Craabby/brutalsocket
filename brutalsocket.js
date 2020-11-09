const EventEmitter = require("events");
const WebSocket = require("ws");
const HttpsProxyAgent = require("https-proxy-agent");
const url = require("url");
let wsurl;
class brutalSocket extends EventEmitter {
  /**
   * this is from cazka's github with slight modification by me
   * https://github.com/Cazka/diepsocket/blob/master/src/diepsocket.js
   * @param {String} wsurl
   * @param {Object} options
   * @param {Number} options.timeout
   * @param {String} options.proxy
   * @param {String} options.ipv6
   */

  constructor(link, options) {
    wsurl = link;
    super();
    this._options = {
      timeout: 20000,
      ...options,
    };
    this._connectTimeout;
    this._socket;
    this._connect();
  }

  _connect() {
    const options = {
      origin: "http://brutal.io",
      rejectUnauthorized: false,
      family: 6,
      headers: {
        Host: "23.29.125.107:3000",
        Connection: "Upgrade",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36",
        Upgrade: "websocket",
        Origin: "http://brutal.io",
        "Sec-WebSocket-Version": "13",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-WebSocket-Key": "7yuOqSLQxg76D0gUqlXjxg==",
        "Sec-WebSocket-Extensions":
          "permessage-deflate; client_max_window_bits",
      },
    };
    if (this._options.proxy) {
      const agent = new HttpsProxyAgent(
        url.parse(`http://${this._options.proxy}`)
      );
      options.agent = agent;
    }
    if (this._options.ipv6) {
      options.family = 6;
      options.localAddress = this._options.ipv6;
    }
    // this came straight from what cazka did in diepsocket
    this._socket = new WebSocket(wsurl, options);
    this._socket.on("open", () => this._onopen());
    this._socket.on("close", (code, reason) => this._onclose(code, reason));
    this._socket.on("error", (err) => this._onerror(err));

    this._connectTimeout = setTimeout(() => {
      this._onerror(new Error("Connection took too long to establish"));
    }, this._options.timeout);
  }
  /**
   * The listener of the `WebSocket` `'open'` event.
   *
   */
  _onopen() {
    clearTimeout(this._connectTimeout);
    this._socket.send(new Uint8Array([1, 90, 0, 96, 0]));
    this._socket.send(new Uint8Array([0]));
    super.emit("open");
  }

  /**
   * The listener of the `WebSocket` `'error'` event.
   * This was also stolen from cazka's diepsocket github
   * @param {Error} error The emitted error
   */
  _onerror(error) {
    clearTimeout(this._connectTimeout);
    this.close(1006);
    if (!super.emit("error", error)) throw error;
  }

  _onclose(code, reason) {
    super.emit("close", code, reason);
  }

  spawn(name) {
    let encodedName = [3];
    for (let i = 0; i < name.length; i++) {
      encodedName.push(name.charCodeAt(i));
      encodedName.push(0);
    }
    encodedName.push(0);
    encodedName.push(0);
    console.log(new Uint8Array(encodedName));
  }

  send(packet) {
    console.log("attempting to send");
    console.log(packet);
    console.log(new Uint8Array([packet]));
  }
}
module.exports = brutalSocket;
