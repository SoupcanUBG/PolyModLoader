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
    init = (pmlInstance) => {}
    postInit = () => {}
}

export const MixinType = Object.freeze({
    HEAD: 0,
    TAIL: 1,
    OVERRIDE: 2
})

export class PolyModLoader {
    constructor(polyVersion, modUrlList) {
        this.polyVersion = polyVersion
        this.polyModUrls = modUrlList;
        this.loadedMods = []
    }
    importMods = async() =>{
        for(let polyModObject of this.polyModUrls) {
            console.log(polyModObject)
            let polyModUrl = `${polyModObject.base}/${this.polyVersion}/${polyModObject.version}`;
            let modImport = await import(`${polyModUrl}/main.mod.js`);
            let newMod = modImport.polyMod;
            newMod.iconSrc = `${polyModUrl}/icon.png`
            this.loadedMods.push(newMod);
        }
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
        for(let polyMod of this.loadedMods) {
            if(polyMod.id == id) return polyMod;
        }
    }
    get LoadedMods() {
        return this.loadedMods;
    }
    getFromPolyTrack = (path) => {}
    registerClassMixin = (scope, path, mixinType, accessors, func) => {}
    registerFuncMixin = (path, mixinType, accessors, func) => {}
}