"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lib = void 0;
const node_dgram_1 = __importDefault(require("node:dgram"));
class Lib {
    constructor(ip, port = Lib.DEFAULT_BULB_PORT) {
        this.havePulledInitialState = false;
        this.bulbStateManager = new BulbStateManager();
        this.ip = ip;
        this.port = port;
    }
    async changeState(field, change, value) {
        if (!this.havePulledInitialState) {
            await this.pullBulbState();
            this.havePulledInitialState = true;
        }
        switch (field) {
            case "state":
                switch (change) {
                    case "toggle":
                        this.bulbStateManager.state = !this.bulbStateManager;
                        break;
                    case "set":
                        this.bulbStateManager.state = value;
                        break;
                }
                break;
            case "sceneId":
                switch (change) {
                    case "increase":
                        this.bulbStateManager.sceneId++;
                        break;
                    case "decrease":
                        this.bulbStateManager.sceneId--;
                        break;
                    case "set":
                        this.bulbStateManager.sceneId = value;
                        break;
                }
                break;
            case "r":
                switch (change) {
                    case "increase":
                        this.bulbStateManager.r += Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "decrease":
                        this.bulbStateManager.r -= Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "set":
                        this.bulbStateManager.r = value;
                        break;
                }
                break;
            case "g":
                switch (change) {
                    case "increase":
                        this.bulbStateManager.g += Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "decrease":
                        this.bulbStateManager.g -= Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "set":
                        this.bulbStateManager.g = value;
                        break;
                }
                break;
            case "b":
                switch (change) {
                    case "increase":
                        this.bulbStateManager.b += Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "decrease":
                        this.bulbStateManager.b -= Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "set":
                        this.bulbStateManager.b = value;
                        break;
                }
                break;
            case "dimming":
                switch (change) {
                    case "increase":
                        this.bulbStateManager.dimming +=
                            Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "decrease":
                        this.bulbStateManager.dimming -=
                            Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "set":
                        this.bulbStateManager.dimming = value;
                        break;
                }
                break;
            case "c":
                switch (change) {
                    case "increase":
                        this.bulbStateManager.c += Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "decrease":
                        this.bulbStateManager.c -= Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "set":
                        this.bulbStateManager.c = value;
                        break;
                }
                break;
            case "w":
                switch (change) {
                    case "increase":
                        this.bulbStateManager.w += Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "decrease":
                        this.bulbStateManager.w -= Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "set":
                        this.bulbStateManager.w = value;
                        break;
                }
                break;
            case "color":
                this.bulbStateManager.r = 255;
                break;
        }
        this.pushBulbState();
    }
    static async sendUDPMessage(method, params, ip, port, returnMessageResult, doBroadcast) {
        const bufmsg = Buffer.from(`{"method": "${method}", "params": ${params}}`);
        const socket = node_dgram_1.default.createSocket("udp4");
        const bulbResponse = new Array();
        return new Promise((resolve, _) => {
            socket.bind(port, () => {
                if (doBroadcast)
                    socket.setBroadcast(true);
                setTimeout(() => {
                    socket.close();
                    resolve(bulbResponse);
                }, this.MS_TIMEOUT);
                socket.on("message", (messageRaw, rinfo) => {
                    if (doBroadcast)
                        if (bufmsg.byteLength == messageRaw.byteLength)
                            return;
                    const messageResult = JSON.parse(messageRaw.toString("utf8"))["result"];
                    console.log(messageResult);
                    bulbResponse.push({ messageResult, rinfo });
                    if (!doBroadcast) {
                        socket.close();
                        resolve(bulbResponse);
                    }
                });
                socket.send(bufmsg, port, ip, () => {
                    if (!returnMessageResult) {
                        socket.close();
                        resolve();
                    }
                });
            });
        });
    }
    static async discoverBulbs() {
        const discoveredBulbs = await this.sendUDPMessage("getPilot", "{}", "255.255.255.255", this.DEFAULT_BULB_PORT, true, true);
        if (discoveredBulbs === undefined)
            return;
        return discoveredBulbs.map((bulb) => {
            let { messageResult, rinfo } = bulb;
            messageResult = messageResult;
            return {
                ip: rinfo.address,
                state: messageResult.state ? "on" : "off",
            };
        });
    }
    pushBulbState() {
        Lib.sendUDPMessage("setPilot", JSON.stringify(this.bulbStateManager.getStateSnapshot()), this.ip, this.port, false, false);
    }
    async pullBulbState() {
        const bulbResponse = await Lib.sendUDPMessage("getPilot", "{}", this.ip, this.port, true, false);
        if (bulbResponse && bulbResponse[0]) {
            const pulledState = bulbResponse[0]
                .messageResult;
            this.bulbStateManager.setStateFromSnapshot(pulledState);
        }
        else
            throw new Error("No response from bulb");
    }
}
exports.Lib = Lib;
Lib.MS_TIMEOUT = 2000;
Lib.DEFAULT_BULB_PORT = 38899;
Lib.FIELD_INCREMENT_BYTE = 17;
Lib.FIELD_INCREMENT_PERCENT = 10;
class BulbStateManager {
    setStateFromSnapshot(snapshot) {
        this.bulbStateSnapshot = snapshot;
    }
    getStateSnapshot() {
        return this.bulbStateSnapshot;
    }
    get state() {
        return this.bulbStateSnapshot.state;
    }
    get sceneId() {
        return this.bulbStateSnapshot.sceneId;
    }
    get r() {
        return this.bulbStateSnapshot.sceneId;
    }
    get g() {
        return this.bulbStateSnapshot.g;
    }
    get b() {
        return this.bulbStateSnapshot.b;
    }
    get dimming() {
        return this.bulbStateSnapshot.dimming;
    }
    get c() {
        return this.bulbStateSnapshot.c;
    }
    get w() {
        return this.bulbStateSnapshot.w;
    }
    set state(state) {
        this.bulbStateSnapshot.state = state;
    }
    set sceneId(sceneId) {
        if (sceneId < 1 || sceneId > 32)
            return;
        this.bulbStateSnapshot.sceneId = sceneId;
    }
    set r(r) {
        if (r < 0 || r > 255)
            return;
        this.bulbStateSnapshot.r = r;
    }
    set g(g) {
        if (g < 0 || g > 255)
            return;
        this.bulbStateSnapshot.g = g;
    }
    set b(b) {
        if (b < 0 || b > 255)
            return;
        this.bulbStateSnapshot.b = b;
    }
    set dimming(dimming) {
        if (dimming < 0 || dimming > 100)
            return;
        this.bulbStateSnapshot.dimming = dimming;
    }
    set c(c) {
        this.bulbStateSnapshot.c = c;
    }
    set w(w) {
        this.bulbStateSnapshot.w = w;
    }
}
//# sourceMappingURL=lib.js.map