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
        for (let modelName in this._params.customLoader._envModels) {
            switch (modelName) {
                case 'platform':
                    this._Platform.call(this, this._params.customLoader._envModels[modelName]);
                    break;
                case 'iceWorld':
                    this._IceWorld.call(this, this._params.customLoader._envModels[modelName]);
                    break;
                case 'bridge':
                    this._Bridge.call(this, this._params.customLoader._envModels[modelName]);
                    break;
                case 'trees':
                    this._Trees.call(this, this._params.customLoader._envModels[modelName]);
                    break;
                case 'arch':
                    this._Arch.call(this, this._params.customLoader._envModels[modelName]);
                    break;
                default:
                    break;
            }
        };
    }
    _Platform(model) {
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        root.add(clonedScene);
        this._params.scene.add(root);

        root.scale.setScalar(100);
        root.position.set(0, -245, 0);

        root.updateMatrixWorld();

        let BBox = new THREE.Box3().setFromObject(root);
        const helper = new THREE.Box3Helper( BBox, 0xffff00 );
        this._params.scene.add( helper );
    }
    _IceWorld(model) {
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        root.add(clonedScene);
        this._params.scene.add(root);

        //adding shadows to every element in the scene
        root.traverse((obj) => {
            if (obj.castShadow !== undefined) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });
        root.scale.setScalar(0.35);
        root.position.set(-30, -21, 70);

        root.updateMatrixWorld();

        let BBox = new THREE.Box3().setFromObject(root);
        const helper = new THREE.Box3Helper( BBox, 0xffff00 );
        this._params.scene.add( helper );
    }
    _Bridge(model) {
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        root.add(clonedScene);
        this._params.scene.add(root);

        root.scale.setScalar(5);
        root.position.set(-30, -28, 70);

        root.updateMatrixWorld();

        let BBox = new THREE.Box3().setFromObject(root);
        const helper = new THREE.Box3Helper( BBox, 0xffff00 );
        this._params.scene.add( helper );
    }
    _Trees(model) {
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        root.add(clonedScene);
        this._params.scene.add(root);

        //adding shadows to every element in the scene
        root.traverse((obj) => {
            if (obj.castShadow !== undefined) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });
        root.scale.setScalar(0.1);
        root.position.set(-150, 0, 0);

        root.updateMatrixWorld();

        let BBox = new THREE.Box3().setFromObject(root);
        const helper = new THREE.Box3Helper( BBox, 0xffff00 );
        this._params.scene.add( helper );
    }
    _Foliage(model) {
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        root.add(clonedScene);
        this._params.scene.add(root);

        root.scale.setScalar(0.1);
        // root.position.set(-150, 0, 0);

        root.updateMatrixWorld();

        let BBox = new THREE.Box3().setFromObject(root);
        const helper = new THREE.Box3Helper( BBox, 0xffff00 );
        this._params.scene.add( helper );
    }
    _Arch(model) {
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        root.add(clonedScene);
        this._params.scene.add(root);

        //adding shadows to every element in the scene
        root.traverse((obj) => {
            if (obj.castShadow !== undefined) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });
        root.scale.setScalar(100);
        root.rotation.y = Math.PI/2;
        root.position.set(40, 0, -350);

        root.updateMatrixWorld();

        let BBox = new THREE.Box3().setFromObject(root);
        const helper = new THREE.Box3Helper( BBox, 0xffff00 );
        this._params.scene.add( helper );
    }
}

export default EnvController;



//shadows
//scale
//later: animations
//later: collisions

// console.log(dumpObject(root).join('\n'));
// const base = root.getObjectByName('AguaSuelo01_M_AguaSombra_0'); //the base of the platform is at (0,0,0)
// console.log(base.getWorldPosition());

// Object.values(this._customLoader._envModels).forEach((model, ndx) => {
//     const clonedScene = SkeletonUtils.clone(model.gltf.scene);
//     const root = new THREE.Object3D();
//     root.add(clonedScene);
//     this._scene.add(root);
//     root.position.x = (ndx - 3) * 3;
// });

// if(typeof model.animIdx !== 'number') return; //no animation available

// const mixer = new THREE.AnimationMixer(clonedScene);
// this._mixers.push(mixer);
// const action = mixer.clipAction(model.gltf.animations[model.animIdx]);
// action.enabled = true;
// action.play();