export class PolyMod {
    constructor(id, name, author) {
        this.modId = id;
        this.modName = name;
        this.modAuthor = author;
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
    init = (pmlInstance) => {}
    postInit = () => {}
}

export const MixinType = Object.freeze({
    HEAD: 0,
    TAIL: 1,
    OVERRIDE: 2
})

export class PolyModLoader {
    constructor(modUrlList) {
        this.polyModUrls = modUrlList;
        this.loadedMods = []
    }
    importMods = async() =>{
        for(let polyModUrl of this.polyModUrls) {
            let modImport = await import(polyModUrl);
            let newMod = modImport.polyMod;
            console.log(newMod)
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
    getFromPolyTrack = (path) => {}
    registerClassMixin = (scope, path, mixinType, accessors, func) => {}
    registerFuncMixin = (path, mixinType, accessors, func) => {}
}