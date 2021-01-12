//Set the initial position, rotation, scale of each loaded model
//wether it's animated or not.

import * as THREE from "../node_modules/three/build/three.module.js";
import {SkeletonUtils} from '../node_modules/three/examples/jsm/utils/SkeletonUtils.js';
import {dumpObject} from './helper.js';

//une sorte d'ecran géant pour afficher le content avec le cube un peu comme une télécommande
//tout ça avec un passage en pov

class EnvController {
    constructor(params) {
        this._params = params; //scene, customLoader, character
        this._Init();
    }

    _Init() {
        const statics = this._params.customLoader._envModels.static;
        for (let modelName in statics) {
            switch (modelName) {
                case 'platform':
                    this._SetModel.call(this, statics[modelName], 100, new THREE.Vector3(0, -245, 0));
                    break;
                case 'smallPlatform':
                    this._SetModel.call(this, statics[modelName], 60, new THREE.Vector3(40, -50, -720), null, true);
                    break;
                case 'iceWorld':
                    this._SetModel.call(this, statics[modelName], 0.35, new THREE.Vector3(-30, -21, 70), null, true, true);
                    break;
                case 'bridge':
                    this._SetModel.call(this, statics[modelName], 5, new THREE.Vector3(-30, -28, 70));
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
                    this._SetModel.call(this, statics[modelName], 5, new THREE.Vector3(0, 100, 1300), new THREE.Vector3(0, -Math.PI/2, 0), false, true);
                    break;
                default:
                    break;
            }
        };
    }
    _SetModel(model, scalar = null, initWorldPos = null, rotation = null, receiveSh = false, castSh = false) {
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
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
}

export default EnvController;

// console.log(dumpObject(root).join('\n'));
// const base = root.getObjectByName('AguaSuelo01_M_AguaSombra_0'); //the base of the platform is at (0,0,0)
// console.log(base.getWorldPosition());

// _SmallPlatform(model){
//     const clonedScene = SkeletonUtils.clone(model.gltf.scene);
//     const root = new THREE.Object3D();
//     root.add(clonedScene);
//     this._params.scene.add(root);

//     //adding shadows to every element in the scene
//     root.traverse((obj) => {
//         if (obj.castShadow !== undefined) {
//             obj.receiveShadow = true;
//         }
//     });
//     root.scale.setScalar(60);
//     root.position.set(40, -50, -720);

//     root.updateMatrixWorld();
   
// let BBox = new THREE.Box3().setFromObject(model);
// BBox.min.sub(model.position);
// BBox.max.sub(model.position);
// const helper = new THREE.Box3Helper( BBox, 0xffff00 );
// this._params.scene.add( helper );

// const mixer = new THREE.AnimationMixer(clonedScene);
// this._mixers.push(mixer);
// const action = mixer.clipAction(model.gltf.animations[model.animIdx]);
// action.enabled = true;
// action.play();