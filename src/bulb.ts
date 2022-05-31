export class Bulb implements iBulb {
  public _ip: string;
  public _port: number;
  public _state: iState;

  constructor(ip: string) {
    this._ip = ip;
    this._port = 38899;
    this._state = new class implements iState {
      b: number;
      c: number;
      dimming: number;
      g: number;
      mac: string;
      r: number;
      rssi: number;
      sceneId: number;
      src: string;
      state: boolean;
      w: number;
    };

  }
}
