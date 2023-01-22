/// <reference types="node" />
import dgram from "node:dgram";
type BulbStateSnapshot = {
    state: boolean;
    sceneId?: number;
    r: number;
    g: number;
    b: number;
    dimming: number;
    temp?: number;
    w: number;
};
type BulbSystemConfigSnapshot = "";
type BulbResponse = {
    messageResult: BulbMessageResult;
    rinfo: dgram.RemoteInfo;
};
type BulbMessageResult = BulbStateSnapshot | BulbSystemConfigSnapshot;
type RGB = {
    r: number;
    g: number;
    b: number;
};
export declare class Lib {
    private havePulledInitialState;
    private static MS_TIMEOUT;
    private static DEFAULT_BULB_PORT;
    private static FIELD_INCREMENT_BYTE;
    private static FIELD_INCREMENT_PERCENT;
    private ip;
    private port;
    protected bulbStateManager: BulbStateManager;
    constructor(ip: string, port?: number);
    changeState(field: keyof BulbStateSnapshot | "colors", change: "increase" | "decrease" | "toggle" | "set", value?: boolean | number | string | RGB): Promise<void | BulbResponse[]>;
    private static sendUDPMessage;
    protected static discoverBulbs(): Promise<{
        ip: string;
        state: string;
    }[] | undefined>;
    private pushBulbState;
    private pullBulbState;
    private ensureSceneCleared;
}
declare class BulbStateManager implements BulbStateSnapshot {
    private bulbStateSnapshot;
    setStateFromSnapshot(snapshot: BulbStateSnapshot): void;
    getStateSnapshot(): BulbStateSnapshot;
    clearScene(): void;
    get state(): boolean;
    set state(state: boolean);
    get sceneId(): number | undefined;
    set sceneId(sceneId: number | undefined);
    get r(): number;
    set r(r: number);
    get g(): number;
    set g(g: number);
    get b(): number;
    set b(b: number);
    get dimming(): number;
    set dimming(dimming: number);
    get temp(): number | undefined;
    set temp(temp: number | undefined);
    get w(): number;
    set w(w: number);
}
export {};
