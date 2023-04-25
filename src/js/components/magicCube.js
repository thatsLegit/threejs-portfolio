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

        // keeping track of cube's faces
        this._faces = ['aboutMe', 'projects', 'cv', 'skills', 'hireMe', 'smallGames'];
        this._visited = new Set();
        this._selected = null;

        // mysteryCube to magicCube transition. 6 planes cube, not a "real" cube
        this.mysteryCube = new THREE.Object3D();
        this.mysteryCube.visible = false;
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

        // the "real" cube
        this._cube = null;
        this._rotationMatrix = new THREE.Matrix4();
        this._xAxis = new THREE.Vector3(0, 1, 0);
        this._yAxis = new THREE.Vector3(1, 0, 0);

        this._canvasHalfX = CANVAS.clientWidth / 2;
        this._canvasHalfY = CANVAS.clientHeight / 2;
        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();

        this._initMouseEvents();
        this._initMysteryCube();
        this._initCubeEvents();
    }

    get isOpened() {
        return !!this._cube;
    }

    _initMouseEvents() {
        // updating mouse raycaster vector
        document.addEventListener('mousemove', (e) => {
            this._mouse.x = (e.clientX / CANVAS.clientWidth) * 2 - 1;
            this._mouse.y = -(e.clientY / CANVAS.clientHeight) * 2 + 1;
        });
    }

    _initMysteryCube() {
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

    _initCubeEvents() {
        // Pressing space should make the cube appear/flip sides
        let onKeyDown = (e) => {
            if (
                e.key === ' ' &&
                this.mysteryCube.position.distanceToSquared(
                    this._params.characterControlsProxy.position
                ) < 6000
            ) {
                this.transiting = true;
                document.removeEventListener('keydown', onKeyDown);
            }
        };

        // Release of any key close enough to the magic cube will make it appear
        let onAnyKeyUp = () => {
            if (
                this.mysteryCube.position.distanceToSquared(
                    this._params.characterControlsProxy.position
                ) < 6000
            ) {
                this.mysteryCube.visible = true;
                document.removeEventListener('keyup', onAnyKeyUp);
                document.addEventListener('keydown', onKeyDown);
            }
        };

        document.addEventListener('keyup', onAnyKeyUp);
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

    update(timeElapsed) {
        if (!this.transiting) return;
        else if (this._direction == 'expand' && this._expansionDistance < 7)
            this._updatePlanes(timeElapsed, 1);
        else if (this._direction == 'expand') this._flipMysteryCubeFaces(timeElapsed);
        else if (this._direction == 'shrink' && this._expansionDistance >= 0)
            this._updatePlanes(timeElapsed, -1);
        else {
            this.transiting = false;
            this._params.scene.remove(this.mysteryCube);
            this._createCube();
            document.addEventListener('mousedown', this._onHandleMouseDown.bind(this));
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

        document.addEventListener('dblclick', this._selectIframe.bind(this));
    }

    _selectIframe() {
        this._raycaster.setFromCamera(this._mouse, this._params.camera);
        const isIntersected = this._raycaster.intersectObject(this._cube);

        if (!isIntersected.length) return;

        const index = isIntersected[0].face.materialIndex;
        this._openIframe(this._faces[index]);
    }

    _openIframe(name) {
        closeFullscreen(); // canvas go out of full screen to see iframe if needed
        if (this?._selected) IFRAMES[this._selected].style.display = 'none';
        IFRAMES[name].style.display = 'block';
        this._selected = name;
        this._visited.add(name);
    }

    // clicking on the cube event
    _onHandleMouseDown(e) {
        this._raycaster.setFromCamera(this._mouse, this._params.camera);

        const isIntersected = this._raycaster.intersectObject(this._cube);
        if (!isIntersected.length) return;

        const mouseXOnMouseDown = e.clientX - this._canvasHalfX;
        const mouseYOnMouseDown = e.clientY - this._canvasHalfY;

        const callback = (event) => {
            this._onHandleMouseMove.call(this, event, mouseXOnMouseDown, mouseYOnMouseDown);
        };

        document.addEventListener('mousemove', callback);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', callback);
            document.removeEventListener('mouseup', callback);
            document.removeEventListener('mouseout', callback);
        });
        document.addEventListener('mouseout', () => {
            document.removeEventListener('mousemove', callback);
            document.removeEventListener('mouseup', callback);
            document.removeEventListener('mouseout', callback);
        });
    }

    // moving the mouse while clicked on the cube event
    _onHandleMouseMove(e, mouseXOnMouseDown, mouseYOnMouseDown) {
        const mouseX = e.clientX - this._canvasHalfX; // current mouse position
        const targetRotationX = (mouseX - mouseXOnMouseDown) * 0.001; // distance between mouse down and move on x

        const mouseY = e.clientY - this._canvasHalfY; // current mouse position
        const targetRotationY = (mouseY - mouseYOnMouseDown) * 0.001; // distance between mouse down and move on x

        // should probably be frame rate dependent but it runs in browsers
        // with fps caped to 60 so doesn't really matter...
        this._rotateAroundWorldAxis(this._cube, this._xAxis, targetRotationX);
        this._rotateAroundWorldAxis(this._cube, this._yAxis, targetRotationY);
    }

    // targetRotation is approximated to radians
    _rotateAroundWorldAxis(object, axis, radians) {
        this._rotationMatrix = new THREE.Matrix4(); /* TODO: improve that */
        this._rotationMatrix.makeRotationAxis(axis, radians);
        this._rotationMatrix.multiply(object.matrix);
        object.matrix = this._rotationMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }
}

export default MagicCube;
