class EnvControllerProxy {
    constructor(target) {
        this._target = target;
    }

    get treasurePosition() {
        return this._target.treasure.position;
    }

    get animations() {
        return this._target._animations;
    }
}

export default EnvControllerProxy;
