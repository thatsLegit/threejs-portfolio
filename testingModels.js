import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from './node_modules/three/examples/jsm/loaders/FBXLoader.js';
import {SkeletonUtils} from './node_modules/three/examples/jsm/utils/SkeletonUtils.js';
import {OBJLoader2} from './node_modules/three/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from './node_modules/three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'


function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const fov = 45;
    const aspect = 2;  // the canvas default
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
        light.position.set(-250, 800, -850);
        light.target.position.set(-550, 40, -450);
    
        light.shadow.bias = -0.004;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
    
        scene.add(light);
        scene.add(light.target);
        const cam = light.shadow.camera;
        cam.near = 1;
        cam.far = 2000;
        cam.left = -1500;
        cam.right = 1500;
        cam.top = 1500;
        cam.bottom = -1500;
    }

    function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
        const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
        const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
        // compute a unit vector that points in the direction the camera is now
        // in the xz plane from the center of the box
        const direction = (new THREE.Vector3())
            .subVectors(camera.position, boxCenter)
            .multiply(new THREE.Vector3(1, 0, 1))
            .normalize();

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

    //also giving the position of each element of the scenegraph
    function dumpVec3(v3, precision = 3) {
        return `${v3.x.toFixed(precision)}, ${v3.y.toFixed(precision)}, ${v3.z.toFixed(precision)}`;
    }
    
    //scans the scenegraph of an imported model
    function dumpObject(obj, lines = [], isLast = true, prefix = '') {
        const localPrefix = isLast ? '└─' : '├─';
        lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
        const dataPrefix = obj.children.length
            ? (isLast ? '  │ ' : '│ │ ')
            : (isLast ? '    ' : '│   ');
        lines.push(`${prefix}${dataPrefix}  pos: ${dumpVec3(obj.position)}`);
        lines.push(`${prefix}${dataPrefix}  rot: ${dumpVec3(obj.rotation)}`);
        lines.push(`${prefix}${dataPrefix}  scl: ${dumpVec3(obj.scale)}`);
        const newPrefix = prefix + (isLast ? '  ' : '│ ');
        const lastNdx = obj.children.length - 1;
        obj.children.forEach((child, ndx) => {
            const isLast = ndx === lastNdx;
            dumpObject(child, lines, isLast, newPrefix);
        });
        return lines;
    }

    {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('./resources/blender_models/platform/scene.gltf', (gltf) => {
            const root = gltf.scene; //tree-like structure
            scene.add(root);
            console.log(dumpObject(root).join('\n'));

            //adding shadows to every element in the scene
            root.traverse((obj) => {
                if (obj.castShadow !== undefined) {
                  obj.castShadow = true;
                  obj.receiveShadow = true;
                }
            });

            // compute the box that contains all the stuff
            // from root and below
            const box = new THREE.Box3().setFromObject(root);

            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());

            // set the camera to frame the box
            frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

            // update the Trackball controls to handle the new size
            controls.maxDistance = boxSize * 10;
            controls.target.copy(boxCenter);
            controls.update();
        });
    }

    function render(time) {
        time *= 0.001;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

  requestAnimationFrame(render);
}

main();
