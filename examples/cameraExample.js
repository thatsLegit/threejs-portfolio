import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

//it's the same scene as the light example to illustrate how cameras work

//About choosing near and far values, if you set near too close and far too far, 
//you could have "z fighting" where the GPU on your computer does not have enough 
//precision to decide which pixels are in front and which pixels are behind.
//  To fix it, it's possible to use logarithmicDepthBuffer, but it uses more resources
// const renderer = new THREE.WebGLRenderer({
//     canvas,
//     logarithmicDepthBuffer: true,
// });

function main() {
    const canvas = document.querySelector('#c');
    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');

    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    //cameras

    //perspective camera
    // const fov = 60;
    // const aspect = canvas.clientWidth / canvas.clientHeight;  // the canvas default
    // const near = 1;
    // const far = 50;
    // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // camera.position.set(0, 10, 20);

    //ortho camera (there's no "3d" with this type of camera because there's no perspective)
    const left = -1;
    const right = 1;
    const top = 1;
    const bottom = -1;
    const near = 1;
    const far = 50;
    const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera.zoom = 0.1;
    camera.position.set(0, 10, 20);

    const cameraHelper = new THREE.CameraHelper(camera);

    const controls = new OrbitControls(camera, view1Elem);
    controls.target.set(0, 5, 0);
    controls.update();

    //2nd, "observer" camera
    const camera2 = new THREE.PerspectiveCamera(
        60,  // fov: how tall near and far planes should be
        canvas.clientWidth / canvas.clientHeight,   // aspect: how wide near and far planes should be. You almost always want to set it to the client width/height ratio
        0.1, // near: close side of the frustrum
        300, // far: furthest side of the frustrum
    );
    camera2.position.set(40, 10, 30);
    camera2.lookAt(0, 5, 0);
    
    const controls2 = new OrbitControls(camera2, view2Elem);
    controls2.target.set(0, 5, 0);
    controls2.update();

    //the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    scene.add(cameraHelper);

    {
        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
    }
    {
        const cubeSize = 4;
        const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
        const mesh = new THREE.Mesh(cubeGeo, cubeMat);
        mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
        scene.add(mesh);
    }
    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
        scene.add(mesh);
    }
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    }

    //The WebGLRenderingContext.scissor() method of the WebGL API sets a scissor box, 
    //which limits the drawing to a specified rectangle.
    function setScissorForElement(elem) {
        const canvasRect = canvas.getBoundingClientRect(); //returns the size of an element and its position relative to the viewport.
        const elemRect = elem.getBoundingClientRect();
        
        // compute a canvas relative rectangle
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);
        
        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);
        
        // setup the scissor to only render to that part of the canvas
        const positiveYUpBottom = canvasRect.height - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);
        
        // return the aspect
        return width / height;
    }

    function render() {
        // turn on the scissor
        renderer.setScissorTest(true);

        // render the original view
        {
            const aspect = setScissorForElement(view1Elem);

            // adjust the camera for this aspect
            camera.aspect = aspect;
            // camera.left = -aspect;//for orthographic camera
            // camera.right = aspect;
            camera.updateProjectionMatrix(); //call it anytime cameras parameters change
            cameraHelper.update();

            // don't draw the camera helper in the original view
            cameraHelper.visible = false;

            scene.background.set(0x000000); //black

            // render
            renderer.render(scene, camera);
        }

        // render from the 2nd camera
        {
            const aspect = setScissorForElement(view2Elem);

            // adjust the camera for this aspect
            camera2.aspect = aspect;
            camera2.updateProjectionMatrix();

            // draw the camera helper in the 2nd view
            cameraHelper.visible = true;

            scene.background.set(0x000040); //blue

            renderer.render(scene, camera2);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();