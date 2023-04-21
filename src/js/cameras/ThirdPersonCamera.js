import * as THREE from 'three';

class ThirdPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = params.camera;
        this._cameraControl = params.cameraControl;
        this._target = params.target;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();

        this._idealOffset = new THREE.Vector3();
        this._idealLookat = new THREE.Vector3();
    }

    _calculateIdealOffset() {
        this._idealOffset.set(0, 80, -100); //reset
        this._idealOffset.applyQuaternion(this._target.rotation);
        this._idealOffset.add(this._target.position);
        return this._idealOffset;
    }

    _calculateIdealLookat() {
        this._idealLookat.set(0, 30, 80); //reset
        this._idealLookat.applyQuaternion(this._target.rotation);
        this._idealLookat.add(this._target.position);
        return this._idealLookat;
    }

    update(timeElapsed) {
        if (this._target.input.keys.freeCamera && this._cameraControl.enabled) return;
        else if (this._target.input.keys.freeCamera && !this._cameraControl.enabled) {
            this._cameraControl.target.set(
                this._target.position.x,
                this._target.position.y + 40,
                this._target.position.z
            );
            this._cameraControl.update();
            this._cameraControl.enabled = true;
        } else if (!this._target.input.keys.freeCamera && this._cameraControl.enabled)
            this._cameraControl.enabled = false;
        else {
            const idealOffset = this._calculateIdealOffset();
            const idealLookat = this._calculateIdealLookat();

            const t = 1.0 - Math.pow(0.001, timeElapsed);

            this._currentPosition.lerp(idealOffset, t);
            this._currentLookat.lerp(idealLookat, t);

            this._camera.position.copy(this._currentPosition);
            this._camera.lookAt(this._currentLookat);
        }
    }
}

export default ThirdPersonCamera;
