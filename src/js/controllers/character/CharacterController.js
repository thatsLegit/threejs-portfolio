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
        this._frameDecceleration = new THREE.Vector3();
        this._velocity = new THREE.Vector3();
        this._position = new THREE.Vector3();
        this._A = new THREE.Vector3();
        this._Q = new THREE.Quaternion();
        this._R = new THREE.Quaternion();
        this._forward = new THREE.Vector3(0, 0, 1);
        this._sideways = new THREE.Vector3(1, 0, 0);
        this._downward  = new THREE.Vector3(0, 1, 0);

        this._animations = {};
        this._input = new CharacterControllerInput(this._params.keyboardType);
        this._stateMachine = new CharacterFSM(new CharacterControllerProxy(this._animations));

        this._characterBox = new THREE.Box3();
        this._characterHitBox = [
            new THREE.Vector3(0, 20, 0), 
            new THREE.Vector3(10, 45, 10)
        ];

        this._PrepareModels();
    }
  
    _PrepareModels() {
        //model
        const charName = this._params.charName;
        const customLoader = this._params.customLoader;
        const model = customLoader._characterModel[charName].fbx;

        model.scale.setScalar(0.25);
        model.traverse(c => c.castShadow = true);
        // model.traverse(c => { //test this for the shiny models
        //     c.castShadow = true
        //     c.type == 'SkinnedMesh' && (c.material.shininess = 1);
        // });

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
        this._characterHitBox[0].set(0, 20, 0); //reset width param of character
        this._characterBox.setFromCenterAndSize(
            this._characterHitBox[0].add(this._target.position), 
            this._characterHitBox[1]
        );

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

        this._frameDecceleration.set(
            this._velocity.x * this._decceleration.x,
            this._velocity.y * this._decceleration.y,
            this._velocity.z * this._decceleration.z
        );
        this._frameDecceleration.multiplyScalar(timeInSeconds);
        this._frameDecceleration.z = Math.sign(this._frameDecceleration.z) * Math.min(
            Math.abs(this._frameDecceleration.z), Math.abs(this._velocity.z));
    
        this._velocity.add(this._frameDecceleration);

        this._Q.set(0,0,0,0) // reset THREE.Quaternion();
        this._A.set(0,0,0); // reset THREE.Vector3();
        this._R.copy(this._target.quaternion); // sets THREE.Quaternion to current rotation

        if (this._input._keys.shift) this._acceleration.multiplyScalar(2.0);
    
        if (this._input._keys.forward) this._velocity.z += this._acceleration.z * timeInSeconds;
        if (this._input._keys.backward) this._velocity.z -= this._acceleration.z * timeInSeconds;
        if (this._stateMachine._currentState.Name == 'falling') {
            this._velocity.y -= this._acceleration.y * timeInSeconds * 50
        }; //falling or jumping...

        if (this._input._keys.shift) this._acceleration.multiplyScalar(0.5);

        if (this._input._keys.left) {
            this._A.set(0, 1, 0);
            this._Q.setFromAxisAngle(this._A, Math.PI * timeInSeconds * this._acceleration.y * 0.5);
            this._R.multiply(this._Q);
        }
        if (this._input._keys.right) {
            this._A.set(0, 1, 0);
            this._Q.setFromAxisAngle(this._A, -Math.PI * timeInSeconds * this._acceleration.y * 0.5);
            this._R.multiply(this._Q);
        }
    
        this._target.quaternion.copy(this._R); //inject new rotation into character
    
        this._forward.set(0, 0, 1); //THREE.Vector3
        this._forward.applyQuaternion(this._target.quaternion);
        this._forward.normalize();
    
        this._sideways.set(1, 0, 0); //THREE.Vector3
        this._sideways.applyQuaternion(this._target.quaternion);
        this._sideways.normalize();

        this._downward.set(0, 1, 0); //THREE.Vector3
        this._downward.applyQuaternion(this._target.quaternion);
        this._downward.normalize();
    
        this._sideways.multiplyScalar(this._velocity.x * timeInSeconds);
        this._forward.multiplyScalar(this._velocity.z * timeInSeconds);
        this._downward.multiplyScalar(this._velocity.y * timeInSeconds);
    
        this._target.position.add(this._forward); //updates the position and rotation of the character
        this._target.position.add(this._sideways);
        this._target.position.add(this._downward);
    
        this._position.copy(this._target.position.clone().sub(this._downward)); //updates the camera position
    
        //update character model's animation
        if (this._mixer) this._mixer.update(timeInSeconds);
    }
};


export default CharacterController;