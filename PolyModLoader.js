export class PolyMod {
    constructor(id, name, author, version, ptversion) {
        this.modId = id;
        this.modName = name;
        this.modAuthor = author;
        this.modVersion = version;
        this.polyVersion = ptversion;
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
        this.polyModUrls = window.polyMods;
        this.loadedMods = []
        this.allMods = []
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
                this.loadedMods.push(newMod);
            }
            this.allMods.push(newMod)
        }
    }
    getPolyModsStorage = () => {
        if(localStorage.getItem("polyMods")) {
            window.polyMods = JSON.parse(localStorage.getItem("polyMods"));
        } else {
            window.polyMods = [
            {
            "base": "http://localhost:63342/PolyTrackCarPickerModded/pmlcore",
            "version": "1.0.0",
            "loaded": true
            }
        ]
        localStorage.setItem("polyMods", JSON.stringify(window.polyMods));
        }
        return window.polyMods;
    }
    serializeMod = (mod) => {
        return { "base": mod.baseUrl, "version": mod.version, "loaded": mod.isLoaded}
    }
    saveModsToLocalStorage = () => {
        let savedMods = []
        for(let mod of this.allMods) {
            savedMods.push(this.serializeMod(mod));
        }
        window.polyMods = savedMods;
    }
    
    initMods = () => {
        for(let polyMod of this.loadedMods) {
            polyMod.init(this);
        }
    }
    postInitMods = () => {
        for(let polyMod of this.loadedMods) {
            polyMod.postInit(this);
        }
    }
    getMod(id) {
        for(let polyMod of this.allMods) {
            if(polyMod.id == id) return polyMod;
        }
    }
    getLoadedMod(id) {
        for(let polyMod of this.loadedMods) {
            if(polyMod.id == id) return polyMod;
        }
    }
    get getLoadedMods() {
        return this.loadedMods;
    }
    get getAllMods() {
        return this.allMods;
    }
    getFromPolyTrack = (path) => {}
    registerClassMixin = (scope, path, mixinType, accessors, func) => {}
    registerFuncMixin = (path, mixinType, accessors, func) => {}
}