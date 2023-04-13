import FiniteStateMachine from './FiniteStateMachine';
import { IdleState, WalkState, WalkBackwardsState, RunState, FallingState } from './states';

class CharacterFSM extends FiniteStateMachine {
    constructor(proxy) {
        super();
        this._proxy = proxy;
        this._Init();
    }

    _Init() {
        this._AddState('idle', IdleState);
        this._AddState('walk', WalkState);
        this._AddState('walkingBackwards', WalkBackwardsState);
        this._AddState('run', RunState);
        this._AddState('falling', FallingState);
    }
}

export default CharacterFSM;
