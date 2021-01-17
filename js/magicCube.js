import * as THREE from "../node_modules/three/build/three.module.js";


const canvas = document.querySelector('#c');

class MagicCube {
    constructor(params) {
        this._params = params;
        this._opened = true;
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

        this._CreateCube.call(this);
    }

    _CreateCube() {
        for ( let i = 0; i < 6; i ++ ) {
            this._materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
        }

        this._cube = new THREE.Mesh(new THREE.BoxGeometry( 20, 20, 20 ), new THREE.MeshFaceMaterial(this._materials) );
        this._cube.position.copy(this._params.position);
        this._cube.overdraw = true;
        this._params.scene.add( this._cube );   

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
            this._targetRotationX = ( this._mouseX - this._mouseXOnMouseDown ) * 0.00025; //distance between mouse down and move on x

            this._mouseY = e.clientY - this._canvasHalfY;  //distance to half of the screen on y
            this._targetRotationY = ( this._mouseY - this._mouseYOnMouseDown ) * 0.00025; //distance between mouse down and move on x
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