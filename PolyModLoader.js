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

export class PolyModLoader {

}