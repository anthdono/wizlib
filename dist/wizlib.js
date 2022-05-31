"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_dgram_1 = __importDefault(require("node:dgram"));
const bulb_1 = require("./bulb");
class Wizlib {
    constructor(ip) {
        this._bulb = new bulb_1.Bulb(ip);
    }
    inUdpMessageFormat(method, params) {
        return `{"method": "${method}", "params": {${params}}}`;
    }
    sendMsgGetResponse(method, params) {
        return new Promise((resolve, reject) => {
            const client = node_dgram_1.default.createSocket("udp4");
            client.connect(this._bulb._port, this._bulb._ip, () => {
                client.send(this.inUdpMessageFormat(method, params), this._bulb._port, this._bulb._ip);
                client.on("message", (res) => {
                    let resObject = JSON.parse(res.toString('utf8'));
                    client.close();
                    resolve((resObject['result']));
                });
            });
        });
    }
    async getPilot() {
        const res = await this.sendMsgGetResponse("getPilot", "");
        return await res;
    }
    async setPilot(state) {
        const res = await this.sendMsgGetResponse("setPilot", `"state":${state.state},
                     "r":${state.r},
                     "g":${state.g},
                     "b":${state.b},
                     "dimming":${state.dimming}`);
        if (res == undefined || !(res).success)
            throw new Error("setPilot was unsuccessful");
    }
}
exports.default = Wizlib;
//# sourceMappingURL=wizlib.js.map