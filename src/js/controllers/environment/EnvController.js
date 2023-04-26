import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

class EnvController {
    constructor(params) {
        this._params = params;
        this._mixers = [];
        this._animations = {};
        this._treasureOpened = false;
        this._init();
    }

    _init() {
        const staticModels = this._params.assets.envModels.static;
        const animated = this._params.assets.envModels.animated;

        // static models
        this._setModel(
            staticModels['platform'],
            100,
            new THREE.Vector3(0, -245, 0),
            null,
            true,
            false
        );
        this._setModel(
            staticModels['smallPlatform'],
            60,
            new THREE.Vector3(40, -52, -720),
            null,
            true
        );
        this._setModel(
            staticModels['iceWorld'],
            0.35,
            new THREE.Vector3(-30, 25, 70),
            null,
            true,
            true
        );
        this._setModel(staticModels['bridge'], 5, new THREE.Vector3(-30, -28, 70), null, true);
        this._setModel(staticModels['trees'], 0.1, new THREE.Vector3(-150, 0, 0), null, true, true);
        this._setModel(
            staticModels['arch'],
            100,
            new THREE.Vector3(40, 0, -350),
            new THREE.Vector3(0, Math.PI / 2, 0),
            true,
            true
        );
        this._setModel(staticModels['foliage'], 0.1);
        this._setModel(
            staticModels['ship'],
            5,
            new THREE.Vector3(0, 100, 1300),
            new THREE.Vector3(0, -Math.PI / 2, 0)
        );

        // animated models
        this._setTreasureChest(animated['treasureChest']);
    }

    _setModel(
        model,
        scalar = null,
        initWorldPos = null,
        rotation = null,
        receiveShadow = false,
        castShadow = false
    ) {
        const scene = SkeletonUtils.clone(model.gltf.scene);
        scene.matrixAutoUpdate = false;
        const root = new THREE.Object3D();
        root.add(scene);
        this._params.scene.add(root);

        if (receiveShadow || castShadow) {
            root.traverse((obj) => {
                castShadow && (obj.castShadow = true);
                receiveShadow && (obj.receiveShadow = true);
            });
        }

        scalar && root.scale.setScalar(scalar);
        rotation && root.rotation.setFromVector3(rotation);
        initWorldPos && root.position.copy(initWorldPos);
    }

    _setTreasureChest(model) {
        const scene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        root.add(scene);
        this._params.scene.add(root);
        this.treasure = root; /* accessed in QuestController */

        root.traverse((obj) => {
            obj.castShadow = true;
            obj.receiveShadow = true;
        });

        root.scale.setScalar(0.25);
        root.position.set(40, 38, -720);

        // Animation to open the treasure
        const mixer = new THREE.AnimationMixer(scene);
        this._mixers.push(mixer);
        const action = mixer.clipAction(Object.values(model.gltf.animations)[1]);

        // TODO: dirty fix, allows starting of the lid with a closed paused animation
        setTimeout(() => {
            action.reset();
            action.setEffectiveTimeScale(0.01);
            action.setEffectiveWeight(1);
            action.setLoop(THREE.LoopOnce);
            action.play();
            setTimeout(() => {
                action.paused = true;
            }, 0);
        }, 0);
    }

    update(deltaTime) {
        this._mixers.forEach((m) => m.update(deltaTime));
    }
}

export default EnvController;
