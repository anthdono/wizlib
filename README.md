#### _wizlib_ - a minimal nodejs library written in typescript for interacting with wiz smartlights

```typescript
import wizlib from "wizlib";

// discover bulbs on the network with the static method
const discoveredBulbs = await wizlib.discover();

// returns an array of objects representing the bulbs found
[
    { ip: "192.168.1.102", state: "on" },
    { ip: "192.168.1.103", state: "on" },
    { ip: "192.168.1.123", state: "off" },
];

// create a bulb instance
const bulb = wizlib.createBulb("192.168.1.102");

// use the various inbuilt methods defined in the api
bulb.turnOn();
bulb.decreaseBrightness();
bulb.setRGB(50, 255, 10);
bulb.increaseRed();
```
