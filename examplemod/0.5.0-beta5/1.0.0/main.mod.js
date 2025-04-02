import '../../../PolyModLoader.js';

class ExampleMod extends globalThis.PolyMod {
    constructor() {
        super("examplemod", "Example Mod", "Example Man", "1.0.0", "0.5.0-beta5");
    }
}

export let polyMod = new ExampleMod();