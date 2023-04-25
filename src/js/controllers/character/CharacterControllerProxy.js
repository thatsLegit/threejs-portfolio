import CharacterController from './CharacterController';

class CharacterControllerProxy {
    constructor(target) {
        this.target = target || new CharacterController();
    }

    get animations() {
        return this.target.animations;
    }

    get position() {
        return this.target.position;
    }
}

export default CharacterControllerProxy;
