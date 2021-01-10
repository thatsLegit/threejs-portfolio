//It's an example on how to nest meshes
import * as THREE from "./node_modules/three/build/three.module.js";

// an array of objects whose rotation to update
const objects = [];

let scene, camera, renderer;

function init() {
    const canvas = document.querySelector('#c');
    scene = new THREE.Scene();

    {
        const fov = 50;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    }
    camera.position.set(50, 10, 50);
    // camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.PointLight(color, intensity);
        scene.add(light);
    }

    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    objects.push(solarSystem);

    // use just one sphere for everything
    const radius = 1;
    const widthSegments = 20;
    const heightSegments = 20;
    const sphereGeometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);

    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);  // make the sun large
    solarSystem.add(sunMesh);
    objects.push(sunMesh);

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 30;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);

    earthOrbit.add(earthMesh);
    objects.push(earthMesh);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(.5, .5, .5);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);

    // add an AxesHelper to each node
    // objects.forEach((node) => {
    //     const axes = new THREE.AxesHelper();
    //     axes.material.depthTest = false;
    //     axes.renderOrder = 1;
    //     node.add(axes);
    // });

    animate();
}

init();

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

function animate() {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
        obj.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}