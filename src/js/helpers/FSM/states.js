import State from './State';

export class WalkState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'walk';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['walk'].action;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.enabled = true;

            if (prevState.Name == 'run' || prevState.Name == 'walkingBackwards') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    Exit() {}

    Update(timeElapsed, input) {
        if (input._keys.forward) {
            if (input._keys.shift) this._parent.SetState('run');
            return;
        }
        this._parent.SetState('idle');
    }
}

export class WalkBackwardsState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'walkingBackwards';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['walkingBackwards'].action;

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.enabled = true;

            if (prevState.Name == 'walk' || prevState.Name == 'run') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    Exit() {}

    Update(timeElapsed, input) {
        if (input._keys.forward) this._parent.SetState('walk');
        else if (input._keys.backward) return;
        else this._parent.SetState('idle');
    }
}

export class RunState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'run';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['run'].action;

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.enabled = true;

            if (prevState.Name == 'walk') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    Exit() {}

    Update(timeElapsed, input) {
        if (input._keys.forward) {
            if (!input._keys.shift) this._parent.SetState('walk');
            return;
        }
        this._parent.SetState('idle');
    }
}

export class IdleState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'idle';
    }

    Enter(prevState) {
        const idleAction = this._parent._proxy._animations['idle'].action;

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.5, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    }

    Exit() {}

    Update(_, input) {
        if (input._keys.forward) {
            this._parent.SetState('walk');
            return;
        }
        if (input._keys.space) {
            this._parent.SetState('openingALid');
            return;
        } //only dealing with opening for now
        if (input._keys.backward) {
            this._parent.SetState('walkingBackwards');
            return;
        }
    }
}

//dead end state, no key press can update it, it can only be set back to idle on game restart
export class FallingState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'falling';
    }

    Enter(prevState) {
        const idleAction = this._parent._proxy._animations['falling'].action;

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.5, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    }

    Exit() {}

    Update(_, input) {}
}
