//responsible for listening and recording key press

class CharacterControllerInput {
    constructor(keyboardType) {
        this._keyboardType = keyboardType;
        this._init();
    }

    _init() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
            freeCamera: false,
        };
        this._forwardK = this._keyboardType == 'qwerty' ? 'w' : 'z';
        this._backwardK = 's';
        this._leftK = this._keyboardType == 'qwerty' ? 'a' : 'q';
        this._rightK = 'd';

        document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    }

    _onKeyDown(event) {
        switch (event.key) {
            case this._forwardK: // w or z
            case this._forwardK.toUpperCase(): // W or Z
                this.keys.forward = true;
                break;
            case this._leftK: // a or q
            case this._leftK.toUpperCase(): //A or Q
                this.keys.left = true;
                break;
            case this._backwardK: // s
            case this._backwardK.toUpperCase(): //S
                this.keys.backward = true;
                break;
            case this._rightK: // d
            case this._rightK.toUpperCase(): // D
                this.keys.right = true;
                break;
            case 'c': // c: switch free camera
                this.keys.freeCamera = !this.keys.freeCamera;
                break;
            case 'Shift': // SHIFT
                this.keys.shift = true;
                break;
        }
    }
    _onKeyUp(event) {
        switch (event.key) {
            case this._forwardK: // w or z
            case this._forwardK.toUpperCase(): // W or Z
                this.keys.forward = false;
                break;
            case this._leftK: // a or q
            case this._leftK.toUpperCase(): //A or Q
                this.keys.left = false;
                break;
            case this._backwardK: // s
            case this._backwardK.toUpperCase(): //S
                this.keys.backward = false;
                break;
            case this._rightK: // d
            case this._rightK.toUpperCase(): // D
                this.keys.right = false;
                break;
            case 'Shift': // SHIFT
                this.keys.shift = false;
                break;
        }
    }
}

export default CharacterControllerInput;
