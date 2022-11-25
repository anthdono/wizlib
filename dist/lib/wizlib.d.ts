export declare class Bulb {
    /**
     * @description discovers bulbs on the network
     * @returns an array of objects containing bulb ip and on/off state
     */
    static discover(): Promise<{
        ip: string;
        isOn: boolean | undefined;
    }[]>;
    /**
     * @description updates the local bulb state from remote and returns the object
     * @return {Promise<State>} the bulb's state
     */
    getState(): Promise<State>;
    /**
     * @description increases bulb dimming by a tenth
     */
    increaseDimming(): void;
    /**
     * @description decreases bulb dimming by a tenth
     */
    decreaseDimming(): void;
    /**
     * @description increases an rgb color value on the bulb by a seventeenth
     * @param {color} color to be increase
     */
    increaseColor(color: "r" | "g" | "b"): void;
    /**
     * @description decreases an rgb color value on the bulb by a seventeenth
     * @param {color} color to be decreased
     */
    decreaseColor(color: "r" | "g" | "b"): void;
    /**
     * @description updates local bulb state with remote bulb state, returns rgb values of state
     * @returns [[r,g,b]], values are undefined when unavailable
     */
    getRGB(): Promise<[
        number | undefined,
        number | undefined,
        number | undefined
    ]>;
    /**
     * @description updates the local bulb state with provded rgb values, then updates the remote bulb state
     */
    setRGB(rgb: [number, number, number]): void;
    private static DISCOVERY_TIME;
    private static DEFAULT_PORT;
    private static COLOR_INCREMENTS;
    private static MIN_COLOR_RANGE;
    private static MAX_COLOR_RANGE;
    private static MIN_DIMMING_RANGE;
    private static MAX_DIMMING_RANGE;
    private static DIMMING_INCREMENTS;
    private ip;
    private port;
    private state;
    /**
     * @description creates a bulb object
     * @param {ip} ip the bulbs ip address
     * @param {port} port the bulbs port, defaults to 38899 if not provided
     */
    constructor(ip: string, port?: number);
    private static formatMessage;
    /**
     * @description sends instruction/payload pair to remote bulb and listens for a resposne
     * @param {method} method the instruction
     * @param {params} method the payload
     * @returns {Promise<any>} the remote bulbs response
     */
    private communicate;
    /**
     * @description updates local bulb state with remote bulb state
     */
    private getPilot;
    /**
     * @description updates remote bulb state with local bulb state
     */
    private setPilot;
    private getSystemConfig;
}
declare type State = {
    mac?: string;
    rssi?: number;
    src?: string;
    state?: boolean;
    sceneId?: number;
    r?: number;
    g?: number;
    b?: number;
    dimming?: number;
    c?: number;
    w?: number;
};
export {};
