//represents a single animated character
class CharacterControllerProxy {
    constructor(animations) {
        this._animations = animations;
    }

    get animations() {
        return this._animations;
    }
}

export default CharacterControllerProxy;
