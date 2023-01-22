/// <reference types="node" />
import { Lib } from "./lib";
declare class Api extends Lib {
    private constructor();
    static createBulb(ip: string, port?: number): Api;
    static discover(): Promise<{
        ip: string;
        state: string;
    }[] | undefined>;
    toggleState(): Promise<void | {
        messageResult: "" | {
            state: boolean;
            sceneId?: number | undefined;
            r: number;
            g: number;
            b: number;
            dimming: number;
            temp?: number | undefined;
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
export default Api;
