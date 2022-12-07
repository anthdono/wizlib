/// <reference types="node" />
import dgram from "node:dgram";
type BulbStateSnapshot = {
    state: boolean;
    sceneId: number;
    r: number;
    g: number;
    b: number;
    dimming: number;
    c: number;
    w: number;
};
type BulbSystemConfigSnapshot = "";
type BulbResponse = {
    messageResult: BulbMessageResult;
    rinfo: dgram.RemoteInfo;
};
type BulbMessageResult = BulbStateSnapshot | BulbSystemConfigSnapshot;
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
    changeState(field: keyof BulbStateSnapshot | "color", change: "increase" | "decrease" | "toggle" | "set", value?: boolean | number | string | {
        r: number;
        g: number;
        b: number;
    }): Promise<void | BulbResponse[]>;
    private static sendUDPMessage;
    static discoverBulbs(): Promise<{
        ip: string;
        state: string;
    }[] | undefined>;
    private pushBulbState;
    private pullBulbState;
}
declare class BulbStateManager implements BulbStateSnapshot {
    private bulbStateSnapshot;
    setStateFromSnapshot(snapshot: BulbStateSnapshot): void;
    getStateSnapshot(): BulbStateSnapshot;
    get state(): boolean;
    get sceneId(): number;
    get r(): number;
    get g(): number;
    get b(): number;
    get dimming(): number;
    get c(): number;
    get w(): number;
    set state(state: boolean);
    set sceneId(sceneId: number);
    set r(r: number);
    set g(g: number);
    set b(b: number);
    set dimming(dimming: number);
    set c(c: number);
    set w(w: number);
}
export {};
