//Another more sophisticated example of nesting 3Dobjects, with multiple
//levels of nesting, cameras and movement.

import * as THREE from "./node_modules/three/build/three.module.js"

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });

    //settig a bg color and enabling shadows
    renderer.setClearColor(0xAAAAAA);
    renderer.shadowMap.enabled = true;

    function makeCamera(fov = 40) {
        const aspect = canvas.clientWidth / canvas.clientHeight;  // the canvas default
        const zNear = 0.1;
        const zFar = 1000;
        return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
    }

    //Main camera of the scene
    const camera = makeCamera();
    camera.position.set(8, 10, 20).multiplyScalar(3);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    //Light of the scene
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 20, 0);
        scene.add(light);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;

        const d = 50;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 50;
        light.shadow.bias = 0.001;
    }

    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 2, 4);
        scene.add(light);
    }

    //Ground
    const groundGeometry = new THREE.PlaneBufferGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = Math.PI * -.5;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    const carWidth = 4;
    const carHeight = 1;
    const carLength = 8;

    //Tank
    const tank = new THREE.Object3D();
    scene.add(tank);

    //Tank's body and its camera
    const bodyGeometry = new THREE.BoxBufferGeometry(carWidth, carHeight, carLength);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 'red' });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 1.4;
    bodyMesh.castShadow = true;
    tank.add(bodyMesh);

    const tankCameraFov = 75;
    const tankCamera = makeCamera(tankCameraFov);
    tankCamera.position.y = 3;
    tankCamera.position.z = -6;
    tankCamera.rotation.y = Math.PI;
    bodyMesh.add(tankCamera);

    const axes = new THREE.AxesHelper(20); //! X
    axes.material.depthTest = false; //* Y
    axes.renderOrder = 1; //? Z
    groundMesh.add(axes);

    //Body's wheels
    const wheelRadius = 1;
    const wheelThickness = .5;
    const wheelSegments = 10;
    const wheelGeometry = new THREE.CylinderBufferGeometry(
        wheelRadius,     // top radius
        wheelRadius,     // bottom radius
        wheelThickness,  // height of cylinder
        wheelSegments);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    //The position of each wheel is relative to the parent: bodyMesh
    const wheelPositions = [ //[x, y, z]
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
        [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
        [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
        [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
    ];
    const wheelMeshes = wheelPositions.map((position) => {
        const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        mesh.position.set(...position);
        mesh.rotation.z = Math.PI * .5;
        mesh.castShadow = true;
        bodyMesh.add(mesh);
        return mesh;
    });

    //Body's dome
    const domeRadius = 2;
    const domeWidthSubdivisions = 12;
    const domeHeightSubdivisions = 12;
    const domePhiStart = 0;
    const domePhiEnd = Math.PI * 2;
    const domeThetaStart = 0;
    const domeThetaEnd = Math.PI * .5;
    const domeGeometry = new THREE.SphereBufferGeometry(
        domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
        domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);
    const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
    domeMesh.castShadow = true;
    bodyMesh.add(domeMesh);
    domeMesh.position.y = .5;

    //Body's turret ecosystem (turretMesh, pivot and camera)
    const turretWidth = .1;
    const turretHeight = .1;
    const turretLength = carLength * .75 * .2;
    const turretGeometry = new THREE.BoxBufferGeometry( //could have been a cylinder
        turretWidth, turretHeight, turretLength);
    const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
    const turretPivot = new THREE.Object3D();
    turretMesh.castShadow = true;
    turretMesh.position.z = turretLength * .5;
    turretPivot.scale.set(5, 5, 5);
    turretPivot.position.y = .5;
    turretPivot.add(turretMesh);
    bodyMesh.add(turretPivot);

    const turretCamera = makeCamera();
    turretCamera.position.y = .75 * .2;
    turretMesh.add(turretCamera);

    //Target
    const targetOrbit = new THREE.Object3D();
    const targetElevation = new THREE.Object3D();
    const targetBob = new THREE.Object3D();

    const targetGeometry = new THREE.SphereBufferGeometry(.5, 6, 3);
    const targetMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00, flatShading: true });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    targetMesh.castShadow = true;
    scene.add(targetOrbit);
    targetOrbit.add(targetElevation);
    targetElevation.position.z = carLength * 2;
    targetElevation.position.y = 8;
    targetElevation.add(targetBob);
    targetBob.add(targetMesh);

    const targetCamera = makeCamera();
    const targetCameraPivot = new THREE.Object3D();
    targetCamera.position.y = 1;
    targetCamera.position.z = -2;
    targetCamera.rotation.y = Math.PI;
    targetBob.add(targetCameraPivot);
    targetCameraPivot.add(targetCamera);

    // Create a sine-like wave on the ground
    const curve = new THREE.SplineCurve([
        new THREE.Vector2(-10, 0),
        new THREE.Vector2(-5, 5),
        new THREE.Vector2(0, 0),
        new THREE.Vector2(5, -5),
        new THREE.Vector2(10, 0),
        new THREE.Vector2(5, 10),
        new THREE.Vector2(-5, 10),
        new THREE.Vector2(-10, -10),
        new THREE.Vector2(-15, -8),
        new THREE.Vector2(-10, 0),
    ]);

    //We basically create a custom 2d object, which is a line from a few 
    //points that we randomly assign in the beginnig.
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const splineObject = new THREE.Line(geometry, material);
    splineObject.rotation.x = Math.PI * .5;
    splineObject.position.y = 0.05;
    scene.add(splineObject);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    const targetPosition = new THREE.Vector3();
    const tankPosition = new THREE.Vector2();
    const tankTarget = new THREE.Vector2();

    const cameras = [
        { cam: camera, desc: 'detached camera', },
        { cam: turretCamera, desc: 'on turret looking at target', },
        { cam: targetCamera, desc: 'near target looking at tank', },
        { cam: tankCamera, desc: 'above back of tank', }
    ];

    const infoElem = document.querySelector('#info');

    function animate(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            cameras.forEach((cameraInfo) => {
                const camera = cameraInfo.cam;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            });
        }

        // move target
        targetOrbit.rotation.y = time * .27;
        targetBob.position.y = Math.sin(time * 2) * 4;
        targetMesh.rotation.x = time * 7;
        targetMesh.rotation.y = time * 13;
        targetMaterial.emissive.setHSL(time * 10 % 1, 1, .25); //light color
        targetMaterial.color.setHSL(time * 10 % 1, 1, .25); //target mesh color

        // move tank
        // time => curve point => update tankPosition => update tank.position
        const tankTime = time * .05;
        curve.getPointAt(tankTime % 1, tankPosition); //tankTime must be in range [0, 1]
        curve.getPointAt((tankTime + 0.01) % 1, tankTarget); //getPointAt returns the corresponding point (1 of the 50 derived from the 10 initial points)
        tank.position.set(tankPosition.x, 0, tankPosition.y); //x, y, z
        tank.lookAt(tankTarget.x, 0, tankTarget.y);
        //I don't exactly get why y is always set to 0 here but z not, maybe
        //it's because of the rotation of the ground.

        // face turret at target
        targetMesh.getWorldPosition(targetPosition); //Object3D method, copies into targetPosition the Vector of the position of targetMesh
        turretPivot.lookAt(targetPosition);

        // make the turretCamera look at target
        turretCamera.lookAt(targetPosition);

        // make the targetCameraPivot look at the at the tank
        tank.getWorldPosition(targetPosition); //switch targetPosition to the tank's position to make the target camera look at the tank.
        targetCameraPivot.lookAt(targetPosition);

        wheelMeshes.forEach((obj) => {
            obj.rotation.x = time * 3;
        });

        const camera = cameras[time * .25 % cameras.length | 0];
        infoElem.textContent = camera.desc;

        renderer.render(scene, camera.cam);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

main();
