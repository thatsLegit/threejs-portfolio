import * as THREE from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import CharacterController from '../controllers/character/CharacterController';
import ThirdPersonCamera from '../cameras/ThirdPersonCamera';
import EnvController from '../controllers/environment/EnvController';
import QuestController from '../controllers/quests/QuestController';
import MagicCubeController from '../controllers/magicCube/MagicCubeController';
import Ground from './Ground';
import CharacterControllerProxy from '../controllers/character/CharacterControllerProxy';
import EnvControllerProxy from '../controllers/environment/EnvControllerProxy';
import SoundController from '../controllers/sound/SoundController';

const CANVAS = document.querySelector('#c');
const CONTROLS_ELEMENT = document.querySelector('#controls-container');
const QUESTS_ELEMENT = document.querySelector('#quests-container');

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

class Game {
    constructor(assetLoader, charName, graphicsOption, keyboardOption) {
        this._assets = assetLoader;
        this._charName = charName;
        this._graphicsOption = graphicsOption;
        this._keyboardOption = keyboardOption;
    }

    launchScene() {
        CONTROLS_ELEMENT.style.display = 'block';
        QUESTS_ELEMENT.style.display = 'block';
        CANVAS.style.display = 'block';

        this._threejs = new THREE.WebGLRenderer({
            canvas: CANVAS,
            stencil: false,
            powerPreference: 'high-performance',
            logarithmicDepthBuffer: true,
            antialias: this._graphicsOption == 'high',
        });

        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(
            this._graphicsOption == 'low' ? window.devicePixelRatio / 1.5 : window.devicePixelRatio
        );
        this._threejs.setSize(CANVAS.clientWidth, CANVAS.clientHeight);

        this._scene = new THREE.Scene();

        {
            const fov = 60;
            const aspect = CANVAS.clientWidth / CANVAS.clientHeight;
            const near = 1;
            const far = 2500;
            this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

            // free-fly camera (orbit control), can be switched on/off
            this._cameraControl = new OrbitControls(this._camera, CANVAS);
            this._cameraControl.minDistance = 10;
            this._cameraControl.maxDistance = 500;
            this._cameraControl.update();
            this._cameraControl.enabled = false;
        }
        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(600, 300, 300);
            light.target.position.set(0, 0, 0);
            light.castShadow = true;
            light.shadow.mapSize.width = this._graphicsOption == 'high' ? 2048 : 1024;
            light.shadow.mapSize.height = this._graphicsOption == 'high' ? 2048 : 1024;
            light.shadow.camera.far = 1200;
            light.shadow.camera.near = 100;
            light.shadow.camera.left = 750;
            light.shadow.camera.right = -1000;
            light.shadow.camera.top = 250;
            light.shadow.camera.bottom = -250;
            this._scene.add(light);
            this._scene.add(light.target);
        }
        {
            const skyColor = 0xb1e1ff; // light blue
            const groundColor = 0xb97a20; // brownish orange
            const intensity = 0.5;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            this._scene.add(light);
        }

        const bgTexture = this._assets.bgTexture;
        bgTexture.encoding = THREE.sRGBEncoding;
        this._scene.background = bgTexture;

        window.addEventListener('resize', this._onWindowResize.bind(this));

        this._initCharacter();
        this._initEnv();
        this._initMagicCube();
        this._initQuest();
        this._initSound();
        this._RAF();
    }

    _initCharacter() {
        this._characterControls = new CharacterController({
            keyboardType: this._keyboardOption,
            scene: this._scene,
            characterModel: this._assets.characterModels[this._charName],
            characterAnimations: this._assets.charAnimations[this._charName],
            ground: new Ground(),
        });

        this._thirdPersonCamera = new ThirdPersonCamera({
            camera: this._camera,
            cameraControl: this._cameraControl,
            target: this._characterControls,
        });
    }

    _initEnv() {
        this._environment = new EnvController({
            scene: this._scene,
            assets: this._assets,
        });
    }

    _initMagicCube() {
        // Hides the cube at first
        this._magicCube = new MagicCubeController({
            scene: this._scene,
            camera: this._camera,
            textures: this._assets.magicCubeTexture,
            characterControlsProxy: new CharacterControllerProxy(this._characterControls),
            envProxy: new EnvControllerProxy(this._environment),
        });
    }

    _initQuest() {
        this._quests = new QuestController();
    }

    _initSound() {
        this._sound = new SoundController(this._camera);
    }

    _onWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF(previousT = 0) {
        requestAnimationFrame((t) => {
            stats.begin();
            stats.end();

            this._step((t - previousT) * 0.001);

            this._threejs.render(this._scene, this._camera);
            this._RAF(t);
        });
    }

    _step(deltaT) {
        this._characterControls.update(deltaT);
        this._thirdPersonCamera.update(deltaT);
        this._environment.update(deltaT);
        this._magicCube.update(deltaT);
    }
}

export default Game;

// Collision strategy:
// using character's box3 with intersection with planes and triangles representing the surface of the island
// the box3 is defined using:

// .setFromCenterAndSize ( center : Vector3, size : Vector3 ) : this
// center, - Desired center position of the box. this._target basically with an offset to y
// size - Desired x, y and z dimensions of the box.

// Centers this box on center and sets this box's width, height and depth to the values specified in size

// Raycasting can not be used as it uses camera and mouse clicks which doesn't really apply here
