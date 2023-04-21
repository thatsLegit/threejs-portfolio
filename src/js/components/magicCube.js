import * as THREE from 'three';
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils';

const CANVAS = document.querySelector('#c');
const IFRAMES = {
    cv: document.querySelector('#cv'),
    aboutMe: document.querySelector('#aboutMe'),
    hireMe: document.querySelector('#hireMe'),
    skills: document.querySelector('#skills'),
    projects: document.querySelector('#projects'),
    smallGames: document.querySelector('#smallGames'),
};

class MagicCube {
    constructor(params) {
        this._params = params;

        this._faces = ['aboutMe', 'projects', 'cv', 'skills', 'hireMe', 'smallGames'];
        this._visited = new Set();

        // mysteryCube to magicCube transition
        this.transiting = false;
        this._direction = 'expand';
        this._expansionDistance = 0;
        this._expansionFactor = 0.15;
        this._rotationAngle = 0;
        this._mysteryCubeComponents = [];
        this._mysteryCubeFaceVectors = this._faces.map(() => [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 1),
        ]);

        this._cube = null;
        this._rotationMatrix = new THREE.Matrix4();
        this._targetRotationX = 0.5;
        this._targetRotationOnMouseDownX = 0;
        this._targetRotationY = 0.2;
        this._targetRotationOnMouseDownY = 0;
        this._slowingFactor = 1;

        this._xAxis = new THREE.Vector3(0, 1, 0);
        this._yAxis = new THREE.Vector3(1, 0, 0);

        this._mouseX = 0;
        this._mouseXOnMouseDown = 0;
        this._mouseY = 0;
        this._mouseYOnMouseDown = 0;

        this._canvasHalfX = CANVAS.clientWidth / 2;
        this._canvasHalfY = CANVAS.clientHeight / 2;

        this._initMysteryCube();
    }

    get isOpened() {
        return !!this._cube;
    }

    _initMysteryCube() {
        //multi-planes flipping cube container
        this.mysteryCube = new THREE.Object3D();

        this._mysteryCubeComponents = this._faces.map((face) =>
            SceneUtils.createMultiMaterialObject(new THREE.PlaneGeometry(20, 20), [
                new THREE.MeshPhongMaterial({
                    map: this._params.textures.interrogation.texture,
                    side: THREE.FrontSide,
                }),
                new THREE.MeshBasicMaterial({
                    map: this._params.textures[face].texture,
                    side: THREE.BackSide,
                }),
            ])
        );

        this._mysteryCubeComponents[0].position.set(0, 0, 14); /* about me */
        this._mysteryCubeComponents[0].rotation.y = Math.PI / 4;

        this._mysteryCubeComponents[1].position.set(-14, 0, 0); /* projects */
        this._mysteryCubeComponents[1].rotation.y = -Math.PI / (4 / 3);

        this._mysteryCubeComponents[2].position.set(-14, 0, 14); /* cv */
        this._mysteryCubeComponents[2].rotation.y = -Math.PI / 4;

        this._mysteryCubeComponents[3].position.set(-7, 10, 7); /* skills */
        this._mysteryCubeComponents[3].rotation.x = -Math.PI / 2;
        this._mysteryCubeComponents[3].rotation.z = Math.PI / 4;

        this._mysteryCubeComponents[4].position.set(-7, -10, 7); /* hire me */
        this._mysteryCubeComponents[4].rotation.x = Math.PI / 2;
        this._mysteryCubeComponents[4].rotation.z = -Math.PI / 4;

        this._mysteryCubeComponents[5].position.set(0, 0, 0); /* small games */
        this._mysteryCubeComponents[5].rotation.y = Math.PI / 1.33;

        this._mysteryCubeComponents.forEach((plane) => this.mysteryCube.add(plane));

        this.mysteryCube.position.copy(this._params.position.add(new THREE.Vector3(5, 0, 0)));
        this._params.scene.add(this.mysteryCube);
    }

    _updatePlanes(timeElapsed, sign) {
        const increment = this._expansionFactor * sign * timeElapsed * 100;

        this._mysteryCubeFaceVectors[0][0].set(1, 0, 0);
        this._mysteryCubeFaceVectors[0][2].set(0, 0, 1);
        this._mysteryCubeFaceVectors[0][0].multiplyScalar(increment);
        this._mysteryCubeFaceVectors[0][2].multiplyScalar(increment);
        this._mysteryCubeComponents[0].position.add(this._mysteryCubeFaceVectors[0][0]);
        this._mysteryCubeComponents[0].position.add(this._mysteryCubeFaceVectors[0][2]);

        this._mysteryCubeFaceVectors[1][0].set(1, 0, 0);
        this._mysteryCubeFaceVectors[1][2].set(0, 0, 1);
        this._mysteryCubeFaceVectors[1][0].multiplyScalar(-increment);
        this._mysteryCubeFaceVectors[1][2].multiplyScalar(-increment);
        this._mysteryCubeComponents[1].position.add(this._mysteryCubeFaceVectors[1][0]);
        this._mysteryCubeComponents[1].position.add(this._mysteryCubeFaceVectors[1][2]);

        this._mysteryCubeFaceVectors[2][0].set(1, 0, 0);
        this._mysteryCubeFaceVectors[2][2].set(0, 0, 1);
        this._mysteryCubeFaceVectors[2][0].multiplyScalar(-increment);
        this._mysteryCubeFaceVectors[2][2].multiplyScalar(increment);
        this._mysteryCubeComponents[2].position.add(this._mysteryCubeFaceVectors[2][0]);
        this._mysteryCubeComponents[2].position.add(this._mysteryCubeFaceVectors[2][2]);

        this._mysteryCubeFaceVectors[3][1].set(0, 1, 0);
        this._mysteryCubeFaceVectors[3][1].multiplyScalar(increment);
        this._mysteryCubeComponents[3].position.add(this._mysteryCubeFaceVectors[3][1]);

        this._mysteryCubeFaceVectors[4][1].set(0, 1, 0);
        this._mysteryCubeFaceVectors[4][1].multiplyScalar(-increment);
        this._mysteryCubeComponents[4].position.add(this._mysteryCubeFaceVectors[4][1]);

        this._mysteryCubeFaceVectors[5][0].set(1, 0, 0);
        this._mysteryCubeFaceVectors[5][2].set(0, 0, 1);
        this._mysteryCubeFaceVectors[5][0].multiplyScalar(increment);
        this._mysteryCubeFaceVectors[5][2].multiplyScalar(-increment);
        this._mysteryCubeComponents[5].position.add(this._mysteryCubeFaceVectors[5][0]);
        this._mysteryCubeComponents[5].position.add(this._mysteryCubeFaceVectors[5][2]);

        this._expansionDistance += increment;
    }

    _flipMysteryCubeFaces(timeElapsed) {
        const increment = timeElapsed * 3;

        this._mysteryCubeComponents[0].rotation.y += increment;
        this._mysteryCubeComponents[1].rotation.y += increment;
        this._mysteryCubeComponents[2].rotation.y += increment;
        this._mysteryCubeComponents[3].rotation.x += increment;
        this._mysteryCubeComponents[4].rotation.x += increment;
        this._mysteryCubeComponents[5].rotation.y += increment;

        this._rotationAngle += increment;

        if (this._rotationAngle >= Math.PI) this._direction = 'shrink';
    }

    openMysteryCube(timeElapsed) {
        if (this._direction == 'expand' && this._expansionDistance < 7)
            this._updatePlanes(timeElapsed, 1);
        else if (this._direction == 'expand') this._flipMysteryCubeFaces(timeElapsed);
        else if (this._direction == 'shrink' && this._expansionDistance >= 0)
            this._updatePlanes(timeElapsed, -1);
        else {
            this.transiting = false;
            this._params.scene.remove(this.mysteryCube);
            this._createCube();
        }
    }

    _createCube() {
        const materials = this._faces.map(
            (face) => new THREE.MeshBasicMaterial({ map: this._params.textures[face].texture })
        );

        this._cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), materials);
        this._cube.position.copy(this._params.position.sub(new THREE.Vector3(5, 0, 0)));
        this._cube.overdraw = true;
        this._params.scene.add(this._cube);

        //raycasting to the cube
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        // select a face of the cube
        document.addEventListener('dblclick', (e) => OnDoubleClick.call(this, e));

        function OnDoubleClick(e) {
            raycaster.setFromCamera(mouse, this._params.camera);
            const isIntersected = raycaster.intersectObject(this._cube);

            if (!isIntersected.length) return;

            const index = isIntersected[0].face.materialIndex;

            this._openIframe(this._faces[index]);
        }

        //updating mouse raycaster vector
        document.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX / CANVAS.clientWidth) * 2 - 1;
            mouse.y = -(e.clientY / CANVAS.clientHeight) * 2 + 1;
        });

        //cube rotation
        let onCanvasMouseMove = (e) => {
            this._mouseX = e.clientX - this._canvasHalfX; //distance to half of the screen on x
            this._targetRotationX = (this._mouseX - this._mouseXOnMouseDown) * 0.001; //distance between mouse down and move on x

            this._mouseY = e.clientY - this._canvasHalfY; //distance to half of the screen on y
            this._targetRotationY = (this._mouseY - this._mouseYOnMouseDown) * 0.001; //distance between mouse down and move on x
        };
        onCanvasMouseMove = onCanvasMouseMove.bind(this); //pre-assigning the same function to the var but with the this binding.

        let onCanvasMouseEnds = (e) => {
            document.removeEventListener('mousemove', onCanvasMouseMove);
            document.removeEventListener('mouseup', onCanvasMouseEnds);
            document.removeEventListener('mouseout', onCanvasMouseEnds);
        };
        onCanvasMouseEnds = onCanvasMouseEnds.bind(this); //pre-assigning the same function to the var but with the this binding.

        document.addEventListener('mousedown', onCanvasMouseDown.bind(this));
        function onCanvasMouseDown(e) {
            e.preventDefault(); // ?

            raycaster.setFromCamera(mouse, this._params.camera);
            let isIntersected = raycaster.intersectObject(this._cube);
            if (!isIntersected.length) return;

            document.addEventListener('mousemove', onCanvasMouseMove);
            document.addEventListener('mouseup', onCanvasMouseEnds);
            document.addEventListener('mouseout', onCanvasMouseEnds);

            this._mouseXOnMouseDown = e.clientX - this._canvasHalfX; //distance to half of the screen on x
            this._targetRotationOnMouseDownX = this._targetRotationX; //0.5

            this._mouseYOnMouseDown = e.clientY - this._canvasHalfY; //distance to half of the screen on y
            this._targetRotationOnMouseDownY = this._targetRotationY; //0.2
        }
    }

    update(timeElapsed) {
        if (this.transiting) return this.openMysteryCube(timeElapsed);
        if (!this._cube) return;

        this._xAxis.set(0, 1, 0);
        this._yAxis.set(1, 0, 0);

        this._rotateAroundWorldAxis(this._cube, this._xAxis, this._targetRotationX);
        this._rotateAroundWorldAxis(this._cube, this._yAxis, this._targetRotationY);

        this._targetRotationY = this._targetRotationY * (1 - Math.pow(0.001, timeElapsed / 2));
        this._targetRotationX = this._targetRotationX * (1 - Math.pow(0.001, timeElapsed / 2));
    }

    _openIframe(name) {
        closeFullscreen(); // canvas go out of full screen to see iframe if needed
        this?._selected && (IFRAMES[this._selected].style.display = 'none');
        IFRAMES[name].style.display = 'block';
        this._selected = name;
        this._visited.add(name);
    }

    //targetRotation is approximated to radians
    _rotateAroundWorldAxis(object, axis, radians) {
        this._rotationMatrix = new THREE.Matrix4();
        console.log(this._rotationMatrix);
        this._rotationMatrix.makeRotationAxis(axis.normalize(), radians);
        this._rotationMatrix.multiply(object.matrix);
        object.matrix = this._rotationMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }
}

export default MagicCube;
