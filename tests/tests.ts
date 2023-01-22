import wizlib from "wizlib";

async function main() {
    console.log("begin");

    const bulb = wizlib.createBulb("192.168.1.108");

    const func = () => bulb.increaseWhite

    setTimeout(() => {
        func();
    }, 1000);
    setTimeout(() => {
        func();
    }, 2000);
    setTimeout(() => {
        func();
    }, 3000);
    setTimeout(() => {
        func();
    }, 4000);
    setTimeout(() => {
        func();
    }, 5000);
    setTimeout(() => {
        func();
    }, 6000);
}
main();
