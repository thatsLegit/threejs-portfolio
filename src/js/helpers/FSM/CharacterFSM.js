import FiniteStateMachine from './FiniteStateMachine';
import { IdleState, WalkState, WalkBackwardsState, RunState, FallingState } from './states';

class CharacterFSM extends FiniteStateMachine {
    constructor(proxy) {
        super();
        this.proxy = proxy;
        this._init();
    }

    _init() {
        this._addState('idle', IdleState);
        this._addState('walk', WalkState);
        this._addState('walkingBackwards', WalkBackwardsState);
        this._addState('run', RunState);
        this._addState('falling', FallingState);
    }
}

export default CharacterFSM;
