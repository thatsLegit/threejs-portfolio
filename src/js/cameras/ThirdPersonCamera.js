import * as THREE from 'three';

class ThirdPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = params.camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();

        this._idealOffset = new THREE.Vector3();
        this._idealLookat = new THREE.Vector3();
    }

    _CalculateIdealOffset() {
        this._idealOffset.set(0, 80, -100); //reset
        this._idealOffset.applyQuaternion(this._params.target.Rotation);
        this._idealOffset.add(this._params.target.Position);
        return this._idealOffset;
    }

    _CalculateIdealLookat() {
        this._idealLookat.set(0, 30, 80); //reset
        this._idealLookat.applyQuaternion(this._params.target.Rotation);
        this._idealLookat.add(this._params.target.Position);
        return this._idealLookat;
    }

    Update(timeElapsed) {
        const idealOffset = this._CalculateIdealOffset();
        const idealLookat = this._CalculateIdealLookat();

        const t = 1.0 - Math.pow(0.001, timeElapsed);

        this._currentPosition.lerp(idealOffset, t);
        this._currentLookat.lerp(idealLookat, t);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }
}

export default ThirdPersonCamera;
