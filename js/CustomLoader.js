import * as THREE from "../node_modules/three/build/three.module.js";
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from '../node_modules/three/examples/jsm/loaders/FBXLoader.js';

import Game from './Game.js';


const progressBarElem = document.querySelector('.progressbar');
const progressTitle = document.querySelector('.progressTitle');
const loadingElem = document.querySelector('#loading');

class CustomLoader {
    constructor() {
        this._cubeTextureLoader = new THREE.CubeTextureLoader();
        this._textureFiles = [
            '../resources/clouds1/clouds1_east.bmp',
            '../resources/clouds1/clouds1_west.bmp',
            '../resources/clouds1/clouds1_up.bmp',
            '../resources/clouds1/clouds1_down.bmp',
            '../resources/clouds1/clouds1_north.bmp',
            '../resources/clouds1/clouds1_south.bmp',
        ];

        this._envModelsManager = new THREE.LoadingManager();
        this._envModelsLoader = new GLTFLoader(this._envModelsManager);
        this._envModels = { //model (gltf) is then added
            animated: {
                knight: { url: '../resources/blender_models/characters/knight/KnightCharacter.glb'},
                treasureChest: { url: '../resources/blender_models/treasure-chest/scene.gltf'}
            },
            static: {
                platform: { url: '../resources/blender_models/platform/desert/scene.gltf'},
                smallPlatform: { url: '../resources/blender_models/platform/small/smallPlatform.glb'},
                iceWorld: { url: '../resources/blender_models/iceWorld/ice.glb'},
                bridge: { url: '../resources/blender_models/iceWorld/bridge.glb'},
                trees: { url: '../resources/blender_models/forest/trees/trees.glb'},
                foliage: { url: '../resources/blender_models/forest/foliage/foliage.glb'},
                arch: { url: '../resources/blender_models/forest/arch/arch.glb'},
                ship: { url: '../resources/blender_models/ship/ship.glb'}
            }
        };

        this._characterModelManager = new THREE.LoadingManager();
        this._characterLoader = new FBXLoader(this._characterModelManager);
        this._characterModel = {
            Megan: {
                url:'../resources/blender_models/characters/megan/megan.fbx', //model (fbx) is then added
                gender: 'female'
            },
            Brian: {
                url:'../resources/blender_models/characters/brian/brian.fbx',
                gender: 'male'
            }
        }

        this._characterAnimationsManager = new THREE.LoadingManager();
        this._charAnimationsLoader = new FBXLoader(this._characterAnimationsManager);
        this._charAnimations = {
            walk:    { url: '../resources/blender_models/characters/megan/animations/walk.fbx' }, //anim is then added
            walkingBackwards:    { url: '../resources/blender_models/characters/megan/animations/walkingBackwards.fbx' },
            run:  { url: '../resources/blender_models/characters/megan/animations/run.fbx' },
            idle:    { url: '../resources/blender_models/characters/megan/animations/idle.fbx' },
            openingALid:  { url: '../resources/blender_models/characters/megan/animations/openingALid.fbx' },
            closingALid:  { url: '../resources/blender_models/characters/megan/animations/closingALid.fbx' },
            falling:  { url: '../resources/blender_models/characters/megan/animations/falling.fbx' }
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

        Object.values(this._envModels).forEach((m, idx) => {
            const type = idx == 0 ? 'animated' : 'static';
            for (let model in m) {
                this._envModelsLoader.load(this._envModels[type][model].url, gltf => {
                    this._envModels[type][model].gltf = gltf;
                });
            }
        });
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
            this._LaunchGame();
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
    _LaunchGame() {
        let _APP = new Game(this); //game launch
        window.addEventListener('resize', _APP._OnWindowResize.bind(_APP));
    }
}

export default CustomLoader;