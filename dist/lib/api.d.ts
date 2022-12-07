/// <reference types="node" />
import { Lib } from "./lib";
export declare class Api extends Lib {
    constructor(ip: string, port?: number);
    static discover(): Promise<{
        ip: string;
        state: string;
    }[] | undefined>;
    toggleState(): Promise<void | {
        messageResult: "" | {
            state: boolean;
            sceneId: number;
            r: number;
            g: number;
            b: number;
            dimming: number;
            c: number;
            w: number;
        };
        rinfo: import("dgram").RemoteInfo;
    }[]>;
    turnOff(): void;
    turnOn(): void;
    setBrightness(brightness: number): void;
    increaseBrightness(): void;
    decreaseBrightness(): void;
    setScene(sceneId: string): void;
    setWhite(white: number): void;
    increaseWhite(): void;
    decreaseWhite(): void;
    setTemperature(temperature: number): void;
    increaseTemperature(): void;
    decreaseTemperature(): void;
    setRGB(red: number, green: number, blue: number): void;
    increaseRed(): void;
    decreaseRed(): void;
    increaseGreen(): void;
    decreaseGreen(): void;
    increaseBlue(): void;
    decreaseBlue(): void;
}
