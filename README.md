#### _wizlib_ - a minimal nodejs typescript library for interacting with wiz smartlights

```typescript
import { Bulb } from "wizlib";

...

// static async method that attempts to discover bulbs
const bulbs =  await Bulb.discover();

console.log(bulbs);
> {: "192.168.1.15", }
// where bulbs is an array of {ip: string, isOn boolean}

...

// create bulb object for manipulation
// ie from discovered bulbs
const myBulb = new Bulb(bulbs[0].)


```
