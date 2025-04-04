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
    applyManifest = (manifest) => {
        this.modName = manifest.name;
        this.polyVersion = manifest.target;
        this.modVersion = manifest.version;
        this.modId = manifest.id;
        this.modAuthor = manifest.author;
        this.modDependencies = manifest.dependencies;
        this.assetFolder = manifest.assets
    }
    init = (pmlInstance) => {}
    postInit = () => {}
    simInit = () => {}
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
    importMods = async() =>{
        for(let polyModObject of this.polyModUrls) {
            if(polyModObject.version === "latest") {
                const latestFile = await import(`${polyModObject.base}/latest.json`, {
                    with: { type: "json" },
                });
                polyModObject.version = latestFile.default[this.polyVersion];
            }
            let polyModUrl = `${polyModObject.base}/${polyModObject.version}`;
            const manifestFile = await import(`${polyModUrl}/manifest.json`, {
                with: { type: "json" },
            });
            let modImport = await import(`${polyModUrl}/${manifestFile["default"]["main"]}`);
            let newMod = modImport.polyMod;
            manifestFile["default"]["version"] = polyModObject.version;
            newMod.applyManifest(manifestFile["default"])
            newMod.applyManifest = (nothing) => {console.warn("Can't apply manifest after initialization!")}
            newMod.iconSrc = `${polyModUrl}/icon.png`
            newMod.baseUrl = polyModObject.base;
            if(polyModObject.loaded) {
                newMod.setLoaded = true;
                if(newMod.touchesPhysics) {
                    this.physicsTouched = true;
                }
            }
            this.allMods.push(newMod)
        }
    }
    getPolyModsStorage = () => {
        if(this.localStorage.getItem("polyMods")) {
            this.polyModUrls = JSON.parse(this.localStorage.getItem("polyMods"));
        } else {
            this.polyModUrls = [
            {
                "base": "http://localhost:63342/PolyTrackCarPickerModded/pmlcore",
                "version": "latest",
                "loaded": true
            }
        ]
        this.localStorage.setItem("polyMods", JSON.stringify(this.polyModUrls));
        }
        return this.polyModUrls;
    }
    serializeMod = (mod) => {
        return { "base": mod.baseUrl, "version": mod.version, "loaded": mod.isLoaded}
    }
    saveModsToLocalStorage = () => {
        let savedMods = []
        for(let mod of this.allMods) {
            savedMods.push(this.serializeMod(mod));
        }
        this.polyModUrls = savedMods;
        this.localStorage.setItem("polyMods", JSON.stringify(this.polyModUrls));
    }
    reorderMod = (mod, delta) => {
        if(!mod) return;
        let currentIndex = this.allMods.indexOf(mod);
        if((currentIndex === 1) || delta > 0) return;
        if(currentIndex === null || currentIndex === undefined) {
            alert("This mod isn't loaded");
            return;
        }
        let temp = this.allMods[currentIndex + delta];
        this.allMods[currentIndex + delta] = this.allMods[currentIndex];
        this.allMods[currentIndex] = temp;
        this.saveModsToLocalStorage();
    }
    addMod = async(polyModObject) => {
        let polyModUrl = `${polyModObject.base}/${this.polyVersion}/${polyModObject.version}`;
        console.log(polyModUrl);
        let modImport;
        try {
            modImport = await import(`${polyModUrl}/main.mod.js`);
        } catch {
            alert("Something went wrong importing this mod!")
            return;
        }
        let newMod = modImport.polyMod;
        if(this.getMod(newMod.id)) {
            alert("This mod is already present!");
            return;
        }
        newMod.iconSrc = `${polyModUrl}/icon.png`
        newMod.baseUrl = polyModObject.base;
        polyModObject.loaded = false;
        this.allMods.push(newMod);
        this.saveModsToLocalStorage();
    }
    setModLoaded = (mod, state) => {
        if(!mod) return;
        mod.loaded = state;
        this.saveModsToLocalStorage();
    }
    initMods = () => {
        for(let polyMod of this.allMods) {
            if(polyMod.isLoaded)
                polyMod.init(this);
        }
    }
    postInitMods = () => {
        for(let polyMod of this.allMods) {
            if(polyMod.isLoaded)
                polyMod.postInit();
        }
    }
    simInitMods = () => {
        for(let polyMod of this.allMods) {
            if(polyMod.isLoaded)
                polyMod.simInit();
        }
    }
    getMod(id) {
        if(id === "pmlcore") {
            return;
        }
        for(let polyMod of this.allMods) {
            if(polyMod.id == id) return polyMod;
        }
    }
    get getAllMods() {
        return this.allMods;
    }
    get lbInvalid() {
        return this.physicsTouched;
    }
    getFromPolyTrack = (path) => {}
    registerClassMixin = (scope, path, mixinType, accessors, func) => {}
    registerFuncMixin = (path, mixinType, accessors, func) => {}
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