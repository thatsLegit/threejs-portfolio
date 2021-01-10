import * as THREE from "../node_modules/three/build/three.module.js";

import CharacterFSM from './CharacterFSM.js';
import CharacterControllerProxy from './CharacterControllerProxy.js';
import CharacterControllerInput from './CharacterControllerInput.js';


class CharacterController {
    constructor(params) {
        this._Init(params);
    }

    get Position() {
        return this._position;
    }
    get Rotation() {
        if (!this._target) return new THREE.Quaternion();
        return this._target.quaternion;
    }

    _Init(params) {
        this._params = params;
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this._acceleration = new THREE.Vector3(1, 1, 150.0);
        this._velocity = new THREE.Vector3(0, 0, 0);
        this._position = new THREE.Vector3();

        this._animations = {};
        this._input = new CharacterControllerInput();
        this._stateMachine = new CharacterFSM(new CharacterControllerProxy(this._animations));

        this._PrepareModels();
    }
  
    _PrepareModels() {
        //model
        const customLoader = this._params.customLoader;
        const model = customLoader._characterModel.Megan.fbx;

        model.scale.setScalar(0.25);
        model.traverse(c => c.castShadow = true);

        this._target = model;
        this._params.scene.add(this._target);

        this._mixer = new THREE.AnimationMixer(this._target);

        //animations/states
        for (const animName in customLoader._charAnimations) {
            const clip = customLoader._charAnimations[animName].anim.animations[0];
            const action = this._mixer.clipAction(clip);

            this._animations[animName] = {
                clip: clip,
                action: action
            };
        }
        //default beginning state
        this._stateMachine.SetState('idle');

        // let BBox = new THREE.Box3().setFromObject(model);
        // BBox.min.sub(model.position);
        // BBox.max.sub(model.position);
        // const helper = new THREE.Box3Helper( BBox, 0xffff00 );
        // this._params.scene.add( helper );
    }
  
    Update(timeInSeconds) { //called on each frame
        if (!this._target) return;
    
        this._stateMachine.Update(timeInSeconds, this._input); //update the current state (FSM)

        if(this._input._keys.freeCamera) {
            if(this._params.cameraControl.enabled == false) {
                this._params.cameraControl.target.set(
                    this._position.x, 
                    this._position.y + 20, 
                    this._position.z
                    );
                this._params.cameraControl.update();
                this._params.cameraControl.enabled = true
            };
        } else {
            this._params.cameraControl.enabled = false
        }
    
        //then it's all about moving the model
        const velocity = this._velocity;
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this._decceleration.x,
            velocity.y * this._decceleration.y,
            velocity.z * this._decceleration.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z));
    
        velocity.add(frameDecceleration);
    
        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();

        const acc = this._acceleration.clone();

        if (this._input._keys.shift) acc.multiplyScalar(2.0);
    
        if (this?._stateMachine?._currentState?.Name == 'openingALid'
            || this?._stateMachine?._currentState?.Name == 'closingALid') {
            acc.multiplyScalar(0.0);
        }
    
        if (this._input._keys.forward) velocity.z += acc.z * timeInSeconds;
        if (this._input._keys.backward) velocity.z -= acc.z * timeInSeconds;
        if (this._input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }
        if (this._input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }
    
        controlObject.quaternion.copy(_R);
    
        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);
    
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();
    
        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();
    
        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);
    
        controlObject.position.add(forward); //modify this
        controlObject.position.add(sideways);
    
        this._position.copy(controlObject.position);
    
        if (this._mixer) this._mixer.update(timeInSeconds);
    }
};

export default CharacterController;