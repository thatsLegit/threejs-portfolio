import * as THREE from "three";

const chSelectCanvas = document.querySelector('#character-selection-canvas');
const validate = document.querySelector('#character-selection-validate');

class CharacterSelection {
    constructor(customLoader) {
        this._customLoader = customLoader;
        this._Init();
    }

    _Init() {
        this._threejs = new THREE.WebGLRenderer({canvas: chSelectCanvas});
        this._threejs.setSize(chSelectCanvas.clientWidth, chSelectCanvas.clientHeight);

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color('burlywood');

        {
            const fov = 45;
            const aspect = chSelectCanvas.clientWidth / chSelectCanvas.clientHeight;  // the canvas default
            const near = 1;
            const far = 100;
            this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this._camera.position.set(13, 20, 40);
        }
        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 0.5;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            this._scene.add(light);
        }
        {
            const color = 0xFFFFFF;
            const intensity = 0;
            this._light = new THREE.SpotLight(color, intensity);
            this._light.distance
            this._light.position.set(12.5, 35, 10);
            this._light.target.position.set(25, 12, 0);
            this._scene.add(this._light);
            this._scene.add(this._light.target);
        }

        this._selection = null;
        const models = this._customLoader._characterModel;

        let idx = 0;
        for (let modelName in models) {
            let model = models[modelName].fbx;
            model.name = modelName;
            model.scale.setScalar(0.1);
            model.position.set(idx * 25, 12, 0);
            this._scene.add(model);
            idx++;
        }

        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        clearPickPosition();
        
        function getCanvasRelativePosition(event) {
            const rect = chSelectCanvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) * chSelectCanvas.width  / rect.width,
                y: (event.clientY - rect.top ) * chSelectCanvas.height / rect.height,
            };
        }
        
        function setPickPosition(event) {
            const pos = getCanvasRelativePosition(event);
            mouse.x = (pos.x / chSelectCanvas.width ) *  2 - 1;
            mouse.y = (pos.y / chSelectCanvas.height) * -2 + 1;
        }
        
        function clearPickPosition() {
            mouse.x = -100000;
            mouse.y = -100000;
        }
        
        window.addEventListener('mousemove', setPickPosition);
        window.addEventListener('mouseout', clearPickPosition);
        window.addEventListener('mouseleave', clearPickPosition);

        chSelectCanvas.addEventListener('click', e => {
            raycaster.setFromCamera(mouse, this._camera);
            const targets = [];

            Object.values(models).forEach(model => {
                targets.push(...model.fbx.children);
            });

            let isIntersected = raycaster.intersectObjects(targets);
            if (isIntersected.length) {
                this._selection = isIntersected[0].object.parent.name;
                const direction = isIntersected[0].object.parent.position //vector3
                this._light.target.position.copy(direction);
                this._light.intensity = 2;
            };
        });

        validate.addEventListener('click', () => {
            if(!this._selection) {
                window.alert('Please select a character !');
                return;
            };
            this._scene.remove();
            this._customLoader._LoadCharacterAnimations(this._selection); //continue the loading process
        });

        requestAnimationFrame(animate.bind(this));

        function animate(time) {
            this._threejs.render(this._scene, this._camera);
            requestAnimationFrame(animate.bind(this));
        }
    }

    _OnWindowResize() {
        this._camera.aspect = chSelectCanvas.clientWidth / chSelectCanvas.clientHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(chSelectCanvas.clientWidth, chSelectCanvas.clientHeight);
    }
}

export default CharacterSelection;