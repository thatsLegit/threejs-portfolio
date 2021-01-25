import * as THREE from "three";
import {GLTFLoader} from '../../utils/GLTFLoader';
import {FBXLoader} from '../../utils/FBXLoader';

import CharacterSelection from '../../components/CharacterSelectionScene';
import Game from '../../components/Game';


const progressBarElem = document.querySelector('.progressbar');
const progressTitle = document.querySelector('.progressTitle');
const loadingElem = document.querySelector('#loading');

const controlsContainer = document.querySelector('#controls-container');
const characterSelection = document.querySelector('#character-selection');
const canvas = document.querySelector('#c');

const questsContainer = document.querySelector('#quests-container');

class CustomLoader {
    constructor() {
        this._bgTextureLoader = new THREE.CubeTextureLoader();
        this._bgTextureFiles = [
            '../resources/clouds1/clouds1_east.bmp',
            '../resources/clouds1/clouds1_west.bmp',
            '../resources/clouds1/clouds1_up.bmp',
            '../resources/clouds1/clouds1_down.bmp',
            '../resources/clouds1/clouds1_north.bmp',
            '../resources/clouds1/clouds1_south.bmp',
        ];

        this._magicCubeManager = new THREE.LoadingManager();
        this._magicCubeTextureLoader = new THREE.TextureLoader(this._magicCubeManager);
        this._magicCubeTexture = {
            interrogation: {url: '../resources/cube_textures/interrogation.png'}, //texture is loader here thereafter
            aboutMe: {url: '../resources/cube_textures/aboutMe.png'},
            projects: {url: '../resources/cube_textures/projects.png'},
            cv: {url: '../resources/cube_textures/cv.png'},
            skills: {url: '../resources/cube_textures/skills.png'},
            hireMe: {url: '../resources/cube_textures/hireMe.png'},
            smallGames: {url: '../resources/cube_textures/smallGames.png'}
        };

        this._envModelsManager = new THREE.LoadingManager();
        this._envModelsLoader = new GLTFLoader(this._envModelsManager);
        this._envModels = { //model (gltf) is then added
            animated: {
                treasureChest: { url: '../resources/blender_models/treasure-chest/treasureChest.glb'}
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
            megan: {
                url:'../resources/blender_models/characters/megan/megan.fbx', //model (fbx) is then added
                gender: 'female'
            },
            brian: {
                url:'../resources/blender_models/characters/brian/brian.fbx',
                gender: 'male'
            }
        }

        this._characterAnimationsManager = new THREE.LoadingManager();
        this._charAnimationsLoader = new FBXLoader(this._characterAnimationsManager);
        this._charAnimations = {
            megan: {
                walk:    { url: '../resources/blender_models/characters/megan/animations/walk.fbx' }, //anim is then added
                walkingBackwards:    { url: '../resources/blender_models/characters/megan/animations/walkingBackwards.fbx' },
                run:  { url: '../resources/blender_models/characters/megan/animations/run.fbx' },
                idle:    { url: '../resources/blender_models/characters/megan/animations/idle.fbx' },
                openingALid:  { url: '../resources/blender_models/characters/megan/animations/openingALid.fbx' },
                closingALid:  { url: '../resources/blender_models/characters/megan/animations/closingALid.fbx' },
                falling:  { url: '../resources/blender_models/characters/megan/animations/falling.fbx' }
            },
            brian: {
                walk:    { url: '../resources/blender_models/characters/brian/animations/walk.fbx' }, //anim is then added
                walkingBackwards:    { url: '../resources/blender_models/characters/brian/animations/walkingBackwards.fbx' },
                run:  { url: '../resources/blender_models/characters/brian/animations/run.fbx' },
                idle:    { url: '../resources/blender_models/characters/brian/animations/idle.fbx' },
                openingALid:  { url: '../resources/blender_models/characters/brian/animations/openingALid.fbx' },
                closingALid:  { url: '../resources/blender_models/characters/brian/animations/closingALid.fbx' },
                falling:  { url: '../resources/blender_models/characters/brian/animations/falling.fbx' }
            }
        }
    }

    _OnProgress(url, itemsLoaded, itemsTotal) {
        const progress = itemsLoaded / itemsTotal;
        progressBarElem.style.transform = `scaleX(${progress})`;
    };
    _startLoading() {this._LoadBgTexture()};

    _LoadBgTexture() {
        loadingElem.style.display = 'flex';
        progressTitle.textContent = "Loading background...";
        this._OnProgress(null, 0, 1); //no progress callback on TextureLoader so we do it manually
        this._bgTexture = this._bgTextureLoader.load(this._bgTextureFiles, () => {
            this._OnProgress(null, 1, 1);
            this._LoadCubeTexture.call(this);
        });
    }
    _LoadCubeTexture() {
        this._magicCubeManager.onStart = () => {
            progressTitle.textContent = "Loading magic cube textures...";
            this._OnProgress(null, 0, 1); 
        };
        this._magicCubeManager.onLoad = this._LoadEnvModels.call(this);
        this._magicCubeManager.onProgress = this._OnProgress(null, 1, 1);
        this._magicCubeManager.onError = () => {progressTitle.textContent = "Oops, cube textures coudln't have been loaded :/. Try later."};
        Object.values(this._magicCubeTexture).forEach(obj => { 
            this._magicCubeTextureLoader.load(obj.url, load => {
                obj.texture = load;
            });
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
        this._characterModelManager.onLoad = () => {
            loadingElem.style.display = 'none';
            characterSelection.style.display = 'flex';
            this._LaunchCharacterSelection();
        };
        this._characterModelManager.onProgress = this._OnProgress;
        this._characterModelManager.onError = () => {progressTitle.textContent = "Oops, character model coudln't have been loaded :/. Try later."};

        for (let modelName in this._characterModel) {
            this._characterLoader.load(
                this._characterModel[modelName].url, 
                fbx => {this._characterModel[modelName].fbx = fbx}
            );
        }
    }
    _LoadCharacterAnimations(charName) {
        this._characterAnimationsManager.onStart = () => {
            characterSelection.style.display = 'none';
            loadingElem.style.display = 'flex';
            progressTitle.textContent = "Loading character animations..."
        };
        this._characterAnimationsManager.onLoad = () => {
            loadingElem.style.display = 'none';
            controlsContainer.style.display = 'block';
            questsContainer.style.display = 'block';
            canvas.style.display = 'block';
            this._LaunchGame(charName);
        };
        this._characterAnimationsManager.onProgress = this._OnProgress;
        this._characterAnimationsManager.onError = () => {progressTitle.textContent = "Oops, character animations coudln't have been loaded :/. Try later."};

        for (let animName in this._charAnimations[charName]) {
            this._charAnimationsLoader.load(
                this._charAnimations[charName][animName].url, 
                a => this._charAnimations[charName][animName].anim = a
            );
        }
    }
    _LaunchCharacterSelection() {
        let _SELECTION = new CharacterSelection(this); //character selection launch
        window.addEventListener('resize', _SELECTION._OnWindowResize.bind(_SELECTION));
    }
    _LaunchGame(charName) {
        let _APP = new Game(this, charName); //character selection launch
        window.addEventListener('resize', _APP._OnWindowResize.bind(_APP));
    }
}

export default CustomLoader;