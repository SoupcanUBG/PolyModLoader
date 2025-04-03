import { PolyMod, MixinType } from "../../../PolyModLoader.js";

let promptUserForNewMod = (pml, n) => {
    let menuDiv = document.getElementById("ui").children[0];

    let promptDiv = document.createElement("div")
    promptDiv.className = "nickname";
    
    let modUrlHead = document.createElement("h1");
    modUrlHead.innerText = "Mod URL";
    modUrlHead.style = "float: left;";
    promptDiv.appendChild(modUrlHead);

    let urlInput = document.createElement("input")
    urlInput.type = "text";
    promptDiv.appendChild(urlInput);

    let modVersionHead = document.createElement("h1");
    modVersionHead.innerText = "Mod Version";
    modVersionHead.style = "float: left;";
    promptDiv.appendChild(modVersionHead);

    let versionInput = document.createElement("input")
    versionInput.type = "text";
    promptDiv.appendChild(versionInput);
    
    let warningh2 = document.createElement("h2");
    warningh2.style = "color: #f66;margin:5px;";
    warningh2.innerText = "Only install mods from trusted sources!";
    promptDiv.appendChild(warningh2);

    let importButton = document.createElement("button");
    importButton.style = "float: right;"
    importButton.className = "button right";
    importButton.innerHTML = `<img class="button-icon" src="images/import.svg"> Import`
    importButton.addEventListener("click", () => {
        let modUrl = urlInput.value;
        let modVersion = versionInput.value;
        pml.addMod({"base": modUrl, "version": modVersion, "loaded": false}).then(() => {
            promptDiv.remove();
            createModScreen(pml, n);
        })
    })
    promptDiv.appendChild(importButton);

    let goBackButton = document.createElement("button");
    goBackButton.style = "float: left;"
    goBackButton.className = "button left";
    goBackButton.innerHTML = `<img class="button-icon" src="images/back.svg"> Back`
    goBackButton.addEventListener("click", () => {
        promptDiv.remove();
        createModScreen(pml, n);
    })
    promptDiv.appendChild(goBackButton);

    menuDiv.appendChild(promptDiv);
}

let createModScreen = (pml, n) => {
    let menuDiv;
    for(let elem of document.getElementById("ui").children) {
        if(elem.classList.contains("menu")) {
            menuDiv = elem;
        }
    }
    let hideList = [0,1,3,4,5,6]
    for(let intToHide of hideList) {
        menuDiv.children[intToHide].classList.add("hidden")
    }

    let selectedMod;

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
    unloadButton.disabled = true;
    unloadButton.style = "margin: 10px 0; float: left;padding: 10px; margin-left:2px;"
    unloadButton.innerHTML = `<img class="button-icon" src="images/arrow_left.svg"> Unload`;
    unloadButton.addEventListener("click", () => {
        let mod = pml.getMod(selectedMod.id.replace("mod:", ""));
        pml.setModLoaded(mod, false);
        modsDiv.remove();
        createModScreen(pml, n);
    })

    buttonWrapper.appendChild(unloadButton);

    let goUpButton = document.createElement('button');
    goUpButton.className = "button first";
    goUpButton.disabled = true;
    goUpButton.style = "margin: 10px; float: left;padding: 10px"
    goUpButton.innerHTML = `<img class="button-icon" src="images/arrow_up.svg" style="margin: 0px 10px">`;
    goUpButton.addEventListener("click", () => {
        let mod = pml.getMod(selectedMod.id.replace("mod:", ""));
        pml.reorderMod(mod, -1);
        modsDiv.remove();
        createModScreen(pml, n);
    })
    buttonWrapper.appendChild(goUpButton);

    let goDownButton = document.createElement('button');
    goDownButton.className = "button first";
    goDownButton.disabled = true;
    goDownButton.style = "margin: 10px 0; float: left;padding: 10px"
    goDownButton.innerHTML = `<img class="button-icon" src="images/arrow_down.svg" style="margin: 0px 10px">`;
    goDownButton.addEventListener("click", () => {
        let mod = pml.getMod(selectedMod.id.replace("mod:", ""));
        pml.reorderMod(mod, 1);
        modsDiv.remove();
        createModScreen(pml, n);
    })
    buttonWrapper.appendChild(goDownButton);

    let applyButton = document.createElement('button');
    applyButton.className = "button first";
    applyButton.addEventListener("click", () => {n.playUIClick();location.reload()})
    applyButton.style = "margin: 10px 0; float: right;padding: 10px"
    applyButton.innerHTML = `Apply <img class="button-icon" src="images/checkmark.svg" style="margin: 0 5">`;
    buttonWrapper.appendChild(applyButton)

    let availableModsContainer = document.createElement("div")
    availableModsContainer.className = "container";
    availableModsList.appendChild(availableModsContainer);

    for(let polyMod of pml.getAllMods) {
        let modDiv = document.createElement('button');
        modDiv.className = "button main";
        modDiv.style = "margin: 15px";
        modDiv.id = `mod:${polyMod.id}`;
        modDiv.innerHTML = `<img src="${polyMod.iconSrc}" style="max-width:100px;max-height=100px;">`;
        modDiv.addEventListener("click", () => {
            if(!polyMod.isLoaded) {
                goUpButton.disabled = true;
                goDownButton.disabled = true;
                unloadButton.disabled = true;
                loadButton.disabled = false;
            } else {
                unloadButton.disabled = false;
                loadButton.disabled = true;
                goUpButton.disabled = false;
                goDownButton.disabled = false;
                if(activatedModsContainer.children[0] === modDiv) {
                    goUpButton.disabled = true;
                } 
                if(activatedModsContainer.children[activatedModsContainer.children.length - 1] === modDiv) {
                    goDownButton.disabled = true;
                }
            }
            if(selectedMod === modDiv) {
                goUpButton.disabled = true;
                goDownButton.disabled = true;
                unloadButton.disabled = true;
                loadButton.disabled = true;
                modDiv.classList.remove("selected");
                selectedMod = null;
            } else {
                if(selectedMod) {
                    selectedMod.classList.remove("selected")
                }
                modDiv.classList.add("selected");
                selectedMod = modDiv;
            }
        })

        let leftDiv = document.createElement("div");
        leftDiv.className = "left"
        leftDiv.innerHTML = `<p class="name">  ${polyMod.name} <u>${polyMod.version}</u></p><p>  By ${polyMod.author}</p>`
        
        let rightDiv = document.createElement("div");
        rightDiv.className = "right"

        modDiv.appendChild(leftDiv)
        modDiv.appendChild(rightDiv)
        if(polyMod.isLoaded) {
            activatedModsContainer.appendChild(modDiv)
        } else {
            availableModsContainer.appendChild(modDiv);
        }
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
    addButton.addEventListener("click", () => {
        n.playUIClick();
        modsDiv.remove();
        promptUserForNewMod(pml, n);
    })
    backButtonWrapper.appendChild(addButton)

    let loadButton = document.createElement('button');
    loadButton.className = "button first";
    loadButton.disabled = true;
    loadButton.style = "margin: 10px 0; float: right;padding: 10px; margin-right:2px;"
    loadButton.innerHTML = `Load <img class="button-icon" src="images/arrow_right.svg">`;
    loadButton.addEventListener("click", () => {
        let mod = pml.getMod(selectedMod.id.replace("mod:", ""));
        pml.setModLoaded(mod, true);
        modsDiv.remove();
        createModScreen(pml, n);
    })

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
    }
}

export let polyMod = new PMLCoreMod();