import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import clouds1East from '../../../assets/textures/sandbox/clouds1_east.bmp';
import clouds1West from '../../../assets/textures/sandbox/clouds1_west.bmp';
import clouds1Up from '../../../assets/textures/sandbox/clouds1_up.bmp';
import clouds1Down from '../../../assets/textures/sandbox/clouds1_down.bmp';
import clouds1North from '../../../assets/textures/sandbox/clouds1_north.bmp';
import clouds1South from '../../../assets/textures/sandbox/clouds1_south.bmp';

import aboutMe from '../../../assets/textures/cube_textures/aboutMe.png';
import skills from '../../../assets/textures/cube_textures/skills.png';
import cv from '../../../assets/textures/cube_textures/cv.png';
import hireMe from '../../../assets/textures/cube_textures/hireMe.png';
import interrogation from '../../../assets/textures/cube_textures/interrogation.png';
import projects from '../../../assets/textures/cube_textures/projects.png';
import miniGames from '../../../assets/textures/cube_textures/miniGames.png';

import treasureChest from '../../../assets/models/treasure-chest/treasureChest.glb';
import ship from '../../../assets/models/ship/ship.glb';
import desertPlatform from '../../../assets/models/platform/desert/scene.gltf';
import smallPlatform from '../../../assets/models/platform/small/smallPlatform.glb';
import iceWorld from '../../../assets/models/iceWorld/ice.glb';
import bridge from '../../../assets/models/iceWorld/bridge.glb';
import trees from '../../../assets/models/forest/trees/trees.glb';
import arch from '../../../assets/models/forest/arch/arch.glb';
import foliage from '../../../assets/models/forest/foliage/foliage.glb';

import brian from '../../../assets/models/characters/brian/brian.fbx';
import brianSpecular from '../../../assets/models/characters/brian/Ch01_1001_Specular.png';
import megan from '../../../assets/models/characters/megan/megan.fbx';
import meganSpecular from '../../../assets/models/characters/megan/Ch22_1001_Specular.png';

import brianWalk from '../../../assets/models/characters/brian/animations/brianWalk.fbx';
import brianWalkingBackwards from '../../../assets/models/characters/brian/animations/brianWalkingBackwards.fbx';
import brianRun from '../../../assets/models/characters/brian/animations/brianRun.fbx';
import brianIdle from '../../../assets/models/characters/brian/animations/brianIdle.fbx';
import brianFalling from '../../../assets/models/characters/brian/animations/brianFalling.fbx';
import meganWalk from '../../../assets/models/characters/megan/animations/meganWalk.fbx';
import meganWalkingBackwards from '../../../assets/models/characters/megan/animations/meganWalkingBackwards.fbx';
import meganRun from '../../../assets/models/characters/megan/animations/meganRun.fbx';
import meganIdle from '../../../assets/models/characters/megan/animations/meganIdle.fbx';
import meganFalling from '../../../assets/models/characters/megan/animations/meganFalling.fbx';

const PROGRESS_BAR = document.querySelector('.progressBar');
const PROGRESS_BAR_TITLE = document.querySelector('.progressTitle');

class CustomAssetsBuilder {
    constructor() {
        this._init();
    }

    _init() {
        this._bgTextureLoader = new THREE.CubeTextureLoader();
        this._bgTextureFiles = [
            clouds1East,
            clouds1West,
            clouds1Up,
            clouds1Down,
            clouds1North,
            clouds1South,
        ];

        this._magicCubeTextureLoader = new THREE.TextureLoader(this._magicCubeManager);
        this.magicCubeTexture = {
            interrogation: { path: interrogation }, // texture is loaded here thereafter
            aboutMe: { path: aboutMe },
            projects: { path: projects },
            cv: { path: cv },
            skills: { path: skills },
            hireMe: { path: hireMe },
            miniGames: { path: miniGames },
        };

        this._envModelsManager = new THREE.LoadingManager();
        this._envModelsLoader = new GLTFLoader(this._envModelsManager);
        this.envModels = {
            animated: {
                treasureChest: {
                    path: treasureChest,
                },
            },
            static: {
                platform: { path: desertPlatform },
                smallPlatform: { path: smallPlatform },
                iceWorld: { path: iceWorld },
                bridge: { path: bridge },
                trees: { path: trees },
                foliage: { path: foliage },
                arch: { path: arch },
                ship: { path: ship },
            },
        };

        this._characterModelManager = new THREE.LoadingManager();
        this._characterLoader = new FBXLoader(this._characterModelManager);
        this.characterModels = {
            megan: {
                path: megan,
                // This fixes the character 'shininess', for some reason the specular map is not loaded automatically
                specularMap: new THREE.TextureLoader().load(meganSpecular),
                gender: 'female',
            },
            brian: {
                path: brian,
                specularMap: new THREE.TextureLoader().load(brianSpecular),
                gender: 'male',
            },
        };

        this._characterAnimationsManager = new THREE.LoadingManager();
        this._charAnimationsLoader = new FBXLoader(this._characterAnimationsManager);
        this.charAnimations = {
            brian: {
                walk: { path: brianWalk },
                walkingBackwards: { path: brianWalkingBackwards },
                run: { path: brianRun },
                idle: { path: brianIdle },
                falling: { path: brianFalling },
            },
            megan: {
                walk: { path: meganWalk },
                walkingBackwards: { path: meganWalkingBackwards },
                run: { path: meganRun },
                idle: { path: meganIdle },
                falling: { path: meganFalling },
            },
        };
    }

    _onProgress(url, itemsLoaded, itemsTotal) {
        const progress = itemsLoaded / itemsTotal;
        PROGRESS_BAR.style.transform = `scaleX(${progress})`;
    }

    loadBgTexture() {
        return new Promise((resolve, reject) => {
            this._onProgress(null, 0, 1); //initialize the the progress bar

            PROGRESS_BAR_TITLE.textContent = 'Loading background...';

            this.bgTexture = this._bgTextureLoader.load(
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

            const allTextures = Object.values(this.magicCubeTexture);

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

            Object.values(this.envModels).forEach((m, idx) => {
                const type = idx == 0 ? 'animated' : 'static';
                for (let model in m) {
                    this._envModelsLoader.load(this.envModels[type][model].path, (gltf) => {
                        this.envModels[type][model].gltf = gltf;
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

            for (let animName in this.charAnimations[charName]) {
                this._charAnimationsLoader.load(
                    this.charAnimations[charName][animName].path,
                    (a) => {
                        this.charAnimations[charName][animName].anim = a;
                    }
                );
            }
        });
    }
}

export default CustomAssetsBuilder;
