import * as THREE from "../node_modules/three/build/three.module.js";
import { SceneUtils } from "../node_modules/three/examples/jsm/utils/SceneUtils.js";


const canvas = document.querySelector('#c');

class MagicCube {
    constructor(params) {
        this._params = params;
        this._opened = false;
        this._transiting = false;
        this._Init();
    }

    _Init() {
        this._targetRotationX = 0.5;
        this._targetRotationOnMouseDownX = 0;
        this._targetRotationY = 0.2;
        this._targetRotationOnMouseDownY = 0;

        this._mouseX = 0;
        this._mouseXOnMouseDown = 0;
        this._mouseY = 0;
        this._mouseYOnMouseDown = 0;

        this._canvasHalfX = canvas.clientWidth / 2;
        this._canvasHalfY = canvas.clientHeight / 2;

        this._slowingFactor = 0.25;

        this._materials = [];

        this._CreateMysteryCube.call(this);
    }

    _CreateMysteryCube() {
        this._direction = 'expand';
        this._distance = 0;
        this._rotator = Math.PI;
        this._speed = 0.05;

        //multi-planes flipping cube container
        this._mysteryCube = new THREE.Object3D();

        //planes geometry
        const width = 20;
        const height = 20;
        const planeGeometry = new THREE.PlaneBufferGeometry(width, height);

        const mysteryTexture = new THREE.TextureLoader().load('../resources/interrogation.png');
        const plane1 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.FrontSide }),
            new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, side: THREE.BackSide } )
            // new THREE.MeshPhongMaterial({ map: armorTexture, side: THREE.BackSide })
        ]);
        const plane2 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, side: THREE.BackSide } )
            // new THREE.MeshPhongMaterial({ map: evilEyeTexture, side: THREE.FrontSide })
        ]);
        const plane3 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, side: THREE.BackSide } )
            // new THREE.MeshPhongMaterial({ map: itemsTexture, side: THREE.FrontSide })
        ]);
        const plane4 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.FrontSide }),
            new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, side: THREE.BackSide } )
            // new THREE.MeshPhongMaterial({ map: magicStarTexture, side: THREE.BackSide })
        ]);
        const plane5 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, side: THREE.BackSide } )
            // new THREE.MeshPhongMaterial({ map: magicTexture, side: THREE.FrontSide })
        ]);
        const plane6 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.FrontSide }),
            new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, side: THREE.BackSide } )
            // new THREE.MeshPhongMaterial({ map: scrollTexture, side: THREE.BackSide })
        ]);

        plane1.position.set(0, 0, 14); //red
        plane1.rotation.y = Math.PI / 4;

        plane2.position.set(-14, 0, 0); //blue
        plane2.rotation.y = Math.PI / 4;

        plane3.position.set(-14, 0, 14) //green
        plane3.rotation.y = Math.PI / 1.33;

        plane4.position.set(-7, 10, 7); //yellow
        plane4.rotation.x = - Math.PI / 2;
        plane4.rotation.z = Math.PI / 4;

        plane5.position.set(-7, -10, 7); //cyan
        plane5.rotation.x = - Math.PI / 2;
        plane5.rotation.z = Math.PI / 4;

        plane6.position.set(0, 0, 0); //white
        plane6.rotation.y = Math.PI / 1.33;

        this._containerComponents = [plane1, plane2, plane3, plane4, plane5, plane6];
        this._containerComponents.forEach(element => {
            this._mysteryCube.add(element);
        });

        this._mysteryCube.position.copy(this._params.position.add(new THREE.Vector3(5,0,0)));
        this._params.scene.add(this._mysteryCube);
    }

    _OpenBox() {
        const [plane1, plane2, plane3, plane4, plane5, plane6] = this._containerComponents;
        
        plane1.position.z += this._speed;
        plane1.position.x += this._speed;

        plane2.position.z -= this._speed;
        plane2.position.x -= this._speed;

        plane3.position.z += this._speed;
        plane3.position.x -= this._speed;

        plane4.position.y += this._speed;

        plane5.position.y -= this._speed;

        plane6.position.z -= this._speed;
        plane6.position.x += this._speed;

        this._distance += this._speed;
    }

    _FlipBoxSides() {
        const [plane1, plane2, plane3, plane4, plane5, plane6] = this._containerComponents;

        let rotation = this._rotator >= this._speed ? this._speed : this._rotator;

        plane1.rotation.y += rotation;
        plane2.rotation.y += rotation;
        plane3.rotation.y += rotation;
        plane4.rotation.x += rotation;
        plane5.rotation.x += rotation;
        plane6.rotation.y += rotation;

        this._rotator -= this._speed;

        if (this._rotator < 0) this._direction = 'shrink';
    }

    _ShrinkBox() {
        const [plane1, plane2, plane3, plane4, plane5, plane6] = this._containerComponents;

        plane1.position.z -= this._speed;
        plane1.position.x -= this._speed;

        plane2.position.z += this._speed;
        plane2.position.x += this._speed;

        plane3.position.z -= this._speed;
        plane3.position.x += this._speed;

        plane4.position.y -= this._speed;

        plane5.position.y += this._speed;

        plane6.position.z += this._speed;
        plane6.position.x -= this._speed;
        this._distance -= this._speed;

        if (this._distance < 0) {
            this._transiting = false;
            this._params.scene.remove(this._mysteryCube);
            this._CreateCube.call(this);
        }; //replace the mystery cube by the real one
    }

    _Transition() {
        if (this._direction == 'expand' && this._distance < 1) this._OpenBox(this._containerComponents);
        if (this._distance >= 1 && this._direction == 'expand') this._FlipBoxSides(this._containerComponents);
        if (this._direction == 'shrink') this._ShrinkBox(this._containerComponents);
    }

    _CreateCube() {
        for ( let i = 0; i < 6; i ++ ) {
            this._materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
        }

        this._cube = new THREE.Mesh(new THREE.BoxGeometry( 20, 20, 20 ), new THREE.MeshFaceMaterial(this._materials) );
        this._cube.position.copy(this._params.position.sub(new THREE.Vector3(5,0,0)));
        this._cube.overdraw = true;
        this._params.scene.add( this._cube );   

        this._opened = true;

        //raycasting to the cube
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        document.addEventListener('mousemove', e => {
            mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
            mouse.y = - (e.clientY / canvas.clientHeight) * 2 + 1;
        });

        //cube rotation
        let onCanvasMouseMove = e => {
            this._mouseX = e.clientX - this._canvasHalfX; //distance to half of the screen on x
            this._targetRotationX = ( this._mouseX - this._mouseXOnMouseDown ) * 0.001; //distance between mouse down and move on x

            this._mouseY = e.clientY - this._canvasHalfY;  //distance to half of the screen on y
            this._targetRotationY = ( this._mouseY - this._mouseYOnMouseDown ) * 0.001; //distance between mouse down and move on x
        }
        onCanvasMouseMove = onCanvasMouseMove.bind(this); //pre-assigning the same function to the var but with the this binding.

        let onCanvasMouseEnds = e => {
            document.removeEventListener( 'mousemove', onCanvasMouseMove);
            document.removeEventListener( 'mouseup', onCanvasMouseEnds);
            document.removeEventListener( 'mouseout', onCanvasMouseEnds);
        }
        onCanvasMouseEnds = onCanvasMouseEnds.bind(this); //pre-assigning the same function to the var but with the this binding.

        document.addEventListener('mousedown', onCanvasMouseDown.bind(this));

        function onCanvasMouseDown(e) {
            e.preventDefault(); // ?

            raycaster.setFromCamera(mouse, this._params.camera)
            let isIntersected = raycaster.intersectObject(this._cube);
            if (!isIntersected.length) return;

            document.addEventListener( 'mousemove', onCanvasMouseMove);
            document.addEventListener( 'mouseup', onCanvasMouseEnds);
            document.addEventListener( 'mouseout', onCanvasMouseEnds);

            this._mouseXOnMouseDown = e.clientX - this._canvasHalfX; //distance to half of the screen on x
            this._targetRotationOnMouseDownX = this._targetRotationX; //0.5

            this._mouseYOnMouseDown = e.clientY - this._canvasHalfY; //distance to half of the screen on y
            this._targetRotationOnMouseDownY = this._targetRotationY; //0.2
        }
    }

    _Update() {
        this._RotateAroundWorldAxis.call(this, this._cube, new THREE.Vector3(0, 1, 0), this._targetRotationX);
        this._RotateAroundWorldAxis.call(this, this._cube, new THREE.Vector3(1, 0, 0), this._targetRotationY);
        
        this._targetRotationY = this._targetRotationY * (1 - this._slowingFactor);
        this._targetRotationX = this._targetRotationX * (1 - this._slowingFactor);
    }

    //targetRotation is approximated to radians
    _RotateAroundWorldAxis(object, axis, radians) {
        let rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationAxis(axis.normalize(), radians);
        rotationMatrix.multiply(object.matrix);
        object.matrix = rotationMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }
}

export default MagicCube;