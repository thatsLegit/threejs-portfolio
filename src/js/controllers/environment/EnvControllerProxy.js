class EnvControllerProxy {
    constructor(target) {
        this._target = target;
    }

    get treasurePosition() {
        return this._target.treasure.position;
    }
}

export default EnvControllerProxy;
