import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {SkeletonUtils} from './node_modules/three/examples/jsm/utils/SkeletonUtils.js';

//Only basic features so far, would need to start the Entity Component System then

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const fov = 60;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 20, 40);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    function addLight(...pos) {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...pos);
        scene.add(light);
        scene.add(light.target);
    }
    addLight(5, 5, 2);
    addLight(-5, 5, 5);

    const manager = new THREE.LoadingManager();
    manager.onLoad = init;

    const progressBarElem = document.querySelector('.progressbar');

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        const progress = itemsLoaded / itemsTotal;
        progressBarElem.style.transform = `scaleX(${progress})`;
    };

    //the gltf and animations are then added to each model
    const models = {
        pig:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pig.gltf' },
        cow:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Cow.gltf' },
        llama:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Llama.gltf' },
        pug:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pug.gltf' },
        sheep:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Sheep.gltf' },
        zebra:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Zebra.gltf' },
        horse:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Horse.gltf' },
        knight: { url: './blender_models/characters/knight/KnightCharacter.glb' },
        rain: { url: './blender_models/rain/scene.gltf' }
    };
    {
        const gltfLoader = new GLTFLoader(manager);
        for (const model of Object.values(models)) {
            gltfLoader.load(model.url, (gltf) => {
                model.gltf = gltf;
            });
        }
    }

    const mixerInfos = [];

    function init() {
        // hide the loading bar
        const loadingElem = document.querySelector('#loading');
        loadingElem.style.display = 'none';

        Object.values(models).forEach((model, ndx) => {
            const clonedScene = SkeletonUtils.clone(model.gltf.scene);
            const root = new THREE.Object3D();
            root.add(clonedScene);
            scene.add(root);
            root.position.x = (ndx - 3) * 3;

            const mixer = new THREE.AnimationMixer(clonedScene);
            const actions = Object.values(model.gltf.animations).map((clip) => { //map through each animation
                return mixer.clipAction(clip); //AnimationAction
            });
            const mixerInfo = {
                mixer,
                actions,
                actionNdx: -1, //so we can play the action 0 on first render
            };
            mixerInfos.push(mixerInfo);
            playNextAction(mixerInfo);
        });

        function playNextAction(mixerInfo) {
            const {actions, actionNdx} = mixerInfo;
            const nextActionNdx = actionNdx + 1;
            mixerInfo.actionNdx = nextActionNdx;
            actions.forEach((action, ndx) => {
                const enabled = ndx === nextActionNdx;
                action.enabled = enabled;
                if (enabled) action.play();
            });
        }

        window.addEventListener('keydown', (e) => {
            const mixerInfo = mixerInfos[parseInt(e.key) - 1];
            if (!mixerInfo) return;
            playNextAction(mixerInfo);
        });
    }

    let then = 0;
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then; //time since the last render
        then = now;

        for (const {mixer} of mixerInfos) { //destructuring mixerInfo
            mixer.update(deltaTime);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
