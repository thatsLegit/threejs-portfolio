import * as THREE from 'three';

import CharacterFSM from '../../helpers/FSM/CharacterFSM';
import CharacterControllerProxy from './CharacterControllerProxy';
import CharacterControllerInput from './CharacterControllerInput';

const overlay = document.querySelector('#go-overlay');
const overlayContent = document.querySelector('#go-overlay #content');

class CharacterController {
    constructor(params) {
        this._params = params;
        this._init(params);
    }

    get animations() {
        return this._animations;
    }
    get position() {
        return this._position;
    }
    get rotation() {
        if (!this._target) return new THREE.Quaternion();
        return this._target.quaternion;
    }

    _init() {
        this._decceleration = new THREE.Vector3(-0.001, -0.0001, -10);
        this._acceleration = new THREE.Vector3(0.5, 200, 400);
        this._frameDecceleration = new THREE.Vector3();

        this._velocity = new THREE.Vector3();
        this._position = new THREE.Vector3();

        this._rotationAxis = new THREE.Vector3(0, 1, 0); /* we rotate around the y axis */
        this._rotationQuaternion = new THREE.Quaternion();
        this._rotation = new THREE.Quaternion();

        this._forward = new THREE.Vector3(0, 0, 1);
        this._sideways = new THREE.Vector3(1, 0, 0);
        this._downward = new THREE.Vector3(0, 1, 0);

        this.input = new CharacterControllerInput(this._params.keyboardType);

        this._animations = {};
        this._characterBox = new THREE.Box3();
        this._characterHitBox = [new THREE.Vector3(0, 20, 0), new THREE.Vector3(10, 45, 10)];

        this._prepareModels();
    }

    _prepareModels() {
        // model
        const model = this._params.characterModel.fbx;

        model.scale.setScalar(0.25);
        // fixes the specular map not loading
        model.traverse((c) => {
            if (c.type == 'SkinnedMesh') {
                c.material.transparent = false;
                c.material.specularMap = this._params.characterModel.specularMap;
            }
            c.castShadow = true;
            c.receiveShadow = true;
        });

        this._target = model;
        this._target.position.copy(new THREE.Vector3());
        this._target.rotation.setFromVector3(new THREE.Vector3(0, Math.PI, 0));
        this._params.scene.add(this._target);

        this._mixer = new THREE.AnimationMixer(this._target);

        // animations/states
        for (const animName in this._params.characterAnimations) {
            const clip = this._params.characterAnimations[animName].anim.animations[0];
            const action = this._mixer.clipAction(clip);

            this._animations[animName] = {
                clip: clip,
                action: action,
            };
        }

        this._stateMachine = new CharacterFSM(new CharacterControllerProxy(this));

        // default beginning state
        this._stateMachine.setState('idle');
    }

    _isOnGround() {
        // setting character's "hit box" based on its position (change it if you change character model scale)
        this._characterHitBox[0].set(0, 20, 0); // reset width param of character
        this._characterBox.setFromCenterAndSize(
            this._characterHitBox[0].add(this._target.position),
            this._characterHitBox[1]
        );

        if (this._params.ground.planes.some((elem) => this._characterBox.intersectsBox(elem)))
            return true;
        if (this._params.ground.spheres.some((elem) => this._characterBox.intersectsSphere(elem)))
            return true;
        if (
            this._params.ground.triangles.some((elem) =>
                this._characterBox.intersectsTriangle(elem)
            )
        )
            return true;

        return false;
    }

    _reset() {
        this._stateMachine.setState('idle');
        this._target.position.set(0, 0, 0);
        this._velocity.set(0, 0, 0);
        overlay.style.opacity = 0;
        overlay.style.display = 'none';
    }

    _makeCharacterFall() {
        // make the game over menu progressively appear
        overlay.style.opacity = 0;
        overlay.style.display = 'block';

        //set the state to falling
        this._stateMachine.setState('falling');

        //add an event listener on mouse click for the game to restart
        overlayContent.addEventListener('click', this._reset.bind(this));

        let iteration = 1;
        const interval = setInterval(() => {
            const overlayComputedStyle = window.getComputedStyle(overlay);
            const overlayOpacity = overlayComputedStyle.getPropertyValue('opacity');
            if (overlayOpacity == 0.65) clearInterval(interval);
            overlay.style.opacity = 0.01 * iteration;
            iteration++;
        }, 25);
    }

    update(timeInSeconds) {
        if (!this._target) return;

        // update the current state (FSM)
        if (!this._isOnGround() && this._stateMachine.currentState.name != 'falling')
            this._makeCharacterFall();
        // normal mode of updating the FSM
        else this._stateMachine.update(timeInSeconds, this.input);

        // adding frame dependent frame decceleration to the velocity
        // decceleration obviously depends on the velocity
        this._frameDecceleration.set(
            this._velocity.x * this._decceleration.x,
            this._velocity.y * this._decceleration.y,
            this._velocity.z * this._decceleration.z
        );
        this._frameDecceleration.multiplyScalar(timeInSeconds);
        this._frameDecceleration.z =
            Math.sign(this._frameDecceleration.z) *
            Math.min(Math.abs(this._frameDecceleration.z), Math.abs(this._velocity.z));

        this._velocity.add(this._frameDecceleration);

        // adding frame dependent frame acceleration to the velocity
        // character move speed
        if (this.input.keys.shift) this._acceleration.multiplyScalar(5.0);
        if (this.input.keys.forward) this._velocity.z += this._acceleration.z * timeInSeconds;
        if (this.input.keys.backward) this._velocity.z -= this._acceleration.z * timeInSeconds;
        if (this.input.keys.shift) this._acceleration.multiplyScalar(0.2);

        // gravity
        if (this._stateMachine.currentState.name == 'falling')
            this._velocity.y -= this._acceleration.y * timeInSeconds;

        // character rotation
        this._rotation.copy(this._target.quaternion); // sets this._rotation to current rotation

        if (this.input.keys.left || this.input.keys.right) {
            this._rotationQuaternion.setFromAxisAngle(
                this._rotationAxis,
                Math.PI * timeInSeconds * this._acceleration.x * (this.input.keys.left ? 1 : -1)
            );
            this._rotation.multiply(this._rotationQuaternion);
        }

        this._target.quaternion.copy(this._rotation); // inject new rotation into character

        // apply rotation and velocity to 3 different 3d vectors to then update the position
        this._sideways.set(1, 0, 0); // THREE.Vector3
        this._sideways.applyQuaternion(this._target.quaternion);
        this._sideways.normalize();

        this._downward.set(0, 1, 0); // THREE.Vector3
        this._downward.applyQuaternion(this._target.quaternion);
        this._downward.normalize();

        this._forward.set(0, 0, 1); // THREE.Vector3
        this._forward.applyQuaternion(this._target.quaternion);
        this._forward.normalize();

        this._sideways.multiplyScalar(this._velocity.x * timeInSeconds);
        this._forward.multiplyScalar(this._velocity.z * timeInSeconds);
        this._downward.multiplyScalar(this._velocity.y * timeInSeconds);

        this._target.position.add(this._forward); // update the position and rotation of the character
        this._target.position.add(this._sideways);
        this._target.position.add(this._downward);

        this._position.copy(this._target.position.clone().sub(this._downward)); // update the camera position

        // update character model's animation
        if (this._mixer) this._mixer.update(timeInSeconds);
    }
}

export default CharacterController;
