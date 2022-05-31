interface iState {
  mac?: string;
  rssi?: number;
  src?: string;
  state?: boolean;
  sceneId?: number;
  r?: number;
  g?: number;
  b?: number;
  c?: number;
  w?: number;
  dimming?: number; /* 0 - 100, +10 increments */
}

type ValueOf<Key> = typeof State[Key];

type setPilotResponse = {success: boolean};

interface iBulb {
  _ip: string;
  _port: number;
  _state: iState;
}

