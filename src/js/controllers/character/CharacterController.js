import * as THREE from "three";

import CharacterFSM from '../../helpers/FSM/CharacterFSM';
import CharacterControllerProxy from './CharacterControllerProxy';
import CharacterControllerInput from './CharacterControllerInput';

const overlay = document.querySelector('.overlay');
const overlayContent = document.querySelector('.overlay-content');


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
        this._decceleration = new THREE.Vector3(-0.001, -0.0001, -10);
        this._acceleration = new THREE.Vector3(3, 1, 400);
        this._velocity = new THREE.Vector3();
        this._position = new THREE.Vector3();

        this._animations = {};
        this._input = new CharacterControllerInput(this._params.keyboardType);
        this._stateMachine = new CharacterFSM(new CharacterControllerProxy(this._animations));

        this._PrepareModels();
    }
  
    _PrepareModels() {
        //model
        const charName = this._params.charName;
        const customLoader = this._params.customLoader;
        const model = customLoader._characterModel[charName].fbx;

        model.scale.setScalar(0.25);
        model.traverse(c => c.castShadow = true);

        this._target = model;
        this._target.position.copy(new THREE.Vector3());
        this._target.rotation.setFromVector3(new THREE.Vector3(0, Math.PI, 0));
        this._params.scene.add(this._target);

        this._mixer = new THREE.AnimationMixer(this._target);

        //animations/states
        for (const animName in customLoader._charAnimations[charName]) {
            const clip = customLoader._charAnimations[charName][animName].anim.animations[0];
            const action = this._mixer.clipAction(clip);

            this._animations[animName] = {
                clip: clip,
                action: action
            };
        }

        //default beginning state
        this._stateMachine.SetState('idle');
    }
  
    Update(timeInSeconds) { //called on each frame
        if (!this._target) return;

        //setting character's "hit box" based on its position (change it if you change character model scale)
        this._characterBox = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(0, 20, 0).add(this._target.position), new THREE.Vector3(10, 45, 10));

        //0,1,2 planes, 3 sphere, ...triangles
        const intersects = this._params.ground.some((elem, idx) => {
            if(idx == 0 || idx == 1 || idx == 2) {
                if (this._characterBox.intersectsBox(elem)) return true;
            } else if(idx == 3) {
                if (this._characterBox.intersectsSphere(elem)) return true;
            } else {
                if (this._characterBox.intersectsTriangle(elem)) return true;
            }
        });

        //update the current state (FSM)
        if(!intersects && this._stateMachine._currentState.Name != 'falling') {
            // make the game over menu progressively appear
            overlay.style.opacity = 0;
            overlay.style.display = "block";

            //set the state to falling
            this._stateMachine.SetState('falling');

            //add an event listener on mouse click for the game to restart
            overlayContent.addEventListener('click', reset.bind(this));

            let iteration = 1;
            const interval = setInterval(opacityHanlder, 25);

            function opacityHanlder() {
                const overlayComputedStyle = window.getComputedStyle(overlay);
                const overlayOpacity = overlayComputedStyle.getPropertyValue('opacity');
                if(overlayOpacity == 0.65) clearInterval(interval);
                overlay.style.opacity = 0.01 * iteration;
                iteration++;
            }
            function reset() {
                this._stateMachine.SetState('idle');
                this._target.position.set(0, 0, 0);
                this._velocity.set(0, 0, 0);
                overlay.style.opacity = 0;
                overlay.style.display = "none";
                iteration = 1;
            }
        } else {
            //normal mode of updating the FSM
            this._stateMachine.Update(timeInSeconds, this._input); 
        }

        if(this._input._keys.freeCamera) {
            if(this._params.cameraControl.enabled == false) {
                this._params.cameraControl.target.set(
                    this._position.x, 
                    this._position.y + 30, 
                    this._position.z
                    );
                this._params.cameraControl.update();
                this._params.cameraControl.enabled = true
            };
        } else {
            this._params.cameraControl.enabled = false
        }

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
    
        if (this._input._keys.forward) velocity.z += acc.z * timeInSeconds;
        if (this._input._keys.backward) velocity.z -= acc.z * timeInSeconds;
        if (this._stateMachine._currentState.Name == 'falling') {
            velocity.y -= acc.y * timeInSeconds * 50
        }; //falling or jumping...
        if (this._input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y * 0.5);
            _R.multiply(_Q);
        }
        if (this._input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y * 0.5);
            _R.multiply(_Q);
        }
    
        controlObject.quaternion.copy(_R); //inject new rotation into character
    
        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);
    
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();
    
        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        const downward = new THREE.Vector3(0, 1, 0);
        downward.applyQuaternion(controlObject.quaternion);
        downward.normalize();
    
        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);
        downward.multiplyScalar(velocity.y * timeInSeconds);
    
        controlObject.position.add(forward); //updates the position and rotation of the character
        controlObject.position.add(sideways);
        controlObject.position.add(downward);
    
        this._position.copy(controlObject.position.clone().sub(downward)); //updates the camera position
    
        //update character model's animation
        if (this._mixer) this._mixer.update(timeInSeconds);
    }
};


export default CharacterController;