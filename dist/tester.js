"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wizlib_1 = __importDefault(require("./wizlib"));
const tester = async () => {
    let wizlibTester = new wizlib_1.default("192.168.1.108");
    let s = await wizlibTester.getPilot();
    s.state = false;
    wizlibTester.setPilot(s);
};
tester();
//# sourceMappingURL=tester.js.map