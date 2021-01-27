import * as THREE from "three";
import {GLTFLoader} from 'utils/GLTFLoader';
import {FBXLoader} from 'utils/FBXLoader';

import CharacterSelection from 'components/CharacterSelectionScene';
import Game from 'components/Game';

const progressBarElem = document.querySelector('.progressbar');
const progressTitle = document.querySelector('.progressTitle');
const loadingElem = document.querySelector('#loading');

const paramsContainer = document.querySelector('#parameters-container');
const graphics = document.querySelector('#graphics');
const keyboard = document.querySelector('#keyboard');
const parametersvalidate = document.querySelector('#parameters-validate');

const controlsContainer = document.querySelector('#controls-container');
const forward = document.querySelector('#controls-container #forward');
const backward = document.querySelector('#controls-container #backward');
const left = document.querySelector('#controls-container #left');
const right = document.querySelector('#controls-container #right');

const characterSelection = document.querySelector('#character-selection');
const canvas = document.querySelector('#c');

const questsContainer = document.querySelector('#quests-container');

class CustomLoader {
    //Rule 1: you need a manager every time you have multiple load process on one specific resource
    //Rule 2: TextureLoader manager doesn't support the progress callback

    constructor() {
        this._bgTextureLoader = new THREE.CubeTextureLoader();
        this._bgTextureFiles = [
            './assets/clouds1/clouds1_east.bmp',
            './assets/clouds1/clouds1_west.bmp',
            './assets/clouds1/clouds1_up.bmp',
            './assets/clouds1/clouds1_down.bmp',
            './assets/clouds1/clouds1_north.bmp',
            './assets/clouds1/clouds1_south.bmp',
        ];

        this._magicCubeTextureLoader = new THREE.TextureLoader(this._magicCubeManager);
        this._magicCubeTexture = {
            interrogation: {url: './assets/cube_textures/interrogation.png'}, //texture is loader here thereafter
            aboutMe: {url: './assets/cube_textures/aboutMe.png'},
            projects: {url: './assets/cube_textures/projects.png'},
            cv: {url: './assets/cube_textures/cv.png'},
            skills: {url: './assets/cube_textures/skills.png'},
            hireMe: {url: './assets/cube_textures/hireMe.png'},
            smallGames: {url: './assets/cube_textures/smallGames.png'}
        };

        this._envModelsManager = new THREE.LoadingManager();
        this._envModelsLoader = new GLTFLoader(this._envModelsManager);
        this._envModels = { //model (gltf) is then added
            animated: {
                treasureChest: { url: './assets/blender_models/treasure-chest/treasureChest.glb'}
            },
            static: {
                platform: { url: './assets/blender_models/platform/desert/scene.gltf'},
                smallPlatform: { url: './assets/blender_models/platform/small/smallPlatform.glb'},
                iceWorld: { url: './assets/blender_models/iceWorld/ice.glb'},
                bridge: { url: './assets/blender_models/iceWorld/bridge.glb'},
                trees: { url: './assets/blender_models/forest/trees/trees.glb'},
                foliage: { url: './assets/blender_models/forest/foliage/foliage.glb'},
                arch: { url: './assets/blender_models/forest/arch/arch.glb'},
                ship: { url: './assets/blender_models/ship/ship.glb'}
            }
        };

        this._characterModelManager = new THREE.LoadingManager();
        this._characterLoader = new FBXLoader(this._characterModelManager);
        this._characterModel = {
            megan: {
                url:'./assets/blender_models/characters/megan/megan.fbx', //model (fbx) is then added
                gender: 'female'
            },
            brian: {
                url:'./assets/blender_models/characters/brian/brian.fbx',
                gender: 'male'
            }
        }

        this._characterAnimationsManager = new THREE.LoadingManager();
        this._charAnimationsLoader = new FBXLoader(this._characterAnimationsManager);
        this._charAnimations = {
            megan: {
                walk:    { url: './assets/blender_models/characters/megan/animations/walk.fbx' }, //anim is then added
                walkingBackwards:    { url: './assets/blender_models/characters/megan/animations/walkingBackwards.fbx' },
                run:  { url: './assets/blender_models/characters/megan/animations/run.fbx' },
                idle:    { url: './assets/blender_models/characters/megan/animations/idle.fbx' },
                // openingALid:  { url: './assets/blender_models/characters/megan/animations/openingALid.fbx' },
                // closingALid:  { url: './assets/blender_models/characters/megan/animations/closingALid.fbx' },
                falling:  { url: './assets/blender_models/characters/megan/animations/falling.fbx' }
            },
            brian: {
                walk:    { url: './assets/blender_models/characters/brian/animations/walk.fbx' }, //anim is then added
                walkingBackwards:    { url: './assets/blender_models/characters/brian/animations/walkingBackwards.fbx' },
                run:  { url: './assets/blender_models/characters/brian/animations/run.fbx' },
                idle:    { url: './assets/blender_models/characters/brian/animations/idle.fbx' },
                // openingALid:  { url: './assets/blender_models/characters/brian/animations/openingALid.fbx' },
                // closingALid:  { url: './assets/blender_models/characters/brian/animations/closingALid.fbx' },
                falling:  { url: './assets/blender_models/characters/brian/animations/falling.fbx' }
            }
        }

        //not even sure if it's needed but just in case to avoid any 'this' related issues
        this._startLoading = this._startLoading.bind(this);
        this._OnProgress = this._OnProgress.bind(this);
        this._LoadBgTexture = this._LoadBgTexture.bind(this);
        this._LoadCubeTexture = this._LoadCubeTexture.bind(this);
        this._LoadEnvModels = this._LoadEnvModels.bind(this);
        this._LoadCharacterModel = this._LoadCharacterModel.bind(this);
        this._LoadCharacterAnimations = this._LoadCharacterAnimations.bind(this);
        this._LaunchCharacterSelection = this._LaunchCharacterSelection.bind(this);
        this._LaunchGame = this._LaunchGame.bind(this);
    }

    _startLoading() {
        this._LoadBgTexture(); 
    };

    _OnProgress(url, itemsLoaded, itemsTotal) {
        const progress = itemsLoaded / itemsTotal;
        progressBarElem.style.transform = `scaleX(${progress})`;
    };

    _LoadBgTexture() {
        this._OnProgress(null, 0, 1); //initialize the the progress bar
        loadingElem.style.display = 'flex';
        progressTitle.textContent = "Loading background...";

        this._bgTexture = this._bgTextureLoader.load(
            this._bgTextureFiles, 
            () => this._LoadCubeTexture(),
            () => this._OnProgress(),
            () => {progressTitle.textContent = "Oops, background textures coudln't have been loaded :/. Try later."},
        );
    }
    _LoadCubeTexture() {
        this._OnProgress(null, 0, 1);
        progressTitle.textContent = "Loading magic cube textures...";
        const allTextures = Object.values(this._magicCubeTexture);
        
        allTextures.forEach((obj, idx) => { 
            this._magicCubeTextureLoader.load(
                obj.url, 
                (load) => {
                    obj.texture = load;
                    this._OnProgress(null, idx + 1, allTextures.length);
                    if(idx == allTextures.length - 1) {
                        this._LoadEnvModels();
                    }
                },
                undefined, //onprogress: no onProgress event on TextureLoader
                () => {progressTitle.textContent = "Oops, cube textures coudln't have been loaded :/. Try later."}
            );
        });
    }
    _LoadEnvModels() {
        this._envModelsManager.onStart = () => {
            this._OnProgress(null, 0, 1); 
            progressTitle.textContent = "Loading environment..."
        };
        this._envModelsManager.onLoad = this._LoadCharacterModel;
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
        this._characterModelManager.onStart = () => {
            this._OnProgress(null, 0, 1); //resets the progress bar to 0
            progressTitle.textContent = "Loading characters..."
        };
        this._characterModelManager.onLoad = () => {
            loadingElem.style.display = 'none';
            characterSelection.style.display = 'flex';
            this._LaunchCharacterSelection(); //launch the character selection screen after the loading is done
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
            characterSelection.remove();
            this._OnProgress(this, null, 0, 1);
            loadingElem.style.display = 'flex';
            progressTitle.textContent = "Loading character animations..."
        };
        this._characterAnimationsManager.onLoad = () => {
            loadingElem.remove();
            paramsContainer.style.display = 'flex';
            parametersvalidate.addEventListener('click', () => {
                let gInput = graphics.elements;
                let kInput = keyboard.elements;
                
                for (let i = 0; i < gInput.length; i++) {
                    if (gInput[i].nodeName == "INPUT" && gInput[i].checked) {
                        gInput = gInput[i].value;break;
                    }
                }
                for (let i = 0; i < kInput.length; i++) {
                    if (kInput[i].nodeName == "INPUT" && kInput[i].checked) {
                        kInput = kInput[i].value;break;
                    }
                }

                paramsContainer.remove();
                this._LaunchGame(charName, gInput, kInput);
            });
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
    _LaunchGame(charName, gInput, kInput) {
        if(kInput == 'azerty') {
            right.innerHTML='D';left.innerHTML='Q';forward.innerHTML='Z';backward.innerHTML='S';
        } else {
            right.innerHTML='D';left.innerHTML='A';forward.innerHTML='W';backward.innerHTML='S';
        }

        controlsContainer.style.display = 'block';
        questsContainer.style.display = 'block';
        canvas.style.display = 'block';

        let _APP = new Game(this, {charName, gInput, kInput}); //character selection launch
        window.addEventListener('resize', _APP._OnWindowResize.bind(_APP));
    }
}

export default CustomLoader;