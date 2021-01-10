import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from './node_modules/three/examples/jsm/loaders/FBXLoader.js';
import {SkeletonUtils} from './node_modules/three/examples/jsm/utils/SkeletonUtils.js';

//todo:
//home screen with character choose
//add a sound to the game
//collision detection
//environment
//the treasure chest
//the content of the magic cube.

const canvas = document.querySelector('#c');
const progressBarElem = document.querySelector('.progressbar');
const progressTitle = document.querySelector('.progressTitle');
const loadingElem = document.querySelector('#loading');

class CustomLoader {
    constructor() {
        this._cubeTextureLoader = new THREE.CubeTextureLoader();
        this._textureFiles = [
            './clouds1/clouds1_east.bmp',
            './clouds1/clouds1_west.bmp',
            './clouds1/clouds1_up.bmp',
            './clouds1/clouds1_down.bmp',
            './clouds1/clouds1_north.bmp',
            './clouds1/clouds1_south.bmp',
        ];

        this._envModelsManager = new THREE.LoadingManager();
        this._envModelsLoader = new GLTFLoader(this._envModelsManager);
        this._envAnimatedModels = {
            knight: { 
                url: './blender_models/characters/knight/KnightCharacter.glb', //model (gltf) is then added
                animIdx: 3 
            },
            rain: { 
                url: './blender_models/rain/scene.gltf',
                animIdx: 0
            }
        };

        this._characterModelManager = new THREE.LoadingManager();
        this._characterLoader = new FBXLoader(this._characterModelManager);
        this._characterModel = {
            Megan: {
                url:'./blender_models/characters/megan/megan.fbx', //model (fbx) is then added
                gender: 'female'
            },
            Brian: {
                url:'./blender_models/characters/brian/brian.fbx',
                gender: 'male'
            }
        }

        this._characterAnimationsManager = new THREE.LoadingManager();
        this._charAnimationsLoader = new FBXLoader(this._characterAnimationsManager);
        this._charAnimations = {
            walk:    { url: './blender_models/characters/megan/animations/walk.fbx' }, //anim is then added
            walkingBackwards:    { url: './blender_models/characters/megan/animations/walkingBackwards.fbx' },
            run:  { url: './blender_models/characters/megan/animations/run.fbx' },
            idle:    { url: './blender_models/characters/megan/animations/idle.fbx' },
            openingALid:  { url: './blender_models/characters/megan/animations/openingALid.fbx' },
            closingALid:  { url: './blender_models/characters/megan/animations/closingALid.fbx' }
        }
    }

    _OnProgress(url, itemsLoaded, itemsTotal) {
        const progress = itemsLoaded / itemsTotal;
        progressBarElem.style.transform = `scaleX(${progress})`;
    };
    _startLoading() {this._LoadTexture()};

    _LoadTexture() {
        this._OnProgress(null, 0, 1); //no progress callback on TextureLoader so we do it manually
        progressTitle.textContent = "Loading texture...";
        this._texture = this._cubeTextureLoader.load(this._textureFiles, () => {
            this._OnProgress(null, 1, 1);
            this._LoadEnvModels.call(this);
        });

    }
    _LoadEnvModels() {
        this._envModelsManager.onStart = () => {progressTitle.textContent = "Loading environment..."};
        this._envModelsManager.onLoad = this._LoadCharacterModel.bind(this);
        this._envModelsManager.onProgress = this._OnProgress;
        this._envModelsManager.onError = () => {progressTitle.textContent = "Oops, environment models coudln't have been loaded :/. Try later."};

        for (let model of Object.values(this._envAnimatedModels)) {
            this._envModelsLoader.load(model.url, gltf => {
                model.gltf = gltf;
            });
        }
    }
    _LoadCharacterModel() {
        this._characterModelManager.onStart = () => {progressTitle.textContent = "Loading character..."};
        this._characterModelManager.onLoad = this._LoadCharacterAnimations.bind(this);
        this._characterModelManager.onProgress = this._OnProgress;
        this._characterModelManager.onError = () => {progressTitle.textContent = "Oops, character model coudln't have been loaded :/. Try later."};

        this._characterLoader.load(this._characterModel.Megan.url, fbx => {this._characterModel.Megan.fbx = fbx});
    }
    _LoadCharacterAnimations() {
        this._characterAnimationsManager.onStart = () => {progressTitle.textContent = "Loading character animations..."};
        this._characterAnimationsManager.onLoad = () => {
            loadingElem.style.display = 'none';
            let _APP = new Main(); //game launch
            window.addEventListener('resize', _APP._OnWindowResize.bind(_APP));
        };
        this._characterAnimationsManager.onProgress = this._OnProgress;
        this._characterAnimationsManager.onError = () => {progressTitle.textContent = "Oops, character animations coudln't have been loaded :/. Try later."};

        for (let animName in this._charAnimations) {
            this._charAnimationsLoader.load(
                this._charAnimations[animName].url, 
                a => this._charAnimations[animName].anim = a
            );
        }
    }
}

//represents a single animated character
class BasicCharacterControllerProxy {
    constructor(animations) {
        this._animations = animations;
    }

    get animations() {
        return this._animations;
    }
};

class BasicCharacterController {
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
        this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
        this._velocity = new THREE.Vector3(0, 0, 0);
        this._position = new THREE.Vector3();

        this._animations = {};
        this._input = new BasicCharacterControllerInput();
        this._stateMachine = new CharacterFSM(new BasicCharacterControllerProxy(this._animations));

        this._PrepareModels();
    }
  
    _PrepareModels() {
        //model
        const model = customLoader._characterModel.Megan.fbx;
        model.scale.setScalar(0.1);
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
    }
  
    Update(timeInSeconds) { //called on each frame
        if (!this._target) return;
    
        this._stateMachine.Update(timeInSeconds, this._input); //update the current state (FSM)

        if(this._input._keys.freeCamera) {
            if(this._params.cameraControl.enabled == false) {
                this._params.cameraControl.target.set(
                    this._position.x, 
                    this._position.y, 
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
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }
        if (this._input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
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


//responsible for listening and recording key press
class BasicCharacterControllerInput {
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
            case ' ': // SPACE
                this._keys.space = true;
                break;
            case 'Shift': // SHIFT
                this._keys.shift = true;
                break;
        }
    }

    _onKeyUp(event) {
        switch(event.key) {
            case 'w': // w
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
            case ' ': // SPACE
            this._keys.space = false;
            break;
            case 'Shift': // SHIFT
            this._keys.shift = false;
            break;
        }
    }
};

class FiniteStateMachine {
    constructor() {
        this._states = {};
        this._currentState = null;
    }

    _AddState(name, type) {
        this._states[name] = type;
    }

    SetState(name) {
        const prevState = this._currentState;

        if (prevState) {
            if (prevState.Name == name) return;
            prevState.Exit();
        }

        const state = new this._states[name](this);

        this._currentState = state;
        state.Enter(prevState);
    }

    Update(timeElapsed, input) {
        if (this._currentState) this._currentState.Update(timeElapsed, input);
    }
};

class CharacterFSM extends FiniteStateMachine {
    constructor(proxy) {
        super();
        this._proxy = proxy;
        this._Init();
    }

    _Init() {
        this._AddState('idle', IdleState);
        this._AddState('walk', WalkState);
        this._AddState('walkingBackwards', WalkBackwardsState);
        this._AddState('run', RunState);
        this._AddState('openingALid', OpenLidState);
        this._AddState('closingALid', CloseLidState);
    }
};


class State {
    constructor(parent) {
        this._parent = parent;
    }

    Enter() {}
    Exit() {}
    Update() {}
};

class OpenLidState extends State {
    constructor(parent) {
        super(parent);
        this._FinishedCallback = () => this._Finished();
    }

    get Name() {
        return 'openingALid';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['openingALid'].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.reset();  
            curAction.setLoop(THREE.LoopOnce, 1);
            curAction.clampWhenFinished = true;
            curAction.crossFadeFrom(prevAction, 0.2, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('idle');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['openingALid'].action;
        action.getMixer().removeEventListener('finished', this._CleanupCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(_) {}
};

class CloseLidState extends State {
    constructor(parent) {
        super(parent);
        this._FinishedCallback = () => this._Finished();
    }

    get Name() {
        return 'closingALid';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['closingALid'].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.reset();  
            curAction.setLoop(THREE.LoopOnce, 1);
            curAction.clampWhenFinished = true;
            curAction.crossFadeFrom(prevAction, 0.2, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('idle');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['closingALid'].action;
        action.getMixer().removeEventListener('finished', this._CleanupCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(_) {}
};

class WalkState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'walk';
    }
  
    Enter(prevState) {
        const curAction = this._parent._proxy._animations['walk'].action;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.enabled = true;

            if (prevState.Name == 'run' || prevState.Name == 'walkingBackwards') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }
  
    Exit() {}
  
    Update(timeElapsed, input) {
        if (input._keys.forward) {
            if (input._keys.shift) this._parent.SetState('run');
            return;
        }
        this._parent.SetState('idle');
    }
};

class WalkBackwardsState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'walkingBackwards';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['walkingBackwards'].action;

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.enabled = true;

            if (prevState.Name == 'walk' || prevState.Name == 'run') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    Exit() {}

    Update(timeElapsed, input) {
        if (input._keys.forward) this._parent.SetState('walk');
        else if (input._keys.backward) return;
        else this._parent.SetState('idle');
    }
};

class RunState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'run';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['run'].action;

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.enabled = true;

            if (prevState.Name == 'walk') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    Exit() {}

    Update(timeElapsed, input) {
        if (input._keys.forward) {
            if(!input._keys.shift) this._parent.SetState('walk');
            return;
        }
        this._parent.SetState('idle');
    }
};

class IdleState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'idle';
    }

    Enter(prevState) {
        const idleAction = this._parent._proxy._animations['idle'].action;

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.5, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    }

    Exit() {}

    Update(_, input) {
        if (input._keys.forward) {this._parent.SetState('walk');return;}
        if (input._keys.space) {this._parent.SetState('openingALid');return;} //only dealing with opening for now
        if (input._keys.backward) {this._parent.SetState('walkingBackwards');return;}
    }
};


class ThirdPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = params.camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
    }
  
    _CalculateIdealOffset() {
        const idealOffset = new THREE.Vector3(-15, 20, -30);
        idealOffset.applyQuaternion(this._params.target.Rotation);
        idealOffset.add(this._params.target.Position);
        return idealOffset;
    }
  
    _CalculateIdealLookat() {
        const idealLookat = new THREE.Vector3(0, 10, 50);
        idealLookat.applyQuaternion(this._params.target.Rotation);
        idealLookat.add(this._params.target.Position);
        return idealLookat;
    }
  
    Update(timeElapsed) {
        const idealOffset = this._CalculateIdealOffset();
        const idealLookat = this._CalculateIdealLookat();

        // const t = 0.05;
        // const t = 4.0 * timeElapsed;
        const t = 1.0 - Math.pow(0.001, timeElapsed);

        this._currentPosition.lerp(idealOffset, t);
        this._currentLookat.lerp(idealLookat, t);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }
}


class Main {
    constructor() {
        this._Initialize();
    }

    _Initialize() {
        this._threejs = new THREE.WebGLRenderer({canvas, antialias: true});
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(canvas.clientWidth, canvas.clientHeight);

        this._scene = new THREE.Scene();

        {
            const fov = 60;
            const aspect = canvas.clientWidth / canvas.clientHeight;
            const near = 1.0;
            const far = 1000.0;
            this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this._camera.position.set(25, 10, 25);

            this._cameraControl = new OrbitControls(this._camera, canvas);
            this._cameraControl.target.set(0, 5, 0);
            this._cameraControl.update();
            this._cameraControl.enabled = false;
        }
        {
            let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
            light.position.set(200, 100, 100);
            light.target.position.set(0, 0, 0);
            light.castShadow = true;
            light.shadow.bias = -0.001;
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;
            light.shadow.camera.near = 0.1;
            light.shadow.camera.far = 500.0;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 500.0;
            light.shadow.camera.left = 100;
            light.shadow.camera.right = -100;
            light.shadow.camera.top = 100;
            light.shadow.camera.bottom = -100;
            this._scene.add(light);
        }
        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 0.5;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            this._scene.add(light);
        }

        const texture = customLoader._texture;
        texture.encoding = THREE.sRGBEncoding;
        this._scene.background = texture;

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0x808080,
                }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);

        this._mixers = [];
        this._previousRAF = null;

        this._PlayEnvAnimatedModels();
        this._LoadAnimatedModel(); //link to character controller
        this._RAF();
    }

    _LoadAnimatedModel() {
        this._controls = new BasicCharacterController({
            camera: this._camera,
            scene: this._scene,
            cameraControl: this._cameraControl
        });

        this._thirdPersonCamera = new ThirdPersonCamera({
            camera: this._camera,
            target: this._controls
        });
    }

    _PlayEnvAnimatedModels() {
        Object.values(customLoader._envAnimatedModels).forEach((model, ndx) => {
            const clonedScene = SkeletonUtils.clone(model.gltf.scene);
            const root = new THREE.Object3D();
            root.add(clonedScene);
            this._scene.add(root);
            root.position.x = (ndx - 3) * 3;

            const mixer = new THREE.AnimationMixer(clonedScene);
            this._mixers.push(mixer);
            const action = mixer.clipAction(model.gltf.animations[model.animIdx]);
            action.enabled = true;
            action.play();
        });
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame((t) => {
            if (this._previousRAF === null) this._previousRAF = t;

            this._RAF();

            this._threejs.render(this._scene, this._camera);
            this._Step(t - this._previousRAF); //on each frame, update BasicCharacterController
            this._previousRAF = t;
        });
    }

    _Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        //update "other models"
        if (this._mixers) this._mixers.map(m => m.update(timeElapsedS));
        //update character position/orientation/animation
        if (this._controls) this._controls.Update(timeElapsedS);
        //update camera position/lookAt
        if(!this?._cameraControl?.enabled) this._thirdPersonCamera.Update(timeElapsedS);
    }
}

const customLoader = new CustomLoader();
customLoader._startLoading();      