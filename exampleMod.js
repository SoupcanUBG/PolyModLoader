import { PolyMod, MixinType } from "./PolyModLoader.js";

class PMLCoreMod extends PolyMod {
    init = (pmlInstance) => {
        this.modPmlInstance = pmlInstance;
        console.log(`Hello from ${this.name}!`)
        this.modPmlInstance.registerFuncMixin("dD", MixinType.TAIL, [`yD(this, iD, "f")`, `yD(this, rD, "f")`], (t, n, i, r, a, s, o, l, c, h, d, u, p, f, m, g, iD, rD) => {
            const modButton = document.createElement("button");
            modButton.className = "button button-image button-spawn";
            modButton.style = "animation-delay: 0.7s";
            modButton.innerHTML = '<img src="images/load.svg">';
            modButton.addEventListener("click", (() => {
                    n.playUIClick();
                    let menuDiv = document.getElementById("ui").children[0];
                    let originalState = Array.prototype.slice.call(originalState).concat(Array.prototype.slice(menuDiv));
                    let modDiv = document.createElement('div');
                    modDiv.className = "track-info";

                    menuDiv.appendChild(modDiv);
                    console.log(originalState)
                }
            ));
            const modTextContainer = document.createElement("p");
            modTextContainer.textContent = "Mods"
            modButton.appendChild(modTextContainer);
            iD.insertBefore(modButton, iD.childNodes[0])
            rD.push(modButton);
            console.log(iD);
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

export let polyMod = new PMLCoreMod("polymodloader", "PML Core", "Orangy");