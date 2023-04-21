class FiniteStateMachine {
    constructor() {
        this._states = {};
        this.currentState = null;
    }

    _addState(name, type) {
        this._states[name] = type;
    }

    setState(name) {
        const prevState = this.currentState;

        if (prevState) {
            if (prevState.name == name) return;
            prevState.exit();
        }

        const state = new this._states[name](this);

        this.currentState = state;
        state.enter(prevState);
    }

    update(timeElapsed, input) {
        if (this.currentState) this.currentState.update(timeElapsed, input);
    }
}

export default FiniteStateMachine;
