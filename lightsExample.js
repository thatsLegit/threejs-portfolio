import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "./node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "./node_modules/three/examples/jsm/helpers/RectAreaLightHelper.js";

//lights slows down rendering, so try to use as few as possible.

//I also added into this file an example of shadow.
//rendering this type of shadows is more intensive as it add several renders, since these shadows are
//renderer from the light source and add a camera (orthographic) for each shadow.
function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  //RectAreaLightUniformsLib.init();
  renderer.physicallyCorrectLights = true; /* works with point and spot light */
  renderer.shadowMap.enabled = true; //added for the shadow example

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
  scene.background = new THREE.Color('black');

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
    mesh.receiveShadow = true; //added for the shadow example
    scene.add(mesh);
  }
  {
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshStandardMaterial({color: '#8AC'});
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    mesh.castShadow = true; //added for the shadow example
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshStandardMaterial({color: '#CA8'});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    mesh.castShadow = true; //added for the shadow example
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  {
    //very flat, just like brightness
    // const color = 0xFFFFFF;
    // const intensity = 1;
    // const light = new THREE.AmbientLight(color, intensity);
    // scene.add(light);

    //light from above and the ground
    // const skyColor = 0xB1E1FF;  // light blue
    // const groundColor = 0xB97A20;  // brownish orange
    // const intensity = 1;
    // const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    // scene.add(light);

    //light from one point
    // const color = 0xFFFFFF;
    // const intensity = 1;
    // const light = new THREE.DirectionalLight(color, intensity);
    // light.castShadow = true; //added for the shadow example
    // light.position.set(0, 10, 0);
    // light.target.position.set(-4, 0, -4);
    // scene.add(light);
    // scene.add(light.target);

    // light.shadow.camera.left = -10; //added for the shadow example
    // light.shadow.camera.right = 10;
    // light.shadow.camera.top = 10;
    // light.shadow.camera.bottom = -10;

    // //light helper, super useful
    // const helper = new THREE.DirectionalLightHelper(light);
    // scene.add(helper);

    // const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    // scene.add(cameraHelper);

    //sits at one point and shines in all directions
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.power = 2000;
    light.decay = 1.5;
    light.distance = Infinity;
    light.castShadow = true; //added for the shadow example. In spotlight, the shadow is controlled by the light itself
    light.shadow.mapSize.width = 1000; //default res of shadow is a 512x512 box, increasing it reduces performance
    light.shadow.mapSize.height = 1000;
    light.position.set(0, 15, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    //spotlight, shines like a conus towards a target
    // const color = 0xFFFFFF;
    // const intensity = 1;
    // const light = new THREE.SpotLight(color, intensity);
    // light.position.set(0, 10, 0);
    // light.target.position.set(-5, 0, 0);
    // light.castShadow = true; //added for the shadow example. In spotlight, the shadow is controlled by the light itself
    // scene.add(light);
    // scene.add(light.target);
    
    // const helper = new THREE.SpotLightHelper(light);
    // scene.add(helper);

    //rectangular light looks like a neon, works only with MeshStandardMaterial
    //also, rect light automatically 
    // const color = 0xFFFFFF;
    // const intensity = 5;
    // const width = 12;
    // const height = 4;
    // const light = new THREE.RectAreaLight(color, intensity, width, height);
    // light.position.set(0, 10, 0);
    // light.rotation.x = THREE.MathUtils.degToRad(-90);
    // scene.add(light);
    
    // const helper = new RectAreaLightHelper(light);
    // light.add(helper);
  }

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();