import wizlib from "./wizlib"

const tester = async () => {
  let wizlibTester = new wizlib("192.168.1.108");
  let s: iState = await wizlibTester.getPilot();
  s.state = false;
  wizlibTester.setPilot(s);

  // wizlibTester.setPilot('r', 50);
  // wizlibTester.setPilot('g', 10);
  // wizlibTester.setPilot('b', 0);
}


tester();