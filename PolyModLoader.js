var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SoundManager_soundClass, _PolyModLoader_instances, _PolyModLoader_polyVersion, _PolyModLoader_allMods, _PolyModLoader_physicsTouched, _PolyModLoader_simWorkerClassMixins, _PolyModLoader_simWorkerFuncMixins, _PolyModLoader_settings, _PolyModLoader_settingConstructor, _PolyModLoader_defaultSettings, _PolyModLoader_latestSetting, _PolyModLoader_keybindings, _PolyModLoader_defaultBinds, _PolyModLoader_bindConstructor, _PolyModLoader_latestBinding, _PolyModLoader_polyModUrls, _PolyModLoader_applySettings, _PolyModLoader_applyKeybinds;
/**
 * Base class for all polytrack mods. Mods should export an instance of their mod class named `polyMod` in their main file.
 */
export class PolyMod {
    constructor() {
        this.loaded = false;
        this.applyManifest = (manifest) => {
            const mod = manifest.polymod;
            /** @type {string} */
            this.modName = mod.name;
            /** @type {string} */
            this.modID = mod.id;
            /** @type {string} */
            this.modAuthor = mod.author;
            /** @type {string} */
            this.modVersion = mod.version;
            /** @type {string} */
            this.polyVersion = mod.targets;
            this.assetFolder = "assets";
            // no idea how to type annotate this
            // /** @type {{string: string}[]} */
            this.modDependencies = manifest.dependencies;
        };
        /**
         * Function to run during initialization of mods. Note that this is called *before* polytrack itself is loaded,
         * but *after* everything has been declared.
         *
         * @param {PolyModLoader} pmlInstance - The instance of {@link PolyModLoader}.
         */
        this.init = (pmlInstance) => { };
        /**
         * Function to run after all mods and polytrack have been initialized and loaded.
         */
        this.postInit = () => { };
        /**
         * Function to run before initialization of `simulation_worker.bundle.js`.
         */
        this.simInit = () => { };
    }
    /**
     * The author of the mod.
     *
     * @type {string}
     */
    get author() {
        return this.modAuthor;
    }
    /**
     * The mod ID.
     *
     * @type {string}
     */
    get id() {
        return this.modID;
    }
    /**
     * The mod name.
     *
     * @type {string}
     */
    get name() {
        return this.modName;
    }
    /**
     * The mod version.
     *
     * @type {string}
     */
    get version() {
        return this.modVersion;
    }
    /**
     * The the mod's icon file URL.
     *
     * @type {string}
     */
    get iconSrc() {
        return this.IconSrc;
    }
    set iconSrc(src) {
        this.IconSrc = src;
    }
    set setLoaded(status) {
        this.loaded = status;
    }
    /**
     * The mod's loaded state.
     *
     * @type {boolean}
     */
    get isLoaded() {
        return this.loaded;
    }
    /**
     * The mod's base URL.
     *
     * @type {string}
     */
    get baseUrl() {
        return this.modBaseUrl;
    }
    set baseUrl(url) {
        this.modBaseUrl = url;
    }
    /**
     * Whether the mod has changed the game physics in some way.
     *
     * @type {boolean}
     */
    get touchesPhysics() {
        return this.touchingPhysics;
    }
    /**
     * Other mods that this mod depends on.
     */
    get dependencies() {
        return this.modDependencies;
    }
    get descriptionUrl() {
        return this.modDescription;
    }
    /**
     * Whether the mod is saved as to always fetch latest version (`true`)
     * or to fetch a specific version (`false`, with version defined by {@link PolyMod.version}).
     *
     * @type {boolean}
     */
    get savedLatest() {
        return this.latestSaved;
    }
    set savedLatest(latest) {
        this.latestSaved = latest;
    }
    get initialized() {
        return this.modInitialized;
    }
    set initialized(initState) {
        this.modInitialized = initState;
    }
}
/**
 * This class is used in {@link PolyModLoader}'s register mixin functions to set where functions should be injected into the target function.
 */
export var MixinType;
(function (MixinType) {
    /**
     * Inject at the start of the target function.
     */
    MixinType[MixinType["HEAD"] = 0] = "HEAD";
    /**
     * Inject at the end of the target function.
     */
    MixinType[MixinType["TAIL"] = 1] = "TAIL";
    /**
     * Override the target function with the new function.
     */
    MixinType[MixinType["OVERRIDE"] = 2] = "OVERRIDE";
    /**
     * Insert code after a given token.
     */
    MixinType[MixinType["INSERT"] = 3] = "INSERT";
    /**
     * Replace code between 2 given tokens. Inclusive.
     */
    MixinType[MixinType["REPLACEBETWEEN"] = 5] = "REPLACEBETWEEN";
    /**
     * Remove code between 2 given tokens. Inclusive.
     */
    MixinType[MixinType["REMOVEBETWEEN"] = 6] = "REMOVEBETWEEN";
    /**
     * Inserts code after a given token, but class wide.
     */
    MixinType[MixinType["CLASSINSERT"] = 8] = "CLASSINSERT";
    /**
     * Replace code between 2 given tokens, but class wide. Inclusive.
     */
    MixinType[MixinType["CLASSREMOVE"] = 4] = "CLASSREMOVE";
    /**
     * Remove code between 2 given tokens, but class wide. Inclusive.
     */
    MixinType[MixinType["CLASSREPLACE"] = 7] = "CLASSREPLACE";
})(MixinType || (MixinType = {}));
export var SettingType;
(function (SettingType) {
    SettingType["BOOL"] = "boolean";
    SettingType["SLIDER"] = "slider";
    SettingType["CUSTOM"] = "custom";
})(SettingType || (SettingType = {}));
export class SoundManager {
    constructor(soundClass) {
        _SoundManager_soundClass.set(this, void 0);
        __classPrivateFieldSet(this, _SoundManager_soundClass, soundClass, "f");
    }
    registerSound(id, url) {
        __classPrivateFieldGet(this, _SoundManager_soundClass, "f").load(id, url);
    }
    playSound(id, gain) {
        const e = __classPrivateFieldGet(this, _SoundManager_soundClass, "f").getBuffer(id);
        if (null != e && null != __classPrivateFieldGet(this, _SoundManager_soundClass, "f").context && null != __classPrivateFieldGet(this, _SoundManager_soundClass, "f").destinationSfx) {
            const t = __classPrivateFieldGet(this, _SoundManager_soundClass, "f").context.createBufferSource();
            t.buffer = e;
            const n = __classPrivateFieldGet(this, _SoundManager_soundClass, "f").context.createGain();
            n.gain.value = gain,
                t.connect(n),
                n.connect(__classPrivateFieldGet(this, _SoundManager_soundClass, "f").destinationSfx),
                t.start(0);
        }
    }
    playUIClick() {
        const e = __classPrivateFieldGet(this, _SoundManager_soundClass, "f").getBuffer("click");
        if (null != e && null != __classPrivateFieldGet(this, _SoundManager_soundClass, "f").context && null != __classPrivateFieldGet(this, _SoundManager_soundClass, "f").destinationSfx) {
            const t = __classPrivateFieldGet(this, _SoundManager_soundClass, "f").context.createBufferSource();
            t.buffer = e;
            const n = __classPrivateFieldGet(this, _SoundManager_soundClass, "f").context.createGain();
            n.gain.value = .0075,
                t.connect(n),
                n.connect(__classPrivateFieldGet(this, _SoundManager_soundClass, "f").destinationSfx),
                t.start(0);
        }
    }
}
_SoundManager_soundClass = new WeakMap();
export class PolyModLoader {
    constructor(polyVersion) {
        _PolyModLoader_instances.add(this);
        _PolyModLoader_polyVersion.set(this, void 0);
        _PolyModLoader_allMods.set(this, void 0);
        _PolyModLoader_physicsTouched.set(this, void 0);
        _PolyModLoader_simWorkerClassMixins.set(this, void 0);
        _PolyModLoader_simWorkerFuncMixins.set(this, void 0);
        _PolyModLoader_settings.set(this, void 0);
        _PolyModLoader_settingConstructor.set(this, void 0);
        _PolyModLoader_defaultSettings.set(this, void 0);
        _PolyModLoader_latestSetting.set(this, void 0);
        _PolyModLoader_keybindings.set(this, void 0);
        _PolyModLoader_defaultBinds.set(this, void 0);
        _PolyModLoader_bindConstructor.set(this, void 0);
        _PolyModLoader_latestBinding.set(this, void 0);
        _PolyModLoader_polyModUrls.set(this, void 0);
        this.getFromPolyTrack = (path) => { };
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
        this.registerClassMixin = (scope, path, mixinType, accessors, func, extraOptinonal) => { };
        /**
         * Inject mixin with target function name defined by {@link path}.
         * This only injects functions in `main.bundle.js`.
         *
         * @param {string} path         - The path of the function which the mixin targets.
         * @param {MixinType} mixinType - The type of injection.
         * @param {string[]} accessors  - A list of strings to evaluate to access private variables.
         * @param {function} func       - The new function to be injected.
         */
        this.registerFuncMixin = (path, mixinType, accessors, func, extraOptinonal) => { };
        this.registerClassWideMixin = (path, mixinType, firstToken, funcOrSecondToken, funcOptional) => { };
        /** @type {string} */
        __classPrivateFieldSet(this, _PolyModLoader_polyVersion, polyVersion, "f");
        /** @type {PolyMod[]} */
        __classPrivateFieldSet(this, _PolyModLoader_allMods, [], "f");
        /** @type {boolean} */
        __classPrivateFieldSet(this, _PolyModLoader_physicsTouched, false, "f");
        /**
         * @type {{
         *      scope: string,
         *      path: string,
         *      mixinType: MixinType,
         *      accessors: string[],
         *      funcString: string,
         *  }}
         */
        __classPrivateFieldSet(this, _PolyModLoader_simWorkerClassMixins, [], "f");
        /**
         * @type {{
        *      path: string,
        *      mixinType: MixinType,
        *      accessors: string[],
        *      funcString: string,
        *  }}
        */
        __classPrivateFieldSet(this, _PolyModLoader_simWorkerFuncMixins, [], "f");
        __classPrivateFieldSet(this, _PolyModLoader_settings, [], "f");
        __classPrivateFieldSet(this, _PolyModLoader_settingConstructor, [], "f");
        __classPrivateFieldSet(this, _PolyModLoader_defaultSettings, [], "f");
        __classPrivateFieldSet(this, _PolyModLoader_latestSetting, 18, "f");
        __classPrivateFieldSet(this, _PolyModLoader_keybindings, [], "f");
        __classPrivateFieldSet(this, _PolyModLoader_defaultBinds, [], "f");
        __classPrivateFieldSet(this, _PolyModLoader_bindConstructor, [], "f");
        __classPrivateFieldSet(this, _PolyModLoader_latestBinding, 31, "f");
    }
    initStorage(localStorage) {
        /** @type {Storage} */
        this.localStorage = localStorage;
        __classPrivateFieldSet(this, _PolyModLoader_polyModUrls, this.getPolyModsStorage(), "f");
    }
    importMods() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let polyModObject of __classPrivateFieldGet(this, _PolyModLoader_polyModUrls, "f")) {
                let latest = false;
                if (polyModObject.version === "latest") {
                    try {
                        const latestFile = yield fetch(`${polyModObject.base}/latest.json`).then(r => r.json());
                        polyModObject.version = latestFile[__classPrivateFieldGet(this, _PolyModLoader_polyVersion, "f")];
                        latest = true;
                    }
                    catch (err) {
                        alert(`Couldn't find latest version for ${polyModObject.base}`);
                        console.error("Error in fetching latest version json:", err);
                    }
                }
                const polyModUrl = `${polyModObject.base}/${polyModObject.version}`;
                try {
                    const manifestFile = yield fetch(`${polyModUrl}/manifest.json`).then(r => r.json());
                    let mod = manifestFile.polymod;
                    try {
                        const modImport = yield import(`${polyModUrl}/${mod.main}`);
                        let newMod = modImport.polyMod;
                        mod.version = polyModObject.version;
                        if (this.getMod(mod.id))
                            alert(`Duplicate mod detected: ${mod.name}`);
                        newMod.applyManifest(manifestFile);
                        newMod.baseUrl = polyModObject.base;
                        newMod.applyManifest = (nothing) => { console.warn("Can't apply manifest after initialization!"); };
                        newMod.savedLatest = latest;
                        newMod.iconSrc = `${polyModUrl}/icon.png`;
                        if (polyModObject.loaded) {
                            newMod.setLoaded = true;
                            if (newMod.touchesPhysics) {
                                __classPrivateFieldSet(this, _PolyModLoader_physicsTouched, true, "f");
                                this.registerClassMixin("HB.prototype", "submitLeaderboard", MixinType.OVERRIDE, [], (e, t, n, i, r, a) => { });
                            }
                        }
                        __classPrivateFieldGet(this, _PolyModLoader_allMods, "f").push(newMod);
                    }
                    catch (err) {
                        alert(`Mod ${mod.name} failed to load.`);
                        console.error("Error in loading mod:", err);
                    }
                }
                catch (err) {
                    alert(`Couldn't load mod with URL ${polyModUrl}.`);
                    console.error("Error in loading mod URL:", err);
                }
            }
        });
    }
    getPolyModsStorage() {
        const polyModsStorage = this.localStorage.getItem("polyMods");
        if (polyModsStorage) {
            __classPrivateFieldSet(this, _PolyModLoader_polyModUrls, JSON.parse(polyModsStorage), "f");
        }
        else {
            __classPrivateFieldSet(this, _PolyModLoader_polyModUrls, [
                {
                    "base": "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/pmlcore",
                    "version": "latest",
                    "loaded": true
                }
            ], "f");
            this.localStorage.setItem("polyMods", JSON.stringify(__classPrivateFieldGet(this, _PolyModLoader_polyModUrls, "f")));
        }
        return __classPrivateFieldGet(this, _PolyModLoader_polyModUrls, "f");
    }
    serializeMod(mod) {
        return { "base": mod.baseUrl, "version": mod.savedLatest ? "latest" : mod.version, "loaded": mod.isLoaded || false };
    }
    saveModsToLocalStorage() {
        let savedMods = [];
        for (let mod of __classPrivateFieldGet(this, _PolyModLoader_allMods, "f")) {
            const modSerialized = this.serializeMod(mod);
            savedMods.push(modSerialized);
        }
        __classPrivateFieldSet(this, _PolyModLoader_polyModUrls, savedMods, "f");
        this.localStorage.setItem("polyMods", JSON.stringify(__classPrivateFieldGet(this, _PolyModLoader_polyModUrls, "f")));
    }
    /**
     * Reorder a mod in the internal list to change its priority in mod loading.
     *
     * @param {PolyMod} mod  - The mod to reorder.
     * @param {number} delta - The amount to reorder it by. Positive numbers decrease priority, negative numbers increase priority.
     */
    reorderMod(mod, delta) {
        if (!mod)
            return;
        if (mod.id === "pmlcore") {
            return;
        }
        const currentIndex = __classPrivateFieldGet(this, _PolyModLoader_allMods, "f").indexOf(mod);
        if ((currentIndex === 1) || delta > 0)
            return;
        if (currentIndex === null || currentIndex === undefined) {
            alert("This mod isn't loaded");
            return;
        }
        const temp = __classPrivateFieldGet(this, _PolyModLoader_allMods, "f")[currentIndex + delta];
        __classPrivateFieldGet(this, _PolyModLoader_allMods, "f")[currentIndex + delta] = __classPrivateFieldGet(this, _PolyModLoader_allMods, "f")[currentIndex];
        __classPrivateFieldGet(this, _PolyModLoader_allMods, "f")[currentIndex] = temp;
        this.saveModsToLocalStorage();
    }
    /**
     * Add a mod to the internal mod list. Added mod is given least priority.
     *
     * @param {{base: string, version: string, loaded: bool}} polyModObject - The mod's JSON representation to add.
     */
    addMod(polyModObject, autoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            let latest = false;
            if (polyModObject.version === "latest") {
                try {
                    const latestFile = yield fetch(`${polyModObject.base}/latest.json`).then(r => r.json());
                    polyModObject.version = latestFile[__classPrivateFieldGet(this, _PolyModLoader_polyVersion, "f")];
                    if (autoUpdate) {
                        latest = true;
                    }
                }
                catch (_a) {
                    alert(`Couldn't find latest version for ${polyModObject.base}`);
                }
            }
            const polyModUrl = `${polyModObject.base}/${polyModObject.version}`;
            try {
                const manifestFile = yield fetch(`${polyModUrl}/manifest.json`).then(r => r.json());
                const mod = manifestFile.polymod;
                if (this.getMod(mod.id)) {
                    alert("This mod is already present!");
                    return;
                }
                if (mod.targets.indexOf(__classPrivateFieldGet(this, _PolyModLoader_polyVersion, "f")) === -1) {
                    alert(`Mod target version does not match polytrack version!
                    Note: ${mod.name} version ${polyModObject.version} targets polytrack versions ${mod.targets.join(', ')}, but current polytrack version is ${__classPrivateFieldGet(this, _PolyModLoader_polyVersion, "f")}.`);
                    return;
                }
                try {
                    const modImport = yield import(`${polyModUrl}/${mod.main}`);
                    let newMod = modImport.polyMod;
                    newMod.iconSrc = `${polyModUrl}/icon.png`;
                    mod.version = polyModObject.version;
                    newMod.applyManifest(manifestFile);
                    newMod.baseUrl = polyModObject.base;
                    newMod.applyManifest = (nothing) => { console.warn("Can't apply manifest after initialization!"); };
                    newMod.savedLatest = latest;
                    polyModObject.loaded = false;
                    __classPrivateFieldGet(this, _PolyModLoader_allMods, "f").push(newMod);
                    this.saveModsToLocalStorage();
                }
                catch (err) {
                    alert("Something went wrong importing this mod!");
                    console.error("Error in importing mod:", err);
                    return;
                }
            }
            catch (err) {
                alert(`Couldn't find mod manifest for "${polyModObject.base}".`);
                console.error("Error in getting mod manifest:", err);
            }
        });
    }
    registerSettingCategory(name) {
        __classPrivateFieldGet(this, _PolyModLoader_settings, "f").push(`xI(this, eI, "m", gI).call(this, xI(this, nI, "f").get("${name}")),`);
    }
    registerBindCategory(name) {
        __classPrivateFieldGet(this, _PolyModLoader_keybindings, "f").push(`,xI(this, eI, "m", vI).call(this, xI(this, nI, "f").get("${name}"))`);
    }
    registerSetting(name, id, type, defaultOption, optionsOptional) {
        var _a;
        __classPrivateFieldSet(this, _PolyModLoader_latestSetting, (_a = __classPrivateFieldGet(this, _PolyModLoader_latestSetting, "f"), _a++, _a), "f");
        __classPrivateFieldGet(this, _PolyModLoader_settingConstructor, "f").push(`$o[$o.${id} = ${__classPrivateFieldGet(this, _PolyModLoader_latestSetting, "f")}] = "${id}";`);
        if (type === "boolean") {
            __classPrivateFieldGet(this, _PolyModLoader_defaultSettings, "f").push(`, [$o.${id}, "${defaultOption ? "true" : "false"}"]`);
            __classPrivateFieldGet(this, _PolyModLoader_settings, "f").push(`
                xI(this, eI, "m", wI).call(this, xI(this, nI, "f").get("${name}"), [{
                    title: xI(this, nI, "f").get("Off"),
                    value: "false"
                }, {
                    title: xI(this, nI, "f").get("On"),
                    value: "true"
                }], $o.${id}),
                `);
        }
        else if (type === "slider") {
            __classPrivateFieldGet(this, _PolyModLoader_defaultSettings, "f").push(`, [$o.${id}, "${defaultOption}"]`);
            __classPrivateFieldGet(this, _PolyModLoader_settings, "f").push(`
                 xI(this, eI, "m", yI).call(this, xI(this, nI, "f").get("${name}"), $o.${id}),`);
        }
        else if (type === "custom") {
            __classPrivateFieldGet(this, _PolyModLoader_defaultSettings, "f").push(`, [$o.${id}, "${defaultOption}"]`);
            __classPrivateFieldGet(this, _PolyModLoader_settings, "f").push(`
                xI(this, eI, "m", wI).call(this, xI(this, nI, "f").get("${name}"), ${JSON.stringify(optionsOptional)}, $o.${id}),
                `);
        }
    }
    registerKeybind(name, id, event, defaultBind, secondBindOptional, callback) {
        var _a;
        __classPrivateFieldGet(this, _PolyModLoader_keybindings, "f").push(`,xI(this, eI, "m", AI).call(this, xI(this, nI, "f").get("${name}"), Ix.${id})`);
        __classPrivateFieldGet(this, _PolyModLoader_bindConstructor, "f").push(`Ix[Ix.${id} = ${__classPrivateFieldGet(this, _PolyModLoader_latestBinding, "f")}] = "${id}";`);
        __classPrivateFieldGet(this, _PolyModLoader_defaultBinds, "f").push(`, [Ix.${id}, ["${defaultBind}", ${secondBindOptional ? `"${secondBindOptional}"` : "null"}]]`);
        __classPrivateFieldSet(this, _PolyModLoader_latestBinding, (_a = __classPrivateFieldGet(this, _PolyModLoader_latestBinding, "f"), _a++, _a), "f");
        window.addEventListener(event, (e) => {
            if (this.settingClass.checkKeyBinding(e, this.getFromPolyTrack(`Ix.${id}`))) {
                callback(e);
            }
        });
    }
    getSetting(id) {
        return this.getFromPolyTrack(`ActivePolyModLoader.settingClass.getSetting($o.${id})`);
    }
    registerSoundOverride(id, url) {
        this.registerClassMixin("ul.prototype", "load", MixinType.INSERT, `dl(this, tl, "f").addResource(),`, `
            console.log(e);
            console.log("${id}")
            if(e === "${id}") {
                console.log(t);
                t = ["${url}"];
                console.log(t);
            }`);
    }
    /**
     * Remove a mod from the internal list.
     *
     * @param {PolyMod} mod - The mod to remove.
     */
    removeMod(mod) {
        if (!mod)
            return;
        if (mod.id === "pmlcore") {
            return;
        }
        const index = __classPrivateFieldGet(this, _PolyModLoader_allMods, "f").indexOf(mod);
        if (index > -1) {
            __classPrivateFieldGet(this, _PolyModLoader_allMods, "f").splice(index, 1);
        }
        this.saveModsToLocalStorage();
    }
    /**
     * Set the loaded state of a mod.
     *
     * @param {PolyMod} mod   - The mod to set the state of.
     * @param {boolean} state - The state to set. `true` is loaded, `false` is unloaded.
     */
    setModLoaded(mod, state) {
        if (!mod)
            return;
        if (mod.id === "pmlcore") {
            return;
        }
        mod.loaded = state;
        this.saveModsToLocalStorage();
    }
    initMods() {
        let initList = [];
        for (let polyMod of __classPrivateFieldGet(this, _PolyModLoader_allMods, "f")) {
            if (polyMod.isLoaded)
                initList.push(polyMod.id);
        }
        if (initList.length === 0)
            return; // no mods to initialize lol
        let allModsInit = false;
        while (!allModsInit) {
            let currentMod = this.getMod(initList[0]);
            if (!currentMod)
                continue;
            console.log(initList[0]);
            let initCheck = true;
            for (let dependency of currentMod.dependencies) {
                let curDependency = this.getMod(dependency.id);
                if (!curDependency) {
                    initCheck = false;
                    initList.splice(0, 1);
                    alert(`Mod ${currentMod.name} is missing mod ${dependency.id} ${dependency.version} and will not be initialized.`);
                    console.warn(`Mod ${currentMod.name} is missing mod ${dependency.id} ${dependency.version} and will not be initialized.`);
                    break;
                }
                if (curDependency.version !== dependency.version) {
                    initCheck = false;
                    initList.splice(0, 1);
                    alert(`Mod ${currentMod.name} needs version ${dependency.version} of ${curDependency.name} but ${curDependency.version} is present.`);
                    console.warn(`Mod ${currentMod.name} needs version ${dependency.version} of ${curDependency.name} but ${curDependency.version} is present.`);
                    break;
                }
                if (!curDependency.initialized) {
                    initCheck = false;
                    initList.splice(0, 1);
                    initList.push(currentMod.id);
                    break;
                }
            }
            if (initCheck) {
                try {
                    currentMod.init(this);
                    currentMod.initialized = true;
                    initList.splice(0, 1);
                }
                catch (err) {
                    alert(`Mod ${currentMod.name} failed to initialize and will be unloaded.`);
                    console.error("Error in initializing mod:", err);
                    this.setModLoaded(currentMod, false);
                    initList.splice(0, 1);
                }
            }
            if (initList.length === 0)
                allModsInit = true;
        }
        __classPrivateFieldGet(this, _PolyModLoader_instances, "m", _PolyModLoader_applySettings).call(this);
        __classPrivateFieldGet(this, _PolyModLoader_instances, "m", _PolyModLoader_applyKeybinds).call(this);
    }
    postInitMods() {
        for (let polyMod of __classPrivateFieldGet(this, _PolyModLoader_allMods, "f")) {
            if (polyMod.isLoaded) {
                try {
                    polyMod.postInit();
                }
                catch (err) {
                    alert(`Mod ${polyMod.name} failed to post initialize and will be unloaded.`);
                    console.error("Error in post initializing mod:", err);
                    this.setModLoaded(polyMod, false);
                }
            }
        }
    }
    simInitMods() {
        for (let polyMod of __classPrivateFieldGet(this, _PolyModLoader_allMods, "f")) {
            if (polyMod.isLoaded)
                polyMod.simInit();
        }
    }
    /**
     * Access a mod by its mod ID.
     *
     * @param   {string} id - The ID of the mod to get
     * @returns {PolyMod}   - The requested mod's object.
     */
    getMod(id) {
        for (let polyMod of __classPrivateFieldGet(this, _PolyModLoader_allMods, "f")) {
            if (polyMod.id == id)
                return polyMod;
        }
    }
    /**
     * Get the list of all mods.
     *
     * @type {PolyMod[]}
     */
    getAllMods() {
        return __classPrivateFieldGet(this, _PolyModLoader_allMods, "f");
    }
    /**
     * Whether uploading runs to leaderboard is invalid or not.
     */
    get lbInvalid() {
        return __classPrivateFieldGet(this, _PolyModLoader_physicsTouched, "f");
    }
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
    registerSimWorkerClassMixin(scope, path, mixinType, accessors, func, extraOptinonal) {
        this.registerClassMixin("HB.prototype", "submitLeaderboard", MixinType.OVERRIDE, [], (e, t, n, i, r, a) => { });
        __classPrivateFieldGet(this, _PolyModLoader_simWorkerClassMixins, "f").push({
            scope: scope,
            path: path,
            mixinType: mixinType,
            accessors: accessors,
            funcString: typeof func === "function" ? func.toString() : func,
            func2Sstring: extraOptinonal ? extraOptinonal.toString() : null
        });
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
    registerSimWorkerFuncMixin(path, mixinType, accessors, func, extraOptinonal) {
        this.registerClassMixin("HB.prototype", "submitLeaderboard", MixinType.OVERRIDE, [], (e, t, n, i, r, a) => { });
        __classPrivateFieldGet(this, _PolyModLoader_simWorkerFuncMixins, "f").push({
            path: path,
            mixinType: mixinType,
            accessors: accessors,
            funcString: typeof func === "function" ? func.toString() : func,
            func2Sstring: extraOptinonal ? extraOptinonal.toString() : null
        });
    }
}
_PolyModLoader_polyVersion = new WeakMap(), _PolyModLoader_allMods = new WeakMap(), _PolyModLoader_physicsTouched = new WeakMap(), _PolyModLoader_simWorkerClassMixins = new WeakMap(), _PolyModLoader_simWorkerFuncMixins = new WeakMap(), _PolyModLoader_settings = new WeakMap(), _PolyModLoader_settingConstructor = new WeakMap(), _PolyModLoader_defaultSettings = new WeakMap(), _PolyModLoader_latestSetting = new WeakMap(), _PolyModLoader_keybindings = new WeakMap(), _PolyModLoader_defaultBinds = new WeakMap(), _PolyModLoader_bindConstructor = new WeakMap(), _PolyModLoader_latestBinding = new WeakMap(), _PolyModLoader_polyModUrls = new WeakMap(), _PolyModLoader_instances = new WeakSet(), _PolyModLoader_applySettings = function _PolyModLoader_applySettings() {
    this.registerClassMixin("ul.prototype", "load", MixinType.INSERT, `load(e, t) {`, `ActivePolyModLoader.soundManager = new SoundManager(this);`);
    this.registerClassMixin("ZB.prototype", "defaultSettings", MixinType.INSERT, `defaultSettings() {`, `ActivePolyModLoader.settingClass = this;${__classPrivateFieldGet(this, _PolyModLoader_settingConstructor, "f").join("")}`);
    this.registerClassMixin("ZB.prototype", "defaultSettings", MixinType.INSERT, `[$o.CheckpointVolume, "1"]`, __classPrivateFieldGet(this, _PolyModLoader_defaultSettings, "f").join(""));
    this.registerFuncMixin("mI", MixinType.INSERT, "), $o.CheckpointVolume),", __classPrivateFieldGet(this, _PolyModLoader_settings, "f").join(""));
}, _PolyModLoader_applyKeybinds = function _PolyModLoader_applyKeybinds() {
    this.registerClassMixin("ZB.prototype", "defaultKeyBindings", MixinType.INSERT, `defaultKeyBindings() {`, `${__classPrivateFieldGet(this, _PolyModLoader_bindConstructor, "f").join("")};`);
    this.registerClassMixin("ZB.prototype", "defaultKeyBindings", MixinType.INSERT, `[Ix.SpectatorSpeedModifier, ["ShiftLeft", "ShiftRight"]]`, __classPrivateFieldGet(this, _PolyModLoader_defaultBinds, "f").join(""));
    this.registerFuncMixin("mI", MixinType.INSERT, "), Ix.ToggleSpectatorCamera)", __classPrivateFieldGet(this, _PolyModLoader_keybindings, "f").join(""));
};
const ActivePolyModLoader = new PolyModLoader("0.5.0");
export { ActivePolyModLoader };
