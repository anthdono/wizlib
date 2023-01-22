"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
class Api extends lib_1.Lib {
    constructor(ip, port) {
        super(ip, port);
    }
    static createBulb(ip, port) {
        return new Api(ip, port);
    }
    static discover() {
        return lib_1.Lib.discoverBulbs();
    }
    toggleState() {
        return this.changeState("state", "toggle");
    }
    turnOff() {
        this.changeState("state", "set", false);
    }
    turnOn() {
        this.changeState("state", "set", true);
    }
    setBrightness(brightness) {
        this.changeState("dimming", "set", brightness);
    }
    increaseBrightness() {
        this.changeState("dimming", "increase");
    }
    decreaseBrightness() {
        this.changeState("dimming", "decrease");
    }
    setScene(sceneId) {
        this.changeState("sceneId", "set", sceneId);
    }
    setWhite(white) {
        this.changeState("w", "set", white);
    }
    increaseWhite() {
        this.changeState("w", "increase");
    }
    decreaseWhite() {
        this.changeState("w", "decrease");
    }
    setTemperature(temperature) {
        this.changeState("w", "set", temperature);
    }
    increaseTemperature() {
        this.changeState("w", "increase");
    }
    decreaseTemperature() {
        this.changeState("w", "decrease");
    }
    setRGB(red, green, blue) {
        this.changeState("colors", "set", { r: red, g: green, b: blue });
    }
    increaseRed() {
        this.changeState("r", "increase");
    }
    decreaseRed() {
        this.changeState("r", "decrease");
    }
    increaseGreen() {
        this.changeState("g", "increase");
    }
    decreaseGreen() {
        this.changeState("g", "decrease");
    }
    increaseBlue() {
        this.changeState("b", "increase");
    }
    decreaseBlue() {
        this.changeState("b", "decrease");
    }
}
exports.default = Api;
//# sourceMappingURL=api.js.map