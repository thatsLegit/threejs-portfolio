//responsible for listening and recording key press

class CharacterControllerInput {
    constructor() {
        this._Init();    
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
        document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    }

    _onKeyDown(event) {
        console.log('key down');
        switch (event.key) {
            case 'w': // w
                this._keys.forward = true;
                break;
            case 'a': // a
                this._keys.left = true;
                break;
            case 's': // s
                this._keys.backward = true;
                break;
            case 'd': // d
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
            case 'w': // w
            case 'W': // w
            this._keys.forward = false;
            break;
            case 'a': // a
            this._keys.left = false;
            break;
            case 's': // s
            this._keys.backward = false;
            break;
            case 'd': // d
            this._keys.right = false;
            break;
            case 'Shift': // SHIFT
            this._keys.shift = false;
            break;
        }
    }
};

export default CharacterControllerInput;