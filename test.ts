import {Api} from "./src/lib/api"

const f = async () => {
    const y = new Api("192.168.1.108");
    y.turnOn();

}

f()

