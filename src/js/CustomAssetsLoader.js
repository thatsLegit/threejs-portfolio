import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const PROGRESS_BAR = document.querySelector('.progressBar');
const PROGRESS_BAR_TITLE = document.querySelector('.progressTitle');

class CustomAssetsLoader {
    constructor() {
        this._init();
    }

    _init() {
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
            interrogation: { path: './assets/cube_textures/interrogation.png' }, //texture is loader here thereafter
            aboutMe: { path: './assets/cube_textures/aboutMe.png' },
            projects: { path: './assets/cube_textures/projects.png' },
            cv: { path: './assets/cube_textures/cv.png' },
            skills: { path: './assets/cube_textures/skills.png' },
            hireMe: { path: './assets/cube_textures/hireMe.png' },
            smallGames: { path: './assets/cube_textures/smallGames.png' },
        };

        this._envModelsManager = new THREE.LoadingManager();
        this._envModelsLoader = new GLTFLoader(this._envModelsManager);
        this._envModels = {
            animated: {
                treasureChest: {
                    path: './assets/blender_models/treasure-chest/treasureChest.glb',
                },
            },
            static: {
                platform: { path: './assets/blender_models/platform/desert/scene.gltf' },
                smallPlatform: {
                    path: './assets/blender_models/platform/small/smallPlatform.glb',
                },
                iceWorld: { path: './assets/blender_models/iceWorld/ice.glb' },
                bridge: { path: './assets/blender_models/iceWorld/bridge.glb' },
                trees: { path: './assets/blender_models/forest/trees/trees.glb' },
                foliage: { path: './assets/blender_models/forest/foliage/foliage.glb' },
                arch: { path: './assets/blender_models/forest/arch/arch.glb' },
                ship: { path: './assets/blender_models/ship/ship.glb' },
            },
        };

        this._characterModelManager = new THREE.LoadingManager();
        this._characterLoader = new FBXLoader(this._characterModelManager);
        this.characterModels = {
            megan: {
                path: './assets/blender_models/characters/megan/megan.fbx',
                //this fixes the character 'shininess', for some reason the specular map is not loaded automatically
                specularMap: new THREE.TextureLoader().load(
                    './assets/blender_models/characters/megan/Ch22_1001_Specular.png'
                ),
                gender: 'female',
            },
            brian: {
                path: './assets/blender_models/characters/brian/brian.fbx',
                specularMap: new THREE.TextureLoader().load(
                    './assets/blender_models/characters/brian/Ch01_1001_Specular.png'
                ),
                gender: 'male',
            },
        };

        this._characterAnimationsManager = new THREE.LoadingManager();
        this._charAnimationsLoader = new FBXLoader(this._characterAnimationsManager);
        this._charAnimations = ['megan', 'brian'].reduce(
            (acc, current) => ({
                ...acc,
                ...{
                    [current]: {
                        walk: {
                            path: `./assets/blender_models/characters/${current}/animations/walk.fbx`,
                        },
                        walkingBackwards: {
                            path: `./assets/blender_models/characters/${current}/animations/walkingBackwards.fbx`,
                        },
                        run: {
                            path: `./assets/blender_models/characters/${current}/animations/run.fbx`,
                        },
                        idle: {
                            path: `./assets/blender_models/characters/${current}/animations/idle.fbx`,
                        },
                        falling: {
                            path: `./assets/blender_models/characters/${current}/animations/falling.fbx`,
                        },
                    },
                },
            }),
            {}
        );
    }

    _onProgress(url, itemsLoaded, itemsTotal) {
        const progress = itemsLoaded / itemsTotal;
        PROGRESS_BAR.style.transform = `scaleX(${progress})`;
    }

    loadBgTexture() {
        return new Promise((resolve, reject) => {
            this._onProgress(null, 0, 1); //initialize the the progress bar

            PROGRESS_BAR_TITLE.textContent = 'Loading background...';

            this._bgTexture = this._bgTextureLoader.load(
                this._bgTextureFiles,
                resolve,
                this._onProgress,
                () => reject(new Error("Oops, background textures couldn't have been loaded :/."))
            );
        });
    }

    loadCubeTexture() {
        return new Promise((resolve, reject) => {
            this._onProgress(null, 0, 1);

            PROGRESS_BAR_TITLE.textContent = 'Loading magic cube textures...';

            const allTextures = Object.values(this._magicCubeTexture);

            allTextures.forEach((obj, idx) => {
                this._magicCubeTextureLoader.load(
                    obj.path,
                    (load) => {
                        obj.texture = load;
                        this._onProgress(null, idx + 1, allTextures.length);
                        if (idx == allTextures.length - 1) resolve();
                    },
                    undefined, //onprogress: no onProgress event on TextureLoader
                    () => reject(new Error("Oops, cube textures coudln't have been loaded :/."))
                );
            });
        });
    }

    loadEnvModels() {
        return new Promise((resolve, reject) => {
            this._envModelsManager.onStart = () => {
                this._onProgress(null, 0, 1);
                PROGRESS_BAR_TITLE.textContent = 'Loading environment...';
            };
            this._envModelsManager.onLoad = () => resolve();
            this._envModelsManager.onProgress = this._onProgress;
            this._envModelsManager.onError = () =>
                reject(new Error("Oops, environment models coudln't have been loaded :/."));

            Object.values(this._envModels).forEach((m, idx) => {
                const type = idx == 0 ? 'animated' : 'static';
                for (let model in m) {
                    this._envModelsLoader.load(this._envModels[type][model].path, (gltf) => {
                        this._envModels[type][model].gltf = gltf;
                    });
                }
            });
        });
    }

    loadCharacterModel() {
        return new Promise((resolve, reject) => {
            this._characterModelManager.onStart = () => {
                this._onProgress(null, 0, 1); //resets the progress bar to 0
                PROGRESS_BAR_TITLE.textContent = 'Loading characters...';
            };
            this._characterModelManager.onLoad = resolve;
            this._characterModelManager.onProgress = this._onProgress;
            this._characterModelManager.onError = () =>
                reject(new Error("Oops, character model couldn't have been loaded :/."));

            for (let modelName in this.characterModels) {
                this._characterLoader.load(this.characterModels[modelName].path, (fbx) => {
                    this.characterModels[modelName].fbx = fbx;
                });
            }
        });
    }

    loadCharacterAnimations(charName) {
        return new Promise((resolve, reject) => {
            this._characterAnimationsManager.onStart = () => {
                this._onProgress(this, null, 0, 1);
                PROGRESS_BAR_TITLE.textContent = 'Loading character animations...';
            };
            this._characterAnimationsManager.onLoad = resolve;
            this._characterAnimationsManager.onProgress = this._onProgress;
            this._characterAnimationsManager.onError = () =>
                reject(new Error("Oops, character animations coudln't have been loaded :/."));

            for (let animName in this._charAnimations[charName]) {
                this._charAnimationsLoader.load(
                    this._charAnimations[charName][animName].path,
                    (a) => {
                        console.log(a);
                        this._charAnimations[charName][animName].anim = a;
                    }
                );
            }
        });
    }
}

export default CustomAssetsLoader;
