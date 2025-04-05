export class PolyMod {
    get author() {
        return this.modAuthor;
    }
    get id() {
        return this.modId;
    }
    get name() {
        return this.modName;
    }
    get version() {
        return this.modVersion;
    }
    get iconSrc() {
        return this.IconSrc;
    }
    set iconSrc(src) {
        this.IconSrc = src;
    }
    get isLoaded() {
        return this.loaded;
    }
    set setLoaded(status) {
        this.loaded = status;
    }
    get baseUrl() {
        return this.modBaseUrl;
    }
    set baseUrl(url) {
        this.modBaseUrl = url;
    }
    get touchesPhysics() {
        return this.touchingPhysics;
    }
    get dependencies() {
        return this.modDependencies;
    }
    get savedLatest() {
        return this.latestSaved;
    }
    set savedLatest(latest) {
        this.latestSaved = latest;
    }
    applyManifest = (manifest) => {
        // this.modName = manifest.name;
        // this.polyVersion = manifest.target;
        // this.modVersion = manifest.version;
        // this.modId = manifest.id;
        // this.modAuthor = manifest.author;
        // this.modDependencies = manifest.dependencies;
        // this.assetFolder = manifest.assets;
        const mod = manifest.polymod;
        this.modName = mod.name;
        this.modID = mod.id;
        this.modAuthor = mod.author;
        this.modVersion = mod.version;
        this.modDescription = mod.description;

        this.polyVersion = mod.target;
        this.assetFolder = "assets";
        this.modDependencies = manifest.dependencies;
    }
    init = (pmlInstance) => { }
    postInit = () => { }
    simInit = () => { }
}

export const MixinType = Object.freeze({
    HEAD: 0,
    TAIL: 1,
    OVERRIDE: 2
})

export class PolyModLoader {
    constructor(polyVersion) {
        this.polyVersion = polyVersion
        this.allMods = []
        this.physicsTouched = false;
        this.simWorkerClassMixins = []
        this.simWorkerFuncMixins = []
    }
    initStorage = (localStorage) => {
        this.localStorage = localStorage;
        this.polyModUrls = this.getPolyModsStorage();
    }
    importMods = async () => {
        for (let polyModObject of this.polyModUrls) {
            let latest = false;
            if (polyModObject.version === "latest") {
                try {
                    latest = true;
                    const latestFile = await fetch(`${polyModObject.base}/latest.json`).then(r => r.json())
                    polyModObject.version = latestFile[this.polyVersion];
                } catch {
                    alert(`Couldn't find latest version for ${polyModObject.base}`)
                }
            }
            const polyModUrl = `${polyModObject.base}/${polyModObject.version}`;
            try {
                const manifestFile = await fetch(`${polyModUrl}/manifest.json`).then(r => r.json())
                try {
                    let mod = manifestFile.polymod;
                    const modImport = await import(`${polyModUrl}/${mod.main}`);

                    let newMod = modImport.polyMod;
                    mod.version = polyModObject.version;
                    if (this.getMod(mod.id)) {
                        alert(`Duplicate mod detected: ${mod.name}`)
                    }
                    newMod.applyManifest(manifestFile)
                    newMod.applyManifest = (nothing) => { console.warn("Can't apply manifest after initialization!") }
                    newMod.savedLatest = latest;
                    newMod.iconSrc = `${polyModUrl}/icon.png`
                    newMod.baseUrl = polyModObject.base;
                    if (polyModObject.loaded) {
                        newMod.setLoaded = true;
                        if (newMod.touchesPhysics) {
                            this.physicsTouched = true;
                        }
                    }
                    this.allMods.push(newMod);
                } catch {
                    alert(`Mod ${mod.name} failed to load.`);
                }
            } catch {
                alert(`Couldn't load mod with URL ${polyModUrl}.`);
            }
        }
    }
    getPolyModsStorage = () => {
        if (this.localStorage.getItem("polyMods")) {
            this.polyModUrls = JSON.parse(this.localStorage.getItem("polyMods"));
        } else {
            this.polyModUrls = [
                {
                    "base": "http://localhost:8000/pmlcore",
                    "version": "latest",
                    "loaded": true
                }
            ]
            this.localStorage.setItem("polyMods", JSON.stringify(this.polyModUrls));
        }
        return this.polyModUrls;
    }
    serializeMod = (mod) => {
        return { "base": mod.baseUrl, "version": mod.savedLatest ? "latest" : mod.version, "loaded": mod.isLoaded };
    }
    saveModsToLocalStorage = () => {
        let savedMods = []
        for (let mod of this.allMods) {
            savedMods.push(this.serializeMod(mod));
        }
        this.polyModUrls = savedMods;
        this.localStorage.setItem("polyMods", JSON.stringify(this.polyModUrls));
    }
    /**
     * Reorder a mod in the internal list to change its priority in mod loading.
     * 
     * @param {PolyMod} mod  - The mod to reorder.
     * @param {number} delta - The amount to reorder it by. Positive numbers decrease priority, negative numbers increase priority.
     */
    reorderMod = (mod, delta) => {
        if (!mod) return;
        const currentIndex = this.allMods.indexOf(mod);
        if ((currentIndex === 1) || delta > 0) return;
        if (currentIndex === null || currentIndex === undefined) {
            alert("This mod isn't loaded");
            return;
        }
        const temp = this.allMods[currentIndex + delta];
        this.allMods[currentIndex + delta] = this.allMods[currentIndex];
        this.allMods[currentIndex] = temp;
        this.saveModsToLocalStorage();
    }
    /**
     * Add a mod to the internal mod list. Added mod is given least priority.
     * 
     * @param {PolyMod} polyModObject - The mod object to add.
     */
    addMod = async (polyModObject) => {
        let latest = false;
        if (polyModObject.version === "latest") {
            try {
                latest = true;
                const latestFile = await fetch(`${polyModObject.base}/latest.json`).then(r => r.json());
                console.log(latestFile)
                polyModObject.version = latestFile[this.polyVersion];
            } catch {
                alert(`Couldn't find latest version for ${polyModObject.base}`)
            }
        }
        const polyModUrl = `${polyModObject.base}/${polyModObject.version}`;
        try {
            const manifestFile = await fetch(`${polyModUrl}/manifest.json`).then(r => r.json());
            const mod = manifestFile.polymod;
            if (this.getMod(mod.id)) {
                alert("This mod is already present!");
                return;
            }
            try {
                const modImport = await import(`${polyModUrl}/${mod.main}`);
                let newMod = modImport.polyMod;
                newMod.iconSrc = `${polyModUrl}/icon.png`;
                mod.version = polyModObject.version;
                newMod.applyManifest(manifestFile);
                newMod.savedLatest = latest;
                newMod.baseUrl = polyModObject.base;
                polyModObject.loaded = false;
                this.allMods.push(newMod);
                this.saveModsToLocalStorage();
            } catch {
                alert("Something went wrong importing this mod!");
                return;
            }
        } catch {
            alert(`Couldn't find mod manifest for "${polyModObject.base}".`);
        }
    }
    /**
     * Set the loaded state of a mod.
     * 
     * @param {PolyMod} mod   - The mod to set the state of.
     * @param {boolean} state - The state to set. `true` is loaded, `false` is unloaded.
     */
    setModLoaded = (mod, state) => {
        if (!mod) return;
        mod.loaded = state;
        this.saveModsToLocalStorage();
    }
    initMods = () => {
        for (let polyMod of this.allMods) {
            if (polyMod.isLoaded) polyMod.init(this);
        }
    }
    postInitMods = () => {
        for (let polyMod of this.allMods) {
            if (polyMod.isLoaded) polyMod.postInit();
        }
    }
    simInitMods = () => {
        for (let polyMod of this.allMods) {
            if (polyMod.isLoaded) polyMod.simInit();
        }
    }
    getMod(id) {
        if (id === "pmlcore") {
            return;
        }
        for (let polyMod of this.allMods) {
            if (polyMod.id == id) return polyMod;
        }
    }
    get getAllMods() {
        return this.allMods;
    }
    get lbInvalid() {
        return this.physicsTouched;
    }
    getFromPolyTrack = (path) => { }
    /**
     * Inject mixin under scope {@link scope} with target function name defined by {@link path}.
     * This only injects functions in `main.bundle.js`.
     * 
     * @param {string} scope        - The scope under which mixin is injected.
     * @param {string} path         - The path under the {@link scope} which the mixin targets.
     * @param {MixinType} mixinType - The type of injection.
     * @param {string[]} accessors  - A list of strings to evaluate to access private variables.
     * @param {function} func       - The new function to be injected.
     */
    registerClassMixin = (scope, path, mixinType, accessors, func) => { }
    /**
     * Inject mixin with target function name defined by {@link path}.
     * This only injects functions in `main.bundle.js`.
     * 
     * @param {string} path         - The path of the function which the mixin targets.
     * @param {MixinType} mixinType - The type of injection.
     * @param {string[]} accessors  - A list of strings to evaluate to access private variables.
     * @param {function} func       - The new function to be injected.
     */
    registerFuncMixin = (path, mixinType, accessors, func) => { }
    /**
     * Inject mixin under scope {@link scope} with target function name defined by {@link path}.
     * This only injects functions in `simulation_worker.bundle.js`.
     * 
     * @param {string} scope        - The scope under which mixin is injected.
     * @param {string} path         - The path under the {@link scope} which the mixin targets.
     * @param {MixinType} mixinType - The type of injection.
     * @param {string[]} accessors  - A list of strings to evaluate to access private variables.
     * @param {function} func       - The new function to be injected.
     */
    registerSimWorkerClassMixin = (scope, path, mixinType, accessors, func) => {
        this.physicsTouched = true;
        this.simWorkerClassMixins.push({
            scope: scope,
            path: path,
            mixinType: mixinType,
            accessors: accessors,
            funcString: func.toString()
        })
    }
    /**
     * Inject mixin with target function name defined by {@link path}.
     * This only injects functions in `simulation_worker.bundle.js`.
     * 
     * @param {string} path         - The path of the function which the mixin targets.
     * @param {MixinType} mixinType - The type of injection.
     * @param {string[]} accessors  - A list of strings to evaluate to access private variables.
     * @param {function} func       - The new function to be injected.
     */
    registerSimWorkerFuncMixin = (path, mixinType, accessors, func) => {
        this.physicsTouched = true;
        this.simWorkerFuncMixins.push({
            scope: scope,
            path: path,
            mixinType: mixinType,
            accessors: accessors,
            funcString: func.toString()
        })
    }
}

let ActivePolyModLoader = new PolyModLoader("0.5.0-beta5");

export { ActivePolyModLoader }
