import State from './State';

export class WalkState extends State {
    constructor(fsm) {
        super(fsm);
    }

    get name() {
        return 'walk';
    }

    enter(prevState) {
        const currentAction = this._fsm.proxy.animations['walk'].action;

        if (!prevState) return currentAction.play();

        const prevAction = this._fsm.proxy.animations[prevState.name].action;
        currentAction.enabled = true;

        if (prevState.name == 'run' || prevState.name == 'walkingBackwards') {
            const ratio = currentAction.getClip().duration / prevAction.getClip().duration;
            currentAction.time = prevAction.time * ratio;
        } else {
            currentAction.time = 0.0;
            currentAction.setEffectiveTimeScale(1.0);
            currentAction.setEffectiveWeight(1.0);
        }

        currentAction.crossFadeFrom(prevAction, 0.5, true);
        currentAction.play();
    }

    update(timeElapsed, input) {
        if (input.keys.forward) {
            if (input.keys.shift) this._fsm.setState('run');
        } else {
            this._fsm.setState('idle');
        }
    }
}

export class WalkBackwardsState extends State {
    constructor(fsm) {
        super(fsm);
    }

    get name() {
        return 'walkingBackwards';
    }

    enter(prevState) {
        const currentAction = this._fsm.proxy.animations['walkingBackwards'].action;

        if (!prevState) return currentAction.play();

        const prevAction = this._fsm.proxy.animations[prevState.name].action;
        currentAction.enabled = true;

        if (prevState.name == 'walk' || prevState.name == 'run') {
            const ratio = currentAction.getClip().duration / prevAction.getClip().duration;
            currentAction.time = prevAction.time * ratio;
        } else {
            currentAction.time = 0.0;
            currentAction.setEffectiveTimeScale(1.0);
            currentAction.setEffectiveWeight(1.0);
        }

        currentAction.crossFadeFrom(prevAction, 0.5, true);
        currentAction.play();
    }

    update(timeElapsed, input) {
        if (input.keys.forward) this._fsm.setState('walk');
        else if (input.keys.backward) return;
        else this._fsm.setState('idle');
    }
}

export class RunState extends State {
    constructor(fsm) {
        super(fsm);
    }

    get name() {
        return 'run';
    }

    enter(prevState) {
        const currentAction = this._fsm.proxy.animations['run'].action;

        if (!prevState) return currentAction.play();

        const prevAction = this._fsm.proxy.animations[prevState.name].action;
        currentAction.enabled = true;

        if (prevState.name == 'walk') {
            const ratio = currentAction.getClip().duration / prevAction.getClip().duration;
            currentAction.time = prevAction.time * ratio;
        } else {
            currentAction.time = 0.0;
            currentAction.setEffectiveTimeScale(1.0);
            currentAction.setEffectiveWeight(1.0);
        }

        currentAction.crossFadeFrom(prevAction, 0.5, true);
        currentAction.play();
    }

    update(timeElapsed, input) {
        if (input.keys.forward) {
            if (!input.keys.shift) this._fsm.setState('walk');
        } else {
            this._fsm.setState('idle');
        }
    }
}

export class IdleState extends State {
    constructor(fsm) {
        super(fsm);
    }

    get name() {
        return 'idle';
    }

    enter(prevState) {
        const currentAction = this._fsm.proxy.animations['idle'].action;

        if (!prevState) return currentAction.play();

        const prevAction = this._fsm.proxy.animations[prevState.name].action;
        currentAction.time = 0.0;
        currentAction.enabled = true;
        currentAction.setEffectiveTimeScale(1.0);
        currentAction.setEffectiveWeight(1.0);
        currentAction.crossFadeFrom(prevAction, 0.5, true);
        currentAction.play();
    }

    update(timeElapsed, input) {
        if (input.keys.forward) this._fsm.setState('walk');
        else if (input.keys.backward) this._fsm.setState('walkingBackwards');
    }
}

// Dead end state, no key press can update it, it can only be set back to idle on game restart
export class FallingState extends State {
    constructor(fsm) {
        super(fsm);
    }

    get name() {
        return 'falling';
    }

    enter(prevState) {
        const currentAction = this._fsm.proxy.animations['falling'].action;

        if (!prevState) return currentAction.play();

        const prevAction = this._fsm.proxy.animations[prevState.name].action;
        currentAction.time = 0.0;
        currentAction.enabled = true;
        currentAction.setEffectiveTimeScale(1.0);
        currentAction.setEffectiveWeight(1.0);
        currentAction.crossFadeFrom(prevAction, 0.5, true);
        currentAction.play();
    }
}
