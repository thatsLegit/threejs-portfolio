import * as THREE from "three";
import { SceneUtils } from "../utils/SceneUtils";


const canvas = document.querySelector('#c');
const iframes = {
    cv: document.querySelector('#cv'),
    aboutMe: document.querySelector('#aboutMe'),
    hireMe: document.querySelector('#hireMe'),
    skills: document.querySelector('#skills'),
    projects: document.querySelector('#projects'),
    smallGames: document.querySelector('#smallGames')
};

class MagicCube {
    constructor(params) {
        this._params = params;
        this._opened = false;
        this._transiting = false;
        this._faces = { //detect clicks on the faces of the cube (represented by two right triangles)
            aboutMe: [{a: 2, b: 3, c: 1}, {a: 0, b: 2, c: 1}],
            hireMe: [{a: 7, b: 2, c: 0}, {a: 5, b: 7, c: 0}],
            skills: [{a: 6, b: 3, c: 2}, {a: 7, b: 6, c: 2}],
            projects: [{a: 6, b: 7, c: 5}, {a: 4, b: 6, c: 5}],
            cv: [{a: 5, b: 0, c: 1}, {a: 4, b: 5, c: 1}],
            smallGames: [{a: 3, b: 6, c: 4}, {a: 1, b: 3, c: 4}]
        }
        this._visited = new Set();
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

        const plane1 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: this._params.textures.interrogation.texture, side: THREE.FrontSide }),
            new THREE.MeshBasicMaterial( { map: this._params.textures.aboutMe.texture, side: THREE.BackSide } )
        ]);
        const plane2 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: this._params.textures.interrogation.texture, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial( { map: this._params.textures.projects.texture, side: THREE.BackSide } )
        ]);
        const plane3 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: this._params.textures.interrogation.texture, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial( { map: this._params.textures.cv.texture, side: THREE.BackSide } )
        ]);
        const plane4 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: this._params.textures.interrogation.texture, side: THREE.FrontSide }),
            new THREE.MeshBasicMaterial( { map: this._params.textures.skills.texture, side: THREE.BackSide } )
        ]);
        const plane5 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: this._params.textures.interrogation.texture, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial( { map: this._params.textures.hireMe.texture, side: THREE.BackSide } )
        ]);
        const plane6 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: this._params.textures.interrogation.texture, side: THREE.FrontSide }),
            new THREE.MeshBasicMaterial( { map: this._params.textures.smallGames.texture, side: THREE.BackSide } )
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
        //ensures that materials are always placed in the same way on the cube
        this._materials.push( new THREE.MeshBasicMaterial( { map: this._params.textures.aboutMe.texture } ) );
        this._materials.push( new THREE.MeshBasicMaterial( { map: this._params.textures.projects.texture } ) );
        this._materials.push( new THREE.MeshBasicMaterial( { map: this._params.textures.cv.texture } ) );
        this._materials.push( new THREE.MeshBasicMaterial( { map: this._params.textures.skills.texture } ) );
        this._materials.push( new THREE.MeshBasicMaterial( { map: this._params.textures.hireMe.texture } ) );
        this._materials.push( new THREE.MeshBasicMaterial( { map: this._params.textures.smallGames.texture } ) );

        this._cube = new THREE.Mesh(new THREE.BoxGeometry( 20, 20, 20 ), new THREE.MeshFaceMaterial(this._materials) );
        this._cube.position.copy(this._params.position.sub(new THREE.Vector3(5,0,0)));
        this._cube.overdraw = true;
        this._params.scene.add( this._cube );   

        this._opened = true;

        //raycasting to the cube
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        // select a face of the cube
        document.addEventListener('dblclick', e => OnDoubleClick.call(this, e));
        function OnDoubleClick(e) {
            //checking which face is clicked on
            raycaster.setFromCamera(mouse, this._params.camera)
            const isIntersected = raycaster.intersectObject(this._cube);
            if (!isIntersected.length) return;

            const {face: {a, b, c}} = isIntersected[0];
            const obj = {a,b,c};

            if (JSON.stringify(obj) == JSON.stringify(this._faces.aboutMe[0]) || JSON.stringify(obj) == JSON.stringify(this._faces.aboutMe[1])) openIframe.call(this, 'aboutMe');
            if (JSON.stringify(obj) == JSON.stringify(this._faces.hireMe[0]) || JSON.stringify(obj) == JSON.stringify(this._faces.hireMe[1])) openIframe.call(this, 'hireMe');
            if (JSON.stringify(obj) == JSON.stringify(this._faces.skills[0]) || JSON.stringify(obj) == JSON.stringify(this._faces.skills[1])) openIframe.call(this, 'skills');
            if (JSON.stringify(obj) == JSON.stringify(this._faces.projects[0]) || JSON.stringify(obj) == JSON.stringify(this._faces.projects[1])) openIframe.call(this, 'projects');
            if (JSON.stringify(obj) == JSON.stringify(this._faces.cv[0]) || JSON.stringify(obj) == JSON.stringify(this._faces.cv[1])) openIframe.call(this, 'cv');
            if (JSON.stringify(obj) == JSON.stringify(this._faces.smallGames[0]) || JSON.stringify(obj) == JSON.stringify(this._faces.smallGames[1])) openIframe.call(this, 'smallGames');

            function openIframe(name) {
                this?._selected && (iframes[this._selected].style.display = 'none');
                iframes[name].style.display = 'block';
                this._selected = name;
                this._visited.add(name);
            }
        }

        //updating mouse raycaster vector
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