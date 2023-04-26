import CharacterController from './CharacterController';

class CharacterControllerProxy {
    constructor(target) {
        this._target = target || new CharacterController();
    }

    get animations() {
        return this._target.animations;
    }

    get position() {
        return this._target.position;
    }
}

export default CharacterControllerProxy;
