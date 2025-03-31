import { PolyMod, MixinType } from "../../../PolyModLoader.js";

let createModScreen = (pml) => {
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

    let availableModsContainer = document.createElement("div")
    availableModsContainer.className = "container";
    availableModsList.appendChild(availableModsContainer);

    for(let polyMod of pml.LoadedMods) {
        let modDiv = document.createElement('button');
        modDiv.className = "button main";
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

    let buttonWrapper = document.createElement("div")
    buttonWrapper.className = "button-wapper"
    
    let backButton = document.createElement('button');
    backButton.className = "button back";
    backButton.innerHTML = `<img class="button-icon" src="images/back.svg"> Back`;
    backButton.addEventListener("click", () => {
        for(let intToUnhide of hideList) {
            menuDiv.children[intToUnhide].classList.remove("hidden")
        }
        modsDiv.remove()
    })
    buttonWrapper.appendChild(backButton);
    availableModsList.appendChild(buttonWrapper)
    
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
                createModScreen(this.modPmlInstance);
            });
            
            const modTextContainer = document.createElement("p");
            modTextContainer.textContent = "Mods"
            modButton.appendChild(modTextContainer);

            iD.insertBefore(modButton, iD.childNodes[0])
            rD.push(modButton);
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