//Set the initial position, rotation, scale of each loaded model
//wether it's animated or not.

import * as THREE from "three";
import {SkeletonUtils} from '../../utils/SkeletonUtils';
import {dumpObject} from '../../helpers/miscellaneous/helper';

//une sorte d'ecran géant pour afficher le content avec le cube un peu comme une télécommande
//tout ça avec un passage en pov

class EnvController {
    constructor(params) {
        this._params = params; //scene, customLoader, character
        this._treasureOpened = false;
        this._Init();
    }

    _Init() {
        const statics = this._params.customLoader._envModels.static;
        for (let modelName in statics) {
            switch (modelName) {
                case 'platform':
                    this._SetModel.call(this, statics[modelName], 100, new THREE.Vector3(0, -245, 0), null, true, false);
                    break;
                case 'smallPlatform':
                    this._SetModel.call(this, statics[modelName], 60, new THREE.Vector3(40, -52, -720), null, true);
                    break;
                case 'iceWorld':
                    this._SetModel.call(this, statics[modelName], 0.35, new THREE.Vector3(-30, -21, 70), null, true, true);
                    break;
                case 'bridge':
                    this._SetModel.call(this, statics[modelName], 5, new THREE.Vector3(-30, -28, 70), null, true);
                    break;
                case 'trees':
                    this._SetModel.call(this, statics[modelName], 0.1, new THREE.Vector3(-150, 0, 0), null, true, true);
                    break;
                case 'arch':
                    this._SetModel.call(this, statics[modelName], 100, new THREE.Vector3(40, 0, -350), new THREE.Vector3(0, Math.PI/2, 0), true, true);
                    break;
                case 'foliage':
                    this._SetModel.call(this, statics[modelName], 0.1);
                    break;
                case 'ship':
                    this._SetModel.call(this, statics[modelName], 5, new THREE.Vector3(0, 100, 1300), new THREE.Vector3(0, -Math.PI/2, 0));
                    break;
                default:
                    break;
            }
        };

        const animated = this._params.customLoader._envModels.animated;
        for (let modelName in animated) {
            switch (modelName) {
                case 'treasureChest':
                    this._SetTreasureChest.call(this, animated[modelName]);
                    break;
                default:
                    break;
            }
        }
    }
    _SetModel(model, scalar = null, initWorldPos = null, rotation = null, receiveSh = false, castSh = false) {
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        clonedScene.matrixAutoUpdate = false;
        root.add(clonedScene);
        this._params.scene.add(root);

        if(receiveSh || castSh) {
            root.traverse(obj => {
                castSh && (obj.castShadow = true);
                receiveSh && (obj.receiveShadow = true);
            });
        }
        
        scalar && root.scale.setScalar(scalar);
        rotation && root.rotation.setFromVector3(rotation);
        initWorldPos && root.position.copy(initWorldPos);
    }
    _SetTreasureChest(model) {
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        root.add(clonedScene);

        this._treasure = root;
        this._params.scene.add(root);

        root.traverse(obj => {
            obj.castShadow = true;
            obj.receiveShadow = true;
        });
        
        root.scale.setScalar(0.25);
        root.position.set(40, 38, -720);

        //Animation to open the treasure
        this._mixer = new THREE.AnimationMixer(clonedScene);
        const action = this._mixer.clipAction(Object.values(model.gltf.animations)[1]); //2nd clip: openBox

        this._mixer.addEventListener('finished', callback.bind(this));
        function callback() {
            this._treasureOpened = true;
            action.getMixer().removeEventListener('finished', callback);
        }
    
        action.reset();
        action.setEffectiveTimeScale(0.25);
        action.setEffectiveWeight(1.0);
        action.setLoop(THREE.LoopOnce);
        action.play();
    }

    _Update(deltaTime) {
        this._mixer.update(deltaTime);
    }
}

export default EnvController;