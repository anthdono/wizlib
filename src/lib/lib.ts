import dgram from "node:dgram";

type BulbStateSnapshot = {
    state: boolean; // on/off
    sceneId?: number; // preset scene 1-32
    r: number; // red 0 - 255
    g: number; // green 0 - 255
    b: number; // blue 0 - 255
    dimming: number; // dimming, 0 - 100, increments 10
    temp?: number; // color temperature
    w: number; // white
};

type BulbSystemConfigSnapshot = ""; // TODO: implement
type BulbResponse = {
    messageResult: BulbMessageResult;
    rinfo: dgram.RemoteInfo;
};
type BulbMessageResult = BulbStateSnapshot | BulbSystemConfigSnapshot;
type RGB = { r: number; g: number; b: number };

export class Lib {
    private havePulledInitialState = false;

    private static MS_TIMEOUT = 2000;
    private static DEFAULT_BULB_PORT = 38899;

    private static FIELD_INCREMENT_BYTE = 17;
    private static FIELD_INCREMENT_PERCENT = 10;

    private ip: string;
    private port: number;
    protected bulbStateManager = new BulbStateManager();

    constructor(ip: string, port: number = Lib.DEFAULT_BULB_PORT) {
        this.ip = ip;
        this.port = port;
    }

    public async changeState(
        field: keyof BulbStateSnapshot | "colors",
        change: "increase" | "decrease" | "toggle" | "set",
        value?: boolean | number | string | RGB
    ): Promise<void | BulbResponse[]> {
        if (!this.havePulledInitialState) {
            await this.pullBulbState();
            this.havePulledInitialState = true;
        }

        switch (field) {
            case "state":
                switch (change) {
                    case "toggle":
                        this.bulbStateManager.state =
                            !this.bulbStateManager.state;
                        break;
                    case "set":
                        this.bulbStateManager.state = value as boolean;
                        break;
                }
                break;

            case "sceneId":
                switch (change) {
                    case "set":
                        this.bulbStateManager.sceneId = value as number;
                        break;
                }
                break;

            case "r":
                this.ensureSceneCleared();
                switch (change) {
                    case "increase":
                        this.bulbStateManager.r += Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "decrease":
                        this.bulbStateManager.r -= Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "set":
                        this.bulbStateManager.r = value as number;
                        break;
                }
                break;

            case "g":
                this.ensureSceneCleared();
                switch (change) {
                    case "increase":
                        this.bulbStateManager.g += Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "decrease":
                        this.bulbStateManager.g -= Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "set":
                        this.bulbStateManager.g = value as number;
                        break;
                }
                break;

            case "b":
                this.ensureSceneCleared();
                switch (change) {
                    case "increase":
                        this.bulbStateManager.b += Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "decrease":
                        this.bulbStateManager.b -= Lib.FIELD_INCREMENT_BYTE;
                        break;
                    case "set":
                        this.bulbStateManager.b = value as number;
                        break;
                }
                break;

            case "dimming":
                switch (change) {
                    case "increase":
                        if (this.bulbStateManager.dimming)
                            this.bulbStateManager.dimming +=
                                Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "decrease":
                        if (this.bulbStateManager.dimming)
                            this.bulbStateManager.dimming -=
                                Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "set":
                        this.bulbStateManager.dimming = value as number;
                        break;
                }
                break;

            case "temp":
                switch (change) {
                    case "increase":
                        if (this.bulbStateManager.temp)
                            this.bulbStateManager.temp +=
                                Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "decrease":
                        if (this.bulbStateManager.temp)
                            this.bulbStateManager.temp -=
                                Lib.FIELD_INCREMENT_PERCENT;
                        break;
                    case "set":
                        this.bulbStateManager.temp = value as number;
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
                        this.bulbStateManager.w = value as number;
                        break;
                }
                break;
            case "colors": {
                if (change != "set")
                    throw new Error("collective colors can only be set");
                if (Object.keys(value!).includes("r" && "g" && "b")) {
                    this.ensureSceneCleared();
                    const { r, g, b } = value as RGB;
                    this.bulbStateManager.r = r;
                    this.bulbStateManager.g = g;
                    this.bulbStateManager.b = b;
                }
            }
        }
        this.pushBulbState();
    }

    private static async sendUDPMessage(
        method: string,
        params: string,
        ip: string,
        port: number,
        returnMessageResult: boolean,
        doBroadcast: boolean
    ): Promise<BulbResponse[] | void> {
        const bufmsg = Buffer.from(
            `{"method": "${method}", "params": ${params}}`
        );
        const socket = dgram.createSocket("udp4");
        const bulbResponse = new Array<BulbResponse>();

        return new Promise((resolve, _) => {
            socket.bind(port, () => {
                // discoveries seems to fail when socket.SetBroadcast(true)
                // is not called
                if (doBroadcast) {
                    socket.setBroadcast(true);
                    setTimeout(() => {
                        socket.close();
                        resolve(bulbResponse);
                    }, this.MS_TIMEOUT);
                }
                socket.on(
                    "message",
                    (messageRaw: Buffer, rinfo: dgram.RemoteInfo) => {
                        // ignore own broadcast (causes error when parsing to json)
                        if (doBroadcast)
                            if (bufmsg.byteLength == messageRaw.byteLength)
                                return;
                        const messageResult = JSON.parse(
                            messageRaw.toString("utf8")
                        )["result"];
                        bulbResponse.push({ messageResult, rinfo });
                        if (!doBroadcast) {
                            socket.close();
                            resolve(bulbResponse);
                        }
                    }
                );
                socket.send(bufmsg, port, ip, () => {
                    if (!returnMessageResult) {
                        socket.close();
                        resolve();
                    }
                });
            });
        });
    }

    protected static async discoverBulbs() {
        const discoveredBulbs = await this.sendUDPMessage(
            "getPilot",
            "{}",
            "255.255.255.255",
            this.DEFAULT_BULB_PORT,
            true,
            true
        );
        if (discoveredBulbs === undefined) return;
        return discoveredBulbs.map((bulb) => {
            let { messageResult, rinfo } = bulb;
            messageResult = messageResult as BulbStateSnapshot;
            return {
                ip: rinfo.address,
                state: messageResult.state ? "on" : "off",
            };
        });
    }

    private pushBulbState() {
        Lib.sendUDPMessage(
            "setPilot",
            JSON.stringify(this.bulbStateManager.getStateSnapshot()),
            this.ip,
            this.port,
            false,
            false
        );
    }

    private async pullBulbState() {
        const bulbResponse = await Lib.sendUDPMessage(
            "getPilot",
            "{}",
            this.ip,
            this.port,
            true,
            false
        );
        if (bulbResponse && bulbResponse[0]) {
            const pulledState = bulbResponse[0]
                .messageResult as BulbStateSnapshot;
            this.bulbStateManager.setStateFromSnapshot(pulledState);
        } else throw new Error("No response from bulb");
    }

    private ensureSceneCleared() {
        this.bulbStateManager.clearScene();
    }
}

class BulbStateManager implements BulbStateSnapshot {
    private bulbStateSnapshot: BulbStateSnapshot;

    setStateFromSnapshot(snapshot: BulbStateSnapshot) {
        this.bulbStateSnapshot = snapshot;
    }

    getStateSnapshot(): BulbStateSnapshot {
        return this.bulbStateSnapshot;
    }

    clearScene(): void {
        this.sceneId = undefined;
        delete this.sceneId;

        this.temp = undefined;
        delete this.temp;
    }

    get state(): boolean {
        return this.bulbStateSnapshot.state;
    }

    set state(state: boolean) {
        this.bulbStateSnapshot.state = state;
    }

    get sceneId(): number | undefined {
        return this.bulbStateSnapshot.sceneId;
    }

    set sceneId(sceneId: number | undefined) {
        if (sceneId)
            if (sceneId < 1 || sceneId > 32)
                throw new Error("sceneId must be between 1 and 32");
        this.bulbStateSnapshot.sceneId = sceneId;
    }

    get r(): number {
        return this.bulbStateSnapshot.r;
    }

    set r(r: number) {
        if (r < 0 || r > 255) return;
        this.bulbStateSnapshot.r = r;
    }

    get g(): number {
        return this.bulbStateSnapshot.g;
    }

    set g(g: number) {
        if (g < 0 || g > 255) return;
        this.bulbStateSnapshot.g = g;
    }

    get b(): number {
        return this.bulbStateSnapshot.b;
    }

    set b(b: number) {
        if (b < 0 || b > 255) return;
        this.bulbStateSnapshot.b = b;
    }

    get dimming(): number {
        return this.bulbStateSnapshot.dimming;
    }

    set dimming(dimming: number) {
        if (dimming < 0 || dimming > 100) return;
        this.bulbStateSnapshot.dimming = dimming;
    }

    get temp(): number | undefined {
        return this.bulbStateSnapshot.temp;
    }

    set temp(temp: number | undefined) {
        this.bulbStateSnapshot.temp = temp;
    }

    get w(): number {
        return this.bulbStateSnapshot.w;
    }

    set w(w: number) {
        this.bulbStateSnapshot.w = w;
    }
}
