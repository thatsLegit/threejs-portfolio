import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";

let soundAllowed = false;

const canvas = document.querySelector('#c'); //not really taking advantage of this elem in this example
const scene = new THREE.Scene();

//Define camera
let camera;
{
    const fov = 55;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 45;
    const far = 30000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
}

camera.position.set(-5000, -5000, -9000);

//Define renderer
let renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight, false);

//Create some lights
{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, 1, 1);
    scene.add(light);
}

{
    const color = 0xFFFFFF;
    const intensity = 0.3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, -1, -1);
    scene.add(light);
}

//Allows rotation around the camera position, limits zooming out
let controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 500;
controls.maxDistance = 1500;
controls.update();

let materials = [];

//Defining the skybox
const texture_ft = new THREE.TextureLoader().load('./penguins-skybox-pack/penguins (35)/torture_ft.jpg');
const texture_bk = new THREE.TextureLoader().load('./penguins-skybox-pack/penguins (35)/torture_bk.jpg');
const texture_up = new THREE.TextureLoader().load('./penguins-skybox-pack/penguins (35)/torture_up.jpg');
const texture_dn = new THREE.TextureLoader().load('./penguins-skybox-pack/penguins (35)/torture_dn.jpg');
const texture_rt = new THREE.TextureLoader().load('./penguins-skybox-pack/penguins (35)/torture_rt.jpg');
const texture_lf = new THREE.TextureLoader().load('./penguins-skybox-pack/penguins (35)/torture_lf.jpg');

materials.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
materials.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
materials.push(new THREE.MeshBasicMaterial({ map: texture_up }));
materials.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
materials.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
materials.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

for (const material of materials) material.side = THREE.BackSide;

const geometry = new THREE.BoxGeometry(10000, 10000, 10000);
const skybox = new THREE.Mesh(geometry, materials);

scene.add(skybox);

//Defining the central cube
const cubeGeo = new THREE.BoxGeometry(100, 100, 100);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 'white' });
const cube = new THREE.Mesh(cubeGeo, cubeMaterial);

scene.add(cube);

//Event listeners on the cube is clicked: detects if the cube in the scene is clicked on
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

window.addEventListener('click', onCubeClick);
window.addEventListener('mousemove', onMouseMove);

//Resize window listener
window.addEventListener('resize', onWindowResize);

//Start animation
animate();

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

//Handle mouse clicks on the cube
function onCubeClick(e) {
    raycaster.setFromCamera(mouse, camera);
    let isIntersected = raycaster.intersectObject(cube);
    if (isIntersected.length) {
        console.log('Mesh clicked!')
        if (!soundAllowed) makeSound();
    }
}

function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
}

//Handling responsiveness
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//Background sound
function makeSound() {
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // create a global audio source
    const sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('wind1.wav', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
        soundAllowed = true;
    });
}
