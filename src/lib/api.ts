import { Lib } from "./lib";

class Api extends Lib {
    private constructor(ip: string, port?: number) {
        super(ip, port);
    }
    public static createBulb(ip: string, port?: number) {
        return new Api(ip, port);
    }
    public static discover() {
        return Lib.discoverBulbs();
    }
    public toggleState() {
        return this.changeState("state", "toggle");
    }
    public turnOff() {
        this.changeState("state", "set", false);
    }
    public turnOn() {
        this.changeState("state", "set", true);
    }
    public setBrightness(brightness: number) {
        this.changeState("dimming", "set", brightness);
    }
    public increaseBrightness() {
        this.changeState("dimming", "increase");
    }
    public decreaseBrightness() {
        this.changeState("dimming", "decrease");
    }
    public setScene(sceneId: string) {
        this.changeState("sceneId", "set", sceneId);
    }
    public setWhite(white: number) {
        this.changeState("w", "set", white);
    }
    public increaseWhite() {
        this.changeState("w", "increase");
    }
    public decreaseWhite() {
        this.changeState("w", "decrease");
    }
    public setTemperature(temperature: number) {
        this.changeState("w", "set", temperature);
    }
    public increaseTemperature() {
        this.changeState("w", "increase");
    }
    public decreaseTemperature() {
        this.changeState("w", "decrease");
    }
    public setRGB(red: number, green: number, blue: number) {
        this.changeState("colors", "set", { r: red, g: green, b: blue });
    }
    public increaseRed() {
        this.changeState("r", "increase");
    }
    public decreaseRed() {
        this.changeState("r", "decrease");
    }
    public increaseGreen() {
        this.changeState("g", "increase");
    }
    public decreaseGreen() {
        this.changeState("g", "decrease");
    }
    public increaseBlue() {
        this.changeState("b", "increase");
    }
    public decreaseBlue() {
        this.changeState("b", "decrease");
    }
}

export default Api;
