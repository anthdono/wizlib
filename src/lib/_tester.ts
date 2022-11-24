import { Bulb } from "./wizlib";

const main = async () => {
    const x = await Bulb.discover();
    console.log(x);
    /** let testBulb = new Bulb("192.168.1.108"); */
    // console.log(await testBulb.getState());

};
main();
/** testBulb.getPilot().then((res) => { */
/**     console.log(res); */
/** }); */

/** let s: iState = await wizlibTester.getPilot(); */
/** s.state = false; */
/** wizlibTester.setPilot(s); */

// wizlibTester.setPilot('r', 50);
// wizlibTester.setPilot('g', 10);
// wizlibTester.setPilot('b', 0);
