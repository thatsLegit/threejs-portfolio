import * as THREE from 'three';

class SoundController {
    constructor(camera) {
        this._camera = camera;
        this._init();
    }

    _init() {
        // create an AudioListener and add it to the camera
        const listener = new THREE.AudioListener();
        this._camera.add(listener);

        // create a global audio source
        const sound = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('./assets/audio/wind1.wav', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            sound.play();
        });
    }
}

export default SoundController;
