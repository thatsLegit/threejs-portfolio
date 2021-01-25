import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "../utils/OrbitControls";

import CharacterController from '../controllers/character/CharacterController';
import ThirdPersonCamera from '../cameras/ThirdPersonCamera';
import EnvController from '../controllers/environment/EnvController';
import QuestController from '../controllers/quests/QuestController';
import MagicCube from '../components/magicCube';


const canvas = document.querySelector('#c');

const stats = new Stats();
stats.showPanel(0); 
document.body.appendChild( stats.dom );

class Game {
    constructor(customLoader, charName) {
        this._customLoader = customLoader;
        this._charName = charName;
        this._ground = [];
        this._Initialize();
    }

    _Initialize() {
        this._threejs = new THREE.WebGLRenderer({canvas, logarithmicDepthBuffer: true});
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio); //high: 1, normal: 1.5, low: 2
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

        const bgTexture = this._customLoader._bgTexture;
        bgTexture.encoding = THREE.sRGBEncoding;
        this._scene.background = bgTexture;

        {
            //let's make triangles, planes and sphere to define the walkable surface
            {
                const plane = new THREE.Mesh(
                    new THREE.PlaneGeometry(740, 600),
                    new THREE.MeshStandardMaterial({color: 0x808080}));
                plane.rotation.x = -Math.PI / 2;
                const box = new THREE.Box3().setFromObject(plane);
                this._ground.push(box);
            }
            {
                const plane = new THREE.Mesh(
                    new THREE.PlaneGeometry(115, 800),
                    new THREE.MeshStandardMaterial({color: 0x808080, side: THREE.DoubleSide}));
                plane.rotation.x = -Math.PI / 2;
                plane.position.set(30, 3, 800);
                const box = new THREE.Box3().setFromObject(plane);
                this._ground.push(box);
            }
            {
                const plane = new THREE.Mesh(
                    new THREE.PlaneGeometry(120, 375),
                    new THREE.MeshStandardMaterial({color: 0x808080, side: THREE.DoubleSide}));
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
                let v1 = new THREE.Vector3(-370, 0, 300); //haut
                let v2 = new THREE.Vector3(-500, 0, 0);
                let v3 = new THREE.Vector3(-370, 0, -300);
                let triangle = new THREE.Triangle( v1, v2, v3 );
                this._ground.push(triangle);
            }
            {
                let v1 = new THREE.Vector3(-370, 0, -300); //gauche
                let v2 = new THREE.Vector3(0, 0, -400);
                let v3 = new THREE.Vector3(370, 0, -300);
                let triangle = new THREE.Triangle( v1, v2, v3 );
                this._ground.push(triangle);
            }
            {
                let v1 = new THREE.Vector3(370, 0, -300); //bas
                let v2 = new THREE.Vector3(500, 0, 0);
                let v3 = new THREE.Vector3(370, 0, 300);
                let triangle = new THREE.Triangle( v1, v2, v3 );
                this._ground.push(triangle);
            } 
            {
                let v1 = new THREE.Vector3(-370, 0, 300); //droite
                let v2 = new THREE.Vector3(0, 0, 400);
                let v3 = new THREE.Vector3(370, 0, 300);
                let triangle = new THREE.Triangle( v1, v2, v3 );
                this._ground.push(triangle);
            }
        }

        //pressing space should make the cube appear/flip sides
        let OnKeyDown = e => {
            if(this._environment._treasure.position.distanceToSquared(this._controls.Position) < 3000) {
                this._magicCube = new MagicCube({
                    position: new THREE.Vector3(40, 60, -720),
                    scene: this._scene,
                    camera: this._camera,
                    textures: this._customLoader._magicCubeTexture
                });

                this._quests._params.magicCube = this._magicCube; //updates undefined value for magicCube in quests
                document.removeEventListener('keyup', OnKeyDown); //so it's not possible de invoke multiple cubes

                let nextOnKeyDown = e => {
                    if(e.key == ' ' && this._environment._treasure.position.distanceToSquared(this._controls.Position) < 3000) {
                        this._magicCube._transiting = true;
                        document.removeEventListener('keydown', nextOnKeyDown);
                    }
                }

                nextOnKeyDown = nextOnKeyDown.bind(this);
                document.addEventListener('keydown', nextOnKeyDown);
            }  
        };
        OnKeyDown = OnKeyDown.bind(this);
        document.addEventListener('keyup', OnKeyDown);

        this._mixers = [];
        this._previousRAF = null;

        this._InitCharacter();
        this._InitEnv();
        this._InitQuest();
        this._RAF();
    }

    _InitCharacter() {
        this._controls = new CharacterController({
            charName : this._charName,
            camera: this._camera,
            scene: this._scene,
            cameraControl: this._cameraControl,
            customLoader: this._customLoader,
            ground: this._ground
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
            character: this._controls,
        });
    }
    _InitQuest() {
        this._quests = new QuestController({
            environment: this._environment,
            character: this._controls,
            magicCube: this._magicCube
        });
    }
    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }
    _RAF() {
        requestAnimationFrame((t) => {
            stats.begin();stats.end();
            if (this._previousRAF === null) this._previousRAF = t;

            this._Step(t - this._previousRAF); //on each frame, update CharacterController
            this._quests._Update(t); //on each frame, update QuestController
            this._previousRAF = t;

            this._RAF();
            this._threejs.render(this._scene, this._camera);
        });
    }
    _Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;

        //update character position/orientation/animation
        this._controls.Update(timeElapsedS);
        //update camera position/lookAt
        if(!this?._cameraControl?.enabled) this._thirdPersonCamera.Update(timeElapsedS);
        //update "other models"
        // if (this._mixers) this._mixers.map(m => m.update(timeElapsedS));
        //update the treasure animation
        if(!this._environment._treasureOpened) this._environment._Update(timeElapsedS);
        //update the magicCube rotation if the treasure chest is opened
        if(this?._magicCube?._transiting) this._magicCube._Transition(); 
        if(this?._magicCube?._opened) this._magicCube._Update(); 
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