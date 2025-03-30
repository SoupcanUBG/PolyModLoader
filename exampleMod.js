import { PolyMod } from "./PolyModLoader.js";

class PMLCoreMod extends PolyMod {
    init = () => {
        console.log(`Hello from ${this.name}!`)
        this.modPmlInstance.registerFuncMixin("dD", true, (t, n, i, r, a, s, o, l, c, h, d, u, p, f, m, g) => {
            const y = document.createElement("button");
            y.className = "button button-image";
            y.innerHTML = '<img src="images/editor.svg">';
            y.addEventListener("click", ( () => {
                    n.playUIClick();
                    p()
                }
            ));
            const A = document.createElement("p");
            A.textContent = t.get("Editor");
            y.appendChild(A);
            let localyD = this.modPmlInstance.getFromPolyTrack("yD");
            let localiD = this.modPmlInstance.getFromPolyTrack("iD");
            let localrD = this.modPmlInstance.getFromPolyTrack("rD");
            let localAD = this.modPmlInstance.getFromPolyTrack("AD");
            localyD.call(localAD, localAD, localiD, "f").appendChild(y);
            localyD.call(localAD, localAD, localrD, "f").push(y);
            // this.modPmlInstance.getFromPolyTrack(`yD(this, iD, "f")`).appendChild(y);
            // this.modPmlInstance.getFromPolyTrack(`yD(this, rD, "f")`).push(y);
        })
    }
    postInit = () => {
        console.log(`Hello from ${this.name}, but postInit this time!`);
        this.modPmlInstance.registerFuncMixin("FO", true, (track) => {
            console.log("Hello from FO")
        })
        this.modPmlInstance.registerFuncMixin("FO", false, (track) => {
            console.log("Hello from FO, but after!");
        })
        this.modPmlInstance.registerClassMixin("DN.prototype", "deleteCustomTrack", true, (track) => {
            console.log("Hello from deleteCustomTrack!");
            console.log(track);
        })
    }
}

export let polyMod = new PMLCoreMod("polymodloader", "PML Core", "Orangy");