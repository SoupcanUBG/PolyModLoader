import { PolyMod, MixinType } from "../../../PolyModLoader.js";

let createModScreen = (pml, n) => {
    let menuDiv = document.getElementById("ui").children[0];
    let hideList = [0,1,3,4,5,6]
    for(let intToHide of hideList) {
        menuDiv.children[intToHide].classList.add("hidden")
    }
    let modsDiv = document.createElement('div');
    modsDiv.className = "track-info";

    let availableModsList = document.createElement("div");
    availableModsList.className = "leaderboard";

    let availableModsLabel = document.createElement("h2")
    availableModsLabel.textContent = "Available"
    availableModsList.appendChild(availableModsLabel)

    let activatedModsList = document.createElement("div");
    activatedModsList.className = "leaderboard";

    let modActivatedLabel = document.createElement("h2")
    modActivatedLabel.textContent = "Loaded"
    activatedModsList.appendChild(modActivatedLabel)

    let activatedModsContainer = document.createElement("div")
    activatedModsContainer.className = "container";
    activatedModsList.appendChild(activatedModsContainer);

    let buttonWrapper = document.createElement("div")
    buttonWrapper.className = "button-wapper"
    activatedModsList.appendChild(buttonWrapper)

    let unloadButton = document.createElement('button');
    unloadButton.className = "button first";
    unloadButton.style = "margin: 10px 0; float: left;padding: 10px"
    unloadButton.innerHTML = `<img class="button-icon" src="images/arrow_left.svg"> Unload`;
    buttonWrapper.appendChild(unloadButton);

    let goUpButton = document.createElement('button');
    goUpButton.className = "button first";
    goUpButton.style = "margin: 10px; float: left;padding: 10px"
    goUpButton.innerHTML = `<img class="button-icon" src="images/arrow_up.svg" style="margin: 0px 10px">`;
    buttonWrapper.appendChild(goUpButton);

    let goDownButton = document.createElement('button');
    goDownButton.className = "button first";
    goDownButton.style = "margin: 10px 0; float: left;padding: 10px"
    goDownButton.innerHTML = `<img class="button-icon" src="images/arrow_down.svg" style="margin: 0px 10px">`;
    buttonWrapper.appendChild(goDownButton);

    let applyButton = document.createElement('button');
    applyButton.className = "button first";
    applyButton.style = "margin: 10px 0; float: right;padding: 10px"
    applyButton.innerHTML = `Apply <img class="button-icon" src="images/checkmark.svg" style="margin: 0 5">`;
    buttonWrapper.appendChild(applyButton)

    let availableModsContainer = document.createElement("div")
    availableModsContainer.className = "container";
    availableModsList.appendChild(availableModsContainer);

    for(let polyMod of pml.LoadedMods) {
        let modDiv = document.createElement('button');
        modDiv.className = "button main";
        modDiv.style = "margin: 15px";
        modDiv.id = `mod:${polyMod.id}`;
        modDiv.innerHTML = `<img src="${polyMod.iconSrc}" style="max-width:100px;max-height=100px;">`;

        let leftDiv = document.createElement("div");
        leftDiv.className = "left"
        leftDiv.innerHTML = `<p class="name">  ${polyMod.name} <u>${polyMod.version}</u></p><p>  By ${polyMod.author}</p>`
        
        let rightDiv = document.createElement("div");
        rightDiv.className = "right"

        modDiv.appendChild(leftDiv)
        modDiv.appendChild(rightDiv)
        availableModsContainer.appendChild(modDiv);
    }

    let backButtonWrapper = document.createElement("div")
    backButtonWrapper.className = "button-wapper"
    
    let backButton = document.createElement('button');
    backButton.className = "button back";
    backButton.style = "margin: 10px; float: left;padding: 10px"
    backButton.innerHTML = `<img class="button-icon" src="images/back.svg" style="margin: 0 5"> Back`;
    backButton.addEventListener("click", () => {
        n.playUIClick();
        for(let intToUnhide of hideList) {
            menuDiv.children[intToUnhide].classList.remove("hidden")
        }
        modsDiv.remove()
    })
    backButtonWrapper.appendChild(backButton);

    let addButton = document.createElement('button');
    addButton.className = "button back";
    addButton.style = "margin: 10px 0; float: left;padding: 10px"
    addButton.innerHTML = `<img class="button-icon" src="images/load.svg" style="margin: 0 5"> Add`;
    backButtonWrapper.appendChild(addButton)

    let loadButton = document.createElement('button');
    loadButton.className = "button first";
    loadButton.style = "margin: 10px 0; float: right;padding: 10px"
    loadButton.innerHTML = `Load <img class="button-icon" src="images/arrow_right.svg">`;

    backButtonWrapper.appendChild(loadButton);
    availableModsList.appendChild(backButtonWrapper)
    
    modsDiv.appendChild(availableModsList)
    modsDiv.appendChild(activatedModsList)
    menuDiv.appendChild(modsDiv);
}

class PMLCoreMod extends PolyMod {
    constructor() {
        super("pmlcore", "PML Core", "Orangy", "1.0.0", "0.5.0-beta5");
    }
    init = (pmlInstance) => {
        this.modPmlInstance = pmlInstance;
        console.log(`Hello from ${this.name}!`)
        this.modPmlInstance.registerFuncMixin("dD", MixinType.TAIL, [`yD(this, iD, "f")`, `yD(this, rD, "f")`], (t, n, i, r, a, s, o, l, c, h, d, u, p, f, m, g, iD, rD) => {
            const modButton = document.createElement("button");
            modButton.className = "button button-image button-spawn";
            modButton.style = "animation-delay: 0s";
            modButton.innerHTML = '<img src="images/load.svg">';
            modButton.addEventListener("click", () => {
                n.playUIClick();
                createModScreen(this.modPmlInstance, n);
            });
            
            const modTextContainer = document.createElement("p");
            modTextContainer.textContent = "Mods"
            modButton.appendChild(modTextContainer);

            iD.insertBefore(modButton, iD.childNodes[0])
            console.log(rD)
            rD.push(modButton)
            console.log(rD);
        })
    }
    postInit = () => {
        console.log(`Hello from ${this.name}, but postInit this time!`);
        this.modPmlInstance.registerFuncMixin("FO", MixinType.HEAD, [], (track) => {
            console.log("Hello from FO")
        })
        this.modPmlInstance.registerFuncMixin("FO", MixinType.TAIL, [], (track) => {
            console.log("Hello from FO, but after!");
        })
        this.modPmlInstance.registerClassMixin("DN.prototype", "deleteCustomTrack", MixinType.HEAD, [], (track) => {
            console.log("Hello from deleteCustomTrack!");
            console.log(track);
        })
    }
}

export let polyMod = new PMLCoreMod();