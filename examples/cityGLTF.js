import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

//the frameArea function is reused from the OBJ example

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;

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
        light.castShadow = true;
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
    
        const cameraHelper = new THREE.CameraHelper(cam);
        scene.add(cameraHelper);
        cameraHelper.visible = false;
        const helper = new THREE.DirectionalLightHelper(light, 100);
        scene.add(helper);
        helper.visible = false;
    }

    //builds a box to frame correctly the camera whatever is the model
    //this is not the only way of doing it, it's not even the best solution actually, the best
    //is probably to just modify it in blender directly.
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

    const cars = [];
    {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf', (gltf) => {
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
            
            // cars = root.getObjectByName('Cars'); /* simpliest way to load cars but with different types of cars we need individual settings */
            const loadedCars = root.getObjectByName('Cars');

            const fixes = [
                { prefix: 'Car_08', y: 0, rot: [Math.PI * .5, 0, Math.PI * .5] },
                { prefix: 'CAR_03', y: 33, rot: [0, Math.PI, 0] },
                { prefix: 'Car_04', y: 40, rot: [0, Math.PI, 0] }
            ];

            root.updateMatrixWorld(); /* don't know about this line but everything works without it. */
            for (const car of [...loadedCars.children]) {
                const fix = fixes.find(fix => car.name.startsWith(fix.prefix));
                const obj = new THREE.Object3D();
                car.position.set(0, fix.y, 0);
                car.rotation.set(...fix.rot);
                obj.add(car);
                scene.add(obj);
                cars.push(obj);
            }

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

    //Attempt to make the cars "drive" on the road. To do that, we needed to extract the data about the road
    //in blender from the original model. We got a list a points that we can use to draw a line. 
    ///Then, as we did in the tankSystem model, we can make the models "move" along the curve.

    //at first, the path appeared way to small, we discovered that the Cars node has been scaled and rotated,
    //but this doesn't appear on the .gltf file which indicates that it might have been filtered during export,
    //but anyway it didn't work as is.

    //It's good to have the original .blend file so it's possible to remove any scales, rotations and then only
    //export it. 

    //Also, in this precise scene, the 4 top layers are a waste, ideally we could have just deleted it.
    let curve;
    let curveObject;
    {
        const controlPoints = [
            [1.118281, 5.115846, -3.681386],
            [3.948875, 5.115846, -3.641834],
            [3.960072, 5.115846, -0.240352],
            [3.985447, 5.115846, 4.585005],
            [-3.793631, 5.115846, 4.585006],
            [-3.826839, 5.115846, -14.736200],
            [-14.542292, 5.115846, -14.765865],
            [-14.520929, 5.115846, -3.627002],
            [-5.452815, 5.115846, -3.634418],
            [-5.467251, 5.115846, 4.549161],
            [-13.266233, 5.115846, 4.567083],
            [-13.250067, 5.115846, -13.499271],
            [4.081842, 5.115846, -13.435463],
            [4.125436, 5.115846, -5.334928],
            [-14.521364, 5.115846, -5.239871],
            [-14.510466, 5.115846, 5.486727],
            [5.745666, 5.115846, 5.510492],
            [5.787942, 5.115846, -14.728308],
            [-5.423720, 5.115846, -14.761919],
            [-5.373599, 5.115846, -3.704133],
            [1.004861, 5.115846, -3.641834],
        ];
        const p0 = new THREE.Vector3();
        const p1 = new THREE.Vector3();
        curve = new THREE.CatmullRomCurve3(
            controlPoints.map((p, ndx) => {
                p0.set(...p);
                p1.set(...controlPoints[(ndx + 1) % controlPoints.length]);
                return [
                    new THREE.Vector3().copy(p0),
                    new THREE.Vector3().lerpVectors(p0, p1, 0.1),
                    new THREE.Vector3().lerpVectors(p0, p1, 0.9),
                ];
            }).flat(),
            true,
        );
        {
            const points = curve.getPoints(250);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({color: 0xff0000});
            curveObject = new THREE.Line(geometry, material); //3dvector
            curveObject.scale.set(100, 100, 100); //randomly found values that worked...
            curveObject.position.y = -621;
            curveObject.visible = false;
            material.depthTest = false; //necessary to make the curve "appear"
            curveObject.renderOrder = 1;
            scene.add(curveObject);
        }
    }

    // console.log('curve: ', curve);
    // console.log('curveObject: ', curveObject);

    // create 2 Vector3s we can use for path calculations
    const carPosition = new THREE.Vector3();
    const carTarget = new THREE.Vector3();

    function render(time) {
        time *= 0.001;

        const pathTime = time * .01;
        const targetOffset = 0.01;
        cars.forEach((car, ndx) => {
            // a number between 0 and 1 to evenly space the cars
            const u = pathTime + ndx / cars.length;
        
            // get the first point
            curve.getPointAt(u % 1, carPosition);
            carPosition.applyMatrix4(curveObject.matrixWorld);
        
            // get a second point slightly further down the curve
            curve.getPointAt((u + targetOffset) % 1, carTarget);
            carTarget.applyMatrix4(curveObject.matrixWorld);
        
            // put the car at the first point (temporarily)
            car.position.copy(carPosition);
            // point the car the second point
            car.lookAt(carTarget);
        
            // put the car between the 2 points
            car.position.lerpVectors(carPosition, carTarget, 0.5);
        });

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

  requestAnimationFrame(render);
}

main();
