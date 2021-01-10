import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import {OBJLoader2} from './node_modules/three/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from './node_modules/three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const fov = 45;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lightblue');

    {
        const planeSize = 4000;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('./mayhem/afterrain_dn.jpg');

        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
    }

    {
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }

    const seagullOrbit = new THREE.Object3D();
    scene.add(seagullOrbit);

    {
        function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
            //we use trigonometry (sohcahtoa) to determine the distance to the center of the object
            const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
            const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
            const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

            // compute a unit vector that points in the direction the camera is now
            // in the xz plane from the center of the box
            // const direction = new THREE.Vector3().subVectors(camera.position, boxCenter).normalize();
            const direction = new THREE.Vector3().subVectors(camera.position, boxCenter).multiply(new THREE.Vector3(1, 0, 1)).normalize();

            // move the camera to a position distance units way from the center
            // in whatever direction the camera was from the center already
            camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

            // pick some near and far values for the frustum that
            // will contain the box.
            camera.near = boxSize / 100;
            camera.far = boxSize * 100;

            camera.updateProjectionMatrix();

            // point the camera to look at the center of the box
            camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
        }

        const mtlLoader = new MTLLoader();
        mtlLoader.load('./blender_models/seagull/seagull-low-poly.mtl', (mtlParseResult) => {
            const objLoader = new OBJLoader2();
            const materials =  MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
            objLoader.addMaterials(materials);
            objLoader.load('./blender_models/seagull/seagull-low-poly.obj', (root) => {
                root.position.set(200, 1200, 0);
                seagullOrbit.add(root);
            });
        });
        mtlLoader.load('./blender_models/windmill/windmill.mtl', (mtlParseResult) => {
            const objLoader = new OBJLoader2();
            const materials =  MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
            objLoader.addMaterials(materials);
            objLoader.load('./blender_models/windmill/windmill.obj', (root) => {
                scene.add(root);
                // compute the box that contains all the stuff from root and below
                const box = new THREE.Box3().setFromObject(root);
                const boxSize = box.getSize(new THREE.Vector3()).length();
                const boxCenter = box.getCenter(new THREE.Vector3());
                console.log(boxSize, boxCenter);

                // set the camera to frame the box
                frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

                // update the Trackball controls to handle the new size
                controls.maxDistance = boxSize * 10;
                controls.target.copy(boxCenter);
                controls.update();
            });
        });
    }

    function render() {
        seagullOrbit.rotation.y -= 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();


// Loading models often runs into these kinds of issues. Common issues include:

// Needing to know the size

// Above we made the camera try to frame the scene but that's not always the appropriate thing to do. Generally the most appropriate thing to do is to make your own models or download the models, load them up in some 3D software and look at their scale and adjust if need be.

// Orientation Wrong

// THREE.js is generally Y = up. Some modeling packages default to Z = up, some Y = up. Some are settable. If you run into this case where you load a model and it's on its side. You can either hack your code to rotate the model after loading (not recommended), or you can load the model into your favorite modeling package or use some command line tools to rotate the object in the orientation you need it to be just like you'd edit an image for your website rather than download it and apply code to adjust it. Blender even has options when you export to change the orientation.

// No .MTL file or wrong materials or incompatible parameters

// Above we used a .MTL file above which helped us load materials but there were issues. We manually edited the .MTL file to fix. It's also common to look inside the .OBJ file to see what materials there are, or to load the .OBJ file in THREE.js and walk the scene and print out all the materials. Then, go modify the code to make custom materials and assign them where appropriate either by making a name/material pair object to pass to the loader instead of loading the .MTL file, OR, after the scene has loaded, walking the scene and fixing things.

// Textures too large

// Most 3D models are made for either architecture, movies and commercials, or games. For architecture and movies no one really cares about the size of the textures since. For games people care because games have limited memory but most games run locally. Webpages though you want to load as fast as possible and so you need to look at the textures and try to make them as small as possible and still look good. In fact the first windmill we should arguably done something about the textures. They are currently a total of 10meg!!!

// Also remember like we mentioned in the article on textures that textures take memory so a 50k JPG that expands to 4096x4096 will download fast but still take a ton of memory.
