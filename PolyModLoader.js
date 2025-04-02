export class PolyMod {
    constructor(id, name, author, version, ptversion) {
        this.modId = id;
        this.modName = name;
        this.modAuthor = author;
        this.modVersion = version;
        this.polyVersion = ptversion;
        this.touchingPhysics = false;
    }
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
    init = (pmlInstance) => {}
    postInit = () => {}
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
    }
    initStorage = (localStorage) => {
        this.localStorage = localStorage;
        this.polyModUrls = this.getPolyModsStorage();
    }
    importMods = async() =>{
        for(let polyModObject of this.polyModUrls) {
            let polyModUrl = `${polyModObject.base}/${this.polyVersion}/${polyModObject.version}`;
            let modImport = await import(`${polyModUrl}/main.mod.js`);
            let newMod = modImport.polyMod;
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
                "version": "1.0.0",
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
                polyMod.postInit(this);
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
    registerSimWorkerClassMixin = (scope, path, mixinType, accessors, func) => {}
    registerSimWorkerFuncMixin = (path, mixinType, accessors, func) => {}
}

// let ActivePolyModLoader = () => {
//     let setPolyModLoader = (polyModLoader) => {
//         this.polyModLoader = polyModLoader;
//     }
//     let getPolyModLoader = () => {
//         return this.polyModLoader;
//     }
// };

let ActivePolyModLoader = new PolyModLoader("0.5.0-beta5");

export { ActivePolyModLoader }