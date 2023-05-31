import * as THREE from 'three';
import soundTrack from '../../../assets/audio/wind1.wav';

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
        audioLoader.load(soundTrack, function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.1);
            sound.play();
        });
    }
}

export default SoundController;
