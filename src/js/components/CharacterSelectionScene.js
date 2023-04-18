import * as THREE from 'three';

const CHARACTER_SELECTION = document.querySelector('#character-selection');
const CHARACTER_SELECTION_C = document.querySelector('#character-selection-canvas');
const CHARACTER_SELECTION_SUBMIT_BUTTON = document.querySelector('#character-selection-validate');

class CharacterSelection {
    constructor(assetLoader) {
        this._assetLoader = assetLoader;
        this._models = assetLoader.characterModels;
        this.selection = null;
        // binding these methods is required as they are passed as callbacks
        this._setPickPosition = this._setPickPosition.bind(this);
        this._clearPickPosition = this._clearPickPosition.bind(this);
        this._getCanvasRelativePosition = this._getCanvasRelativePosition.bind(this);
        this._animate = this._animate.bind(this);
        this._onWindowResize = this._onWindowResize.bind(this);
    }

    launchScene() {
        CHARACTER_SELECTION.style.display = 'flex';

        this._threejs = new THREE.WebGLRenderer({ canvas: CHARACTER_SELECTION_C });
        this._threejs.setSize(
            CHARACTER_SELECTION_C.clientWidth,
            CHARACTER_SELECTION_C.clientHeight
        );

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color('burlywood');

        {
            const fov = 45;
            const aspect = CHARACTER_SELECTION_C.clientWidth / CHARACTER_SELECTION_C.clientHeight; // the canvas default
            const near = 1;
            const far = 100;
            this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this._camera.position.set(13, 20, 40);
        }
        {
            const skyColor = 0xb1e1ff; // light blue
            const groundColor = 0xb97a20; // brownish orange
            const intensity = 0.5;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            this._scene.add(light);
        }
        {
            const color = 0xffffff;
            const intensity = 0;
            this._light = new THREE.SpotLight(color, intensity);
            this._light.distance;
            this._light.position.set(12.5, 35, 10);
            this._light.target.position.set(25, 12, 0);
            this._scene.add(this._light);
            this._scene.add(this._light.target);
        }

        let x_offset = 0;

        for (let modelName in this._models) {
            let model = this._models[modelName].fbx;
            const specularMap = this._models[modelName].specularMap;

            model.name = modelName;
            model.scale.setScalar(0.1);

            //corrects the specular map not loading bug, we load and set it manually:
            model.traverse((c) => {
                if (c.type == 'SkinnedMesh') {
                    c.material.transparent = false;
                    c.material.specularMap = specularMap;
                }
            });

            model.position.set(x_offset * 25, 12, 0);
            this._scene.add(model);
            x_offset++;
        }

        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();

        this._clearPickPosition();

        window.addEventListener('mousemove', this._setPickPosition);
        window.addEventListener('mouseout', this._clearPickPosition);
        window.addEventListener('mouseleave', this._clearPickPosition);

        CHARACTER_SELECTION_C.addEventListener('click', () => {
            this._raycaster.setFromCamera(this._mouse, this._camera);

            const targets = Object.values(this._models).reduce(
                (acc, model) => [...acc, ...model.fbx.children],
                []
            );
            const isIntersected = this._raycaster.intersectObjects(targets);

            if (isIntersected.length) {
                this.selection = isIntersected[0].object.parent.name;
                const direction = isIntersected[0].object.parent.position; //vector3
                this._light.target.position.copy(direction);
                this._light.intensity = 2;
                CHARACTER_SELECTION_SUBMIT_BUTTON.style.boxShadow = '-1px 1px 10px 7px #fff6af';
            }
        });

        window.addEventListener('resize', this._onWindowResize);

        requestAnimationFrame(this._animate);
    }

    _getCanvasRelativePosition(event) {
        const rect = CHARACTER_SELECTION_C.getBoundingClientRect();
        return {
            x: ((event.clientX - rect.left) * CHARACTER_SELECTION_C.width) / rect.width,
            y: ((event.clientY - rect.top) * CHARACTER_SELECTION_C.height) / rect.height,
        };
    }

    _setPickPosition(event) {
        const pos = this._getCanvasRelativePosition(event);
        this._mouse.x = (pos.x / CHARACTER_SELECTION_C.width) * 2 - 1;
        this._mouse.y = (pos.y / CHARACTER_SELECTION_C.height) * -2 + 1;
    }

    _clearPickPosition() {
        this._mouse.x = -100000;
        this._mouse.y = -100000;
    }

    removeScene() {
        CHARACTER_SELECTION.remove();
        window.removeEventListener('resize', this._onWindowResize);
    }

    _animate() {
        this._threejs.render(this._scene, this._camera);
        requestAnimationFrame(this._animate);
    }

    _onWindowResize() {
        this._camera.aspect =
            CHARACTER_SELECTION_C.clientWidth / CHARACTER_SELECTION_C.clientHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(
            CHARACTER_SELECTION_C.clientWidth,
            CHARACTER_SELECTION_C.clientHeight
        );
    }
}

export default CharacterSelection;
