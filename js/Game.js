import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

import CharacterController from './CharacterController.js';
import ThirdPersonCamera from './ThirdPersonCamera.js';
import EnvController from './EnvController.js';


const canvas = document.querySelector('#c');

class Game {
    constructor(customLoader) {
        this._customLoader = customLoader;
        this._Initialize();
    }

    _Initialize() {
        this._threejs = new THREE.WebGLRenderer({canvas, antialias: true, logarithmicDepthBuffer: true});
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(canvas.clientWidth, canvas.clientHeight);

        this._scene = new THREE.Scene();

        {
            const fov = 60;
            const aspect = canvas.clientWidth / canvas.clientHeight;
            const near = 0.1;
            const far = 3000;
            this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

            this._cameraControl = new OrbitControls(this._camera, canvas);
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

        const texture = this._customLoader._texture;
        texture.encoding = THREE.sRGBEncoding;
        this._scene.background = texture;

        this._mixers = [];
        this._previousRAF = null;

        this._InitCharacter();
        this._InitEnv();
        this._RAF();
    }

    _InitCharacter() {
        this._controls = new CharacterController({
            camera: this._camera,
            scene: this._scene,
            cameraControl: this._cameraControl,
            customLoader: this._customLoader
        });

        this._thirdPersonCamera = new ThirdPersonCamera({
            camera: this._camera,
            target: this._controls
        });
    }

    _InitEnv() {
        this._environment = new EnvController({
            scene: this._scene,
            customLoader: this._customLoader,
            character: this._controls
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
            this._Step(t - this._previousRAF); //on each frame, update CharacterController
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

export default Game;