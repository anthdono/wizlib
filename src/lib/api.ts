import { Lib } from "./lib";

export class Api extends Lib {
    constructor(ip: string, port?: number) {
        super(ip, port);
    }
    //////////////////////////////////////////////////////

    public static discover() {
        return Lib.discoverBulbs();
    }
    //////////////////////////////////////////////////////

    public toggleState() {
        return this.changeState("state", "toggle");
    }
    public turnOff() {
        this.changeState("state", "set", false);
    }
    public turnOn() {
        this.changeState("state", "set", true);
    }

    //////////////////////////////////////////////////////

    public setBrightness(brightness: number) {
        this.changeState("dimming", "set", brightness);
    }
    public increaseBrightness() {
        this.changeState("dimming", "increase");
    }
    public decreaseBrightness() {
        this.changeState("dimming", "decrease");
    }

    //////////////////////////////////////////////////////

    public setScene(sceneId: string) {
        this.changeState("sceneId", "set", sceneId);
    }

    //////////////////////////////////////////////////////

    public setWhite(white: number) {
        this.changeState("w", "set", white);
    }
    public increaseWhite() {
        this.changeState("w", "increase");
    }
    public decreaseWhite() {
        this.changeState("w", "decrease");
    }

    //////////////////////////////////////////////////////

    public setTemperature(temperature: number) {
        this.changeState("w", "set", temperature);
    }
    public increaseTemperature() {
        this.changeState("w", "increase");
    }
    public decreaseTemperature() {
        this.changeState("w", "decrease");
    }

    //////////////////////////////////////////////////////

    public setRGB(red: number, green: number, blue: number) {
        this.changeState("color", "set", { r: red, g: green, b: blue });
    }
    public increaseRed() {
        this.changeState("color", "increase", "r");
    }
    public decreaseRed() {
        this.changeState("color", "decrease", "r");
    }
    public increaseGreen() {
        this.changeState("color", "increase", "g");
    }
    public decreaseGreen() {
        this.changeState("color", "decrease", "g");
    }
    public increaseBlue() {
        this.changeState("color", "increase", "b");
    }
    public decreaseBlue() {
        this.changeState("color", "decrease", "b");
    }
}
