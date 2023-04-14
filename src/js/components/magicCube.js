import * as THREE from 'three';
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils';

const canvas = document.querySelector('#c');
const iframes = {
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
        this._opened = false;
        this._transiting = false;
        // Faces of the magic cube are represented by two right triangles
        this._faces = ['aboutMe', 'projects', 'cv', 'skills', 'hireMe', 'smallGames'];
        this._visited = new Set();
        this._Init();
        this._InitialCube();
    }

    _Init() {
        this._targetRotationX = 0.5;
        this._targetRotationOnMouseDownX = 0;
        this._targetRotationY = 0.2;
        this._targetRotationOnMouseDownY = 0;
        this._slowingFactor = 1;

        this._xAxis = new THREE.Vector3(0, 1, 0);
        this._yAxis = new THREE.Vector3(1, 0, 0);

        this._direction = 'expand';
        this._distance = 0;
        this._rotator = Math.PI;

        this._mouseX = 0;
        this._mouseXOnMouseDown = 0;
        this._mouseY = 0;
        this._mouseYOnMouseDown = 0;

        this._canvasHalfX = canvas.clientWidth / 2;
        this._canvasHalfY = canvas.clientHeight / 2;

        this._containerComponents = [];
    }

    _InitialCube() {
        //multi-planes flipping cube container
        this._mysteryCube = new THREE.Object3D();

        //planes geometry
        const width = 20;
        const height = 20;
        const planeGeometry = new THREE.PlaneGeometry(width, height);

        this._containerComponents = this._faces.map((face) =>
            SceneUtils.createMultiMaterialObject(planeGeometry, [
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

        this._containerComponents[0].position.set(0, 0, 14); /* about me */
        this._containerComponents[0].rotation.y = Math.PI / 4;

        this._containerComponents[1].position.set(-14, 0, 0); /* projects */
        this._containerComponents[1].rotation.y = -Math.PI / (4 / 3);

        this._containerComponents[2].position.set(-14, 0, 14); /* cv */
        this._containerComponents[2].rotation.y = -Math.PI / 4;

        this._containerComponents[3].position.set(-7, 10, 7); /* skills */
        this._containerComponents[3].rotation.x = -Math.PI / 2;
        this._containerComponents[3].rotation.z = Math.PI / 4;

        this._containerComponents[4].position.set(-7, -10, 7); /* hire me */
        this._containerComponents[4].rotation.x = Math.PI / 2;
        this._containerComponents[4].rotation.z = -Math.PI / 4;

        this._containerComponents[5].position.set(0, 0, 0); /* small games */
        this._containerComponents[5].rotation.y = Math.PI / 1.33;

        this._containerComponents.forEach((plane) => this._mysteryCube.add(plane));

        this._mysteryCube.position.copy(this._params.position.add(new THREE.Vector3(5, 0, 0)));
        this._params.scene.add(this._mysteryCube);
    }

    _Expand(timeElapsed) {
        const [plane1, plane2, plane3, plane4, plane5, plane6] = this._containerComponents;

        plane1.position.z += timeElapsed;
        plane1.position.x += timeElapsed;

        plane2.position.z -= timeElapsed;
        plane2.position.x -= timeElapsed;

        plane3.position.z += timeElapsed;
        plane3.position.x -= timeElapsed;

        plane4.position.y += timeElapsed;

        plane5.position.y -= timeElapsed;

        plane6.position.z -= timeElapsed;
        plane6.position.x += timeElapsed;

        this._distance += timeElapsed;
    }

    _FlipSides(timeElapsed) {
        const [plane1, plane2, plane3, plane4, plane5, plane6] = this._containerComponents;

        let rotation = this._rotator >= timeElapsed ? timeElapsed : this._rotator;

        plane1.rotation.y += rotation;
        plane2.rotation.y += rotation;
        plane3.rotation.y += rotation;
        plane4.rotation.x += rotation;
        plane5.rotation.x += rotation;
        plane6.rotation.y += rotation;

        this._rotator -= timeElapsed;

        if (this._rotator < 0) this._direction = 'shrink';
    }

    _Shrink(timeElapsed) {
        const [plane1, plane2, plane3, plane4, plane5, plane6] = this._containerComponents;

        plane1.position.z -= timeElapsed;
        plane1.position.x -= timeElapsed;

        plane2.position.z += timeElapsed;
        plane2.position.x += timeElapsed;

        plane3.position.z -= timeElapsed;
        plane3.position.x += timeElapsed;

        plane4.position.y -= timeElapsed;

        plane5.position.y += timeElapsed;

        plane6.position.z += timeElapsed;
        plane6.position.x -= timeElapsed;
        this._distance -= timeElapsed;

        if (this._distance < 0) {
            this._transiting = false;
            this._params.scene.remove(this._mysteryCube);
            this._CreateCube.call(this);
        }
    }

    _Transition(timeElapsed) {
        if (this._direction == 'expand' && this._distance < 1)
            this._Expand(1.0 - Math.pow(0.001, timeElapsed / 2));
        if (this._distance >= 1 && this._direction == 'expand')
            this._FlipSides(1.0 - Math.pow(0.001, timeElapsed / 2));
        if (this._direction == 'shrink') this._Shrink(1.0 - Math.pow(0.001, timeElapsed / 2));
    }

    _CreateCube() {
        const materials = this._faces.map(
            (face) => new THREE.MeshBasicMaterial({ map: this._params.textures[face].texture })
        );

        this._cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), materials);
        this._cube.position.copy(this._params.position.sub(new THREE.Vector3(5, 0, 0)));
        this._cube.overdraw = true;
        this._params.scene.add(this._cube);

        this._opened = true;

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

            this._OpenIframe(this._faces[index]);
        }

        //updating mouse raycaster vector
        document.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
            mouse.y = -(e.clientY / canvas.clientHeight) * 2 + 1;
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

    // Mainly for dealing with the rotation
    _Update(timeElapsed) {
        this._xAxis.set(0, 1, 0);
        this._yAxis.set(1, 0, 0);
        this._RotateAroundWorldAxis.call(this, this._cube, this._xAxis, this._targetRotationX);
        this._RotateAroundWorldAxis.call(this, this._cube, this._yAxis, this._targetRotationY);

        this._targetRotationY = this._targetRotationY * (1 - Math.pow(0.001, timeElapsed / 2));
        this._targetRotationX = this._targetRotationX * (1 - Math.pow(0.001, timeElapsed / 2));
    }

    _OpenIframe(name) {
        closeFullscreen(); // canvas go out of full screen to see iframe if needed
        this?._selected && (iframes[this._selected].style.display = 'none');
        iframes[name].style.display = 'block';
        this._selected = name;
        this._visited.add(name);
    }

    //targetRotation is approximated to radians
    _RotateAroundWorldAxis(object, axis, radians) {
        let rotationMatrix = new THREE.Matrix4(); //matrice identité de rang 4
        rotationMatrix.makeRotationAxis(axis.normalize(), radians);
        rotationMatrix.multiply(object.matrix);
        object.matrix = rotationMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }
}

export default MagicCube;
