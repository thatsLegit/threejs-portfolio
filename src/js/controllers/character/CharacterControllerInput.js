//responsible for listening and recording key press

class CharacterControllerInput {
    constructor(keyboardType) {
        this._Init();   
        this._keyboardType = keyboardType; 
    }

    _Init() {
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
            freeCamera: false
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
                this._keys.forward = true;
                break;
            case this._leftK: // a or q
                this._keys.left = true;
                break;
            case this._backwardK: // s
                this._keys.backward = true;
                break;
            case this._rightK: // d
                this._keys.right = true;
                break;
            case 'f': // f: switch free camera
                this._keys.freeCamera = !this._keys.freeCamera;
                break;
            case 'Shift': // SHIFT
                this._keys.shift = true;
                break;
        }
    }
    _onKeyUp(event) {
        switch(event.key) {
            case this._forwardK: // w or z
            case this._forwardK.toUpperCase(): // W or Z
            this._keys.forward = false;
            break;
            case this._leftK: // a or q
            this._keys.left = false;
            break;
            case this._backwardK: // s
            this._keys.backward = false;
            break;
            case this._rightK: // d
            this._keys.right = false;
            break;
            case 'Shift': // SHIFT
            this._keys.shift = false;
            break;
        }
    }
};

export default CharacterControllerInput;