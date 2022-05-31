import dgram from "node:dgram";
import {Bulb} from "./bulb";

export default class Wizlib {
  // private readonly _client: dgram.Socket;
  public _bulb: Bulb;

  constructor(ip: string) {
    // this._client = dgram.createSocket("udp4");
    this._bulb = new Bulb(ip);
    // this.getPilot();
  }


  private inUdpMessageFormat(method: string, params: string) {
    return `{"method": "${method}", "params": {${params}}}`;
  }

  private sendMsgGetResponse(method: string, params: string): Promise<any> {
    return new Promise((resolve, reject) => {

      const client = dgram.createSocket("udp4");
      client.connect(this._bulb._port, this._bulb._ip, () => {

        // client.on("listening", () => {
        //   setTimeout(() => {
        //     reject("timeout");
        //   }, 100);
        // });

        client.send(this.inUdpMessageFormat(method, params), this._bulb._port, this._bulb._ip);

        client.on("message",
            (res) => {
              let resObject = JSON.parse(res.toString('utf8'));
              client.close();
              resolve((resObject['result']));
            });
      });


    });
  }

  /**
   * gets the state of a bulb and updates the bulb object
   */

  public async getPilot() {

    /* call function to get state of bulb as the response */
    const res = await this.sendMsgGetResponse("getPilot", "");
    return await <iState>res;
    /* assign bulb state to res state*/

    //   console.log(await this.sendMsgGetResponse('getSystemConfig', ''));
  }

  public async setPilot(state: iState) {


    const res: setPilotResponse =
        await this.sendMsgGetResponse(
            "setPilot",
            `"state":${state.state},
                     "r":${state.r},
                     "g":${state.g},
                     "b":${state.b},
                     "dimming":${state.dimming}`
        );

    if (res == undefined || !(res).success) throw new Error("setPilot was unsuccessful");
    // "dimming":${this._bulb._state.dimming}\`);
  }

  // private async getSystemConfig() {
  // }


// public findALight()
// {
//
//
// }

}


