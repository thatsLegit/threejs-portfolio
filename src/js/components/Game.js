import * as THREE from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import CharacterController from '../controllers/character/CharacterController';
import ThirdPersonCamera from '../cameras/ThirdPersonCamera';
import EnvController from '../controllers/environment/EnvController';
import QuestController from '../controllers/quests/QuestController';
import MagicCube from '../components/magicCube';

const CANVAS = document.querySelector('#c');
const CONTROLS_ELEMENT = document.querySelector('#controls-container');
const QUESTS_ELEMENT = document.querySelector('#quests-container');

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

class Game {
    constructor(customLoader, params) {
        this._customLoader = customLoader;
        this._params = params;
        this._ground = [];
        window.addEventListener('resize', this._OnWindowResize.bind(this));
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
            antialias: this._params.graphics == 'high' ? true : false,
        });
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(
            this._params.graphics == 'low' ? window.devicePixelRatio / 1.5 : window.devicePixelRatio
        );
        this._threejs.setSize(CANVAS.clientWidth, CANVAS.clientHeight);

        this._scene = new THREE.Scene();

        {
            const fov = 60;
            const aspect = CANVAS.clientWidth / CANVAS.clientHeight;
            const near = 1;
            const far = 2500;
            this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

            this._cameraControl = new OrbitControls(this._camera, CANVAS);
            this._cameraControl.minDistance = 10;
            this._cameraControl.maxDistance = 500;
            this._cameraControl.update();
            this._cameraControl.enabled = false;
        }
        {
            let light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(600, 300, 300);
            light.target.position.set(0, 0, 0);
            light.castShadow = true;
            light.shadow.mapSize.width = this._params.graphics == 'high' ? 2048 : 1024;
            light.shadow.mapSize.height = this._params.graphics == 'high' ? 2048 : 1024;
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

        const bgTexture = this._customLoader._bgTexture;
        bgTexture.encoding = THREE.sRGBEncoding;
        this._scene.background = bgTexture;

        {
            //let's make triangles, planes and sphere to define the walkable surface
            {
                const plane = new THREE.Mesh(
                    new THREE.PlaneGeometry(740, 600),
                    new THREE.MeshBasicMaterial({ color: 0x808080 })
                );
                plane.rotation.x = -Math.PI / 2;
                const box = new THREE.Box3().setFromObject(plane);
                this._ground.push(box);
            }
            {
                const plane = new THREE.Mesh(
                    new THREE.PlaneGeometry(115, 800),
                    new THREE.MeshBasicMaterial({ color: 0x808080 })
                );
                plane.rotation.x = -Math.PI / 2;
                plane.position.set(30, 3, 800);
                const box = new THREE.Box3().setFromObject(plane);
                this._ground.push(box);
            }
            {
                const plane = new THREE.Mesh(
                    new THREE.PlaneGeometry(120, 375),
                    new THREE.MeshBasicMaterial({ color: 0x808080 })
                );
                plane.rotation.x = -Math.PI / 2;
                plane.position.set(40, 3, -500);
                const box = new THREE.Box3().setFromObject(plane);
                this._ground.push(box);
            }
            {
                const sphere = new THREE.Sphere(new THREE.Vector3(43, 0, -720), 54);
                this._ground.push(sphere);
            }
            // starting from the top
            {
                const v1 = new THREE.Vector3(-370, 0, 300); //haut
                const v2 = new THREE.Vector3(-500, 0, 0);
                const v3 = new THREE.Vector3(-370, 0, -300);
                const triangle = new THREE.Triangle(v1, v2, v3);
                this._ground.push(triangle);
            }
            {
                const v1 = new THREE.Vector3(-370, 0, -300); //gauche
                const v2 = new THREE.Vector3(0, 0, -400);
                const v3 = new THREE.Vector3(370, 0, -300);
                const triangle = new THREE.Triangle(v1, v2, v3);
                this._ground.push(triangle);
            }
            {
                const v1 = new THREE.Vector3(370, 0, -300); //bas
                const v2 = new THREE.Vector3(500, 0, 0);
                const v3 = new THREE.Vector3(370, 0, 300);
                const triangle = new THREE.Triangle(v1, v2, v3);
                this._ground.push(triangle);
            }
            {
                const v1 = new THREE.Vector3(-370, 0, 300); //droite
                const v2 = new THREE.Vector3(0, 0, 400);
                const v3 = new THREE.Vector3(370, 0, 300);
                const triangle = new THREE.Triangle(v1, v2, v3);
                this._ground.push(triangle);
            }
        }

        //Initializes magic cube but hides it
        this._magicCube = new MagicCube({
            position: new THREE.Vector3(40, 60, -720),
            scene: this._scene,
            camera: this._camera,
            textures: this._customLoader._magicCubeTexture,
        });

        this._magicCube._mysteryCube.visible = false;

        //pressing space should make the cube appear/flip sides
        let OnKeyDown = (e) => {
            if (
                this._environment._treasure.position.distanceToSquared(this._controls.Position) <
                3000
            ) {
                this._magicCube._mysteryCube.visible = true;

                document.removeEventListener('keyup', OnKeyDown); //so it's not possible de invoke multiple cubes

                let nextOnKeyDown = (e) => {
                    if (
                        e.key == ' ' &&
                        this._environment._treasure.position.distanceToSquared(
                            this._controls.Position
                        ) < 3000
                    ) {
                        this._magicCube._transiting = true;
                        document.removeEventListener('keydown', nextOnKeyDown);
                    }
                };

                nextOnKeyDown = nextOnKeyDown.bind(this);
                document.addEventListener('keydown', nextOnKeyDown);
            }
        };
        OnKeyDown = OnKeyDown.bind(this);
        document.addEventListener('keyup', OnKeyDown);

        this._mixers = [];

        this._InitCharacter();
        this._InitEnv();
        this._InitQuest();
        this._RAF();
    }

    _InitCharacter() {
        this._controls = new CharacterController({
            charName: this._params.charName,
            keyboardType: this._params.keyboard,
            camera: this._camera,
            scene: this._scene,
            cameraControl: this._cameraControl,
            customLoader: this._customLoader,
            ground: this._ground,
        });

        this._thirdPersonCamera = new ThirdPersonCamera({
            camera: this._camera,
            target: this._controls,
        });
    }

    _InitEnv() {
        this._environment = new EnvController({
            scene: this._scene,
            customLoader: this._customLoader,
            character: this._controls,
        });
    }

    _InitQuest() {
        this._quests = new QuestController({
            environment: this._environment,
            character: this._controls,
            magicCube: this._magicCube,
        });
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame((t) => {
            stats.begin();
            stats.end();

            this._Step(t - (this._previousRAF || 0));

            this._quests._Update(t);

            this._previousRAF = t;
            this._threejs.render(this._scene, this._camera);
            this._RAF();
        });
    }

    _Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        //update character position/orientation/animation
        this._controls.Update(timeElapsedS);
        //update camera position/lookAt
        if (!this._cameraControl.enabled) this._thirdPersonCamera.Update(timeElapsedS);
        //update the treasure animation (optional)
        // if(!this._environment._treasureOpened) this._environment._Update(timeElapsedS);
        //update the magicCube rotation if the treasure chest is opened
        if (this?._magicCube?._transiting) this._magicCube._Transition(timeElapsedS);
        if (this?._magicCube?._opened) this._magicCube._Update(timeElapsedS);
    }
}

export default Game;

//collision strategy:
// using chararcter's box3 with intersection with planes and triangles representing the surface of the island
// the box3 is defined using:

// .setFromCenterAndSize ( center : Vector3, size : Vector3 ) : this
// center, - Desired center position of the box. this._target basically with an offset to y
// size - Desired x, y and z dimensions of the box.

// Centers this box on center and sets this box's width, height and depth to the values specified
// in size

//raycasting can not be used as it uses camera and mouse clicks which doesn't really apply here
