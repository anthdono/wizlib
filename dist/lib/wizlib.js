"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulb = void 0;
const node_dgram_1 = __importDefault(require("node:dgram"));
class Bulb {
    /**
     * @description creates a bulb object
     * @param {ip} ip the bulbs ip address
     * @param {port} port the bulbs port, defaults to 38899 if not provided
     */
    constructor(ip, port = Bulb.DEFAULT_PORT) {
        this.ip = ip;
        this.port = port;
        this.getPilot(); // set local state
    }
    /**
     * @description discovers bulbs on the network
     * @returns an array of objects containing bulb ip and on/off state
     */
    static discover() {
        // create dgram socket object
        const client = node_dgram_1.default.createSocket("udp4");
        // create an array of objects to represent discovered bulbs
        let bulbsDiscovered = new Array();
        // promise resolves after waiting for constant DISCOVERY_TIME
        return new Promise((resolve, _) => {
            client.bind(Bulb.DEFAULT_PORT, () => {
                // discovery seems to fail if socket.SetBroadcast(true) is not called
                client.setBroadcast(true);
                setTimeout(() => {
                    // close socket and stop listening
                    client.close();
                    // resolve promise with discovered bulbs
                    resolve(bulbsDiscovered);
                }, Bulb.DISCOVERY_TIME);
                // listen for bulbs
                client.on("message", (res, deviceInfo) => {
                    var _a;
                    // ip addr of discovered bulb
                    const ip = deviceInfo.address;
                    // on/off state of discovered bulb (undefined in some instances)
                    const isOn = (_a = JSON.parse(res.toString("utf8")).result) === null || _a === void 0 ? void 0 : _a.state;
                    // add discovered bulb obj to array
                    bulbsDiscovered.push({ ip, isOn });
                });
                // broadcast message
                client.send(Bulb.formatMessage("getPilot", ""), Bulb.DEFAULT_PORT, "255.255.255.255");
            });
        });
    }
    /**
     * @description updates the local bulb state from remote and returns the object
     * @return {Promise<State>} the bulb's state
     */
    async getState() {
        await this.getPilot();
        return this.state;
    }
    /**
     * @description increases bulb dimming by a tenth
     */
    increaseDimming() {
        // undefined check
        if (this.state.dimming == undefined)
            // TODO should this be MAX?
            this.state.dimming = Bulb.MIN_DIMMING_RANGE;
        // return if changes would result in illegal value
        if (this.state.dimming + Bulb.DIMMING_INCREMENTS >
            Bulb.MAX_DIMMING_RANGE)
            return;
        // update local value
        this.state.dimming += Bulb.DIMMING_INCREMENTS;
        // update remote value
        this.setPilot();
    }
    /**
     * @description decreases bulb dimming by a tenth
     */
    decreaseDimming() {
        // undefined check
        if (this.state.dimming == undefined)
            // TODO should this be MIN?
            this.state.dimming = Bulb.MAX_DIMMING_RANGE;
        // return if changes would result in illegal value
        if (this.state.dimming - Bulb.DIMMING_INCREMENTS <
            Bulb.MIN_DIMMING_RANGE)
            return;
        // update local value
        this.state.dimming += Bulb.DIMMING_INCREMENTS;
        // update remote value
        this.setPilot();
    }
    /**
     * @description increases an rgb color value on the bulb by a seventeenth
     * @param {color} color to be increase
     */
    increaseColor(color) {
        // undefined check
        if (this.state[color] == undefined)
            this.state[color] = Bulb.MIN_COLOR_RANGE;
        // return if changes would result in illegal value
        if (this.state[color] + Bulb.COLOR_INCREMENTS > Bulb.MAX_COLOR_RANGE)
            return;
        // update local value
        this.state[color] += Bulb.COLOR_INCREMENTS;
        // update remote value
        this.setPilot();
    }
    /**
     * @description decreases an rgb color value on the bulb by a seventeenth
     * @param {color} color to be decreased
     */
    decreaseColor(color) {
        // undefined check
        if (this.state[color] === undefined)
            this.state[color] = Bulb.MAX_COLOR_RANGE;
        // return if changes would result in illegal value
        if (this.state[color] - Bulb.COLOR_INCREMENTS < Bulb.MIN_COLOR_RANGE)
            return;
        // update local value
        this.state[color] -= Bulb.COLOR_INCREMENTS;
        // update remote value
        this.setPilot();
    }
    /**
     * @description updates local bulb state with remote bulb state, returns rgb values of state
     * @returns [[r,g,b]], values are undefined when unavailable
     */
    async getRGB() {
        await this.getPilot();
        return [this.state.r, this.state.g, this.state.b];
    }
    /**
     * @description updates the local bulb state with provded rgb values, then updates the remote bulb state
     */
    setRGB(rgb) {
        this.state.r = rgb[0];
        this.state.g = rgb[1];
        this.state.b = rgb[2];
        this.setPilot();
    }
    // formats method/params args for sending to bulb
    static formatMessage(method, params) {
        return `{"method": "${method}", "params": {${params}}}`;
    }
    /**
     * @description sends instruction/payload pair to remote bulb and listens for a resposne
     * @param {method} method the instruction
     * @param {params} method the payload
     * @returns {Promise<any>} the remote bulbs response
     */
    communicate(method, params) {
        return new Promise((resolve, _) => {
            // create dgram socket object
            const client = node_dgram_1.default.createSocket("udp4");
            // associate dgram client with remote bulb
            client.connect(this.port, this.ip, () => {
                client.on("listening", () => {
                    // timeout after 1 second of listening for response
                    setTimeout(() => {
                        // close socket, stop listening
                        client.close();
                        // throw error indicating that no response was recieved
                        throw new Error("udp response timeout");
                    }, 1000);
                });
                // send udp message to remote bulb
                client.send(Bulb.formatMessage(method, params));
                // listen for the remote bulbs response
                client.on("message", (res) => {
                    // on response, parse response to object
                    const resObject = JSON.parse(res.toString("utf8"));
                    // close socket, stop listening
                    client.close();
                    // resolve the response object (data is in result property)
                    resolve(resObject["result"]);
                });
            });
        });
    }
    /**
     * @description updates local bulb state with remote bulb state
     */
    async getPilot() {
        const state = await this.communicate("getPilot", "");
        this.state = state;
    }
    /**
     * @description updates remote bulb state with local bulb state
     */
    async setPilot() {
        // allow 5 attempts to update remote bulb with local state
        let attempts = 5;
        while (attempts > 0) {
            const res = await this.communicate("setPilot", `"state":${this.state.state},
                             "r":${this.state.r},
                             "g":${this.state.g},
                             "b":${this.state.b},
                             "dimming":${this.state.dimming}`);
            // exit attempt loop if success
            if (res.success)
                return;
            attempts--; // decrement available attempts
        }
        // throw error if all attempts to update remote bulb state failed
        throw new Error("setPilot failed with 5 attempts");
    }
    // UNUSED: gets remote bulb system configuration
    // @ts-ignore
    async getSystemConfig() {
        const res = await this.communicate("getSystemConfig", "");
        return res;
    }
}
exports.Bulb = Bulb;
// bulb discovery
Bulb.DISCOVERY_TIME = 2000;
// default wiz bulb port
Bulb.DEFAULT_PORT = 38899;
// color constants
Bulb.COLOR_INCREMENTS = 15;
Bulb.MIN_COLOR_RANGE = 0;
Bulb.MAX_COLOR_RANGE = 255;
// dimming constants
Bulb.MIN_DIMMING_RANGE = 0;
Bulb.MAX_DIMMING_RANGE = 100;
Bulb.DIMMING_INCREMENTS = 10;
//# sourceMappingURL=wizlib.js.map