import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { SceneUtils } from "../node_modules/three/examples/jsm/utils/SceneUtils.js";

//textures slows down rendering, so try to reduce the dimensions and size

function main() {
    let open = false, //box opening state
        direction = 'expand',
        distance = 0,
        rotator = Math.PI;
    const speed = 0.05;

    //creating a canvas element is not mandatory as the renderer will create one if there is not
    //but this allows more flexibility.
    const canvas = document.querySelector('#c');
    const scene = new THREE.Scene();

    //unique camera of the scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(0, 0, 20);
    camera.lookAt(0,0,0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    //light
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);

    //textures
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    const armorTexture = loader.load('../resources/12-medieval-signs/armor.png');
    const evilEyeTexture = loader.load('../resources/12-medieval-signs/evil-eye.png');
    const itemsTexture = loader.load('../resources/12-medieval-signs/items.png');
    const magicTexture = loader.load('../resources/12-medieval-signs/magic.png');
    const magicStarTexture = loader.load('../resources/12-medieval-signs/magic-star.png');
    const scrollTexture = loader.load('../resources/12-medieval-signs/scroll.png');
    const mysteryTexture = loader.load('../resources/interrogation.png');

    const loadingElem = document.querySelector('#loading');
    const progressBarElem = loadingElem.querySelector('.progressbar');
    
    loadManager.onLoad = () => loadingElem.style.display = 'none';
    
    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
        const progress = itemsLoaded / itemsTotal;
        progressBarElem.style.transform = `scaleX(${progress})`;
    };

    //multi-planes flipping cube container
    let containerComponents = [];
    const container = new THREE.Object3D();

    //planes geometry
    const width = 5.6;
    const height = 5.6;
    const planeGeometry = new THREE.PlaneBufferGeometry(width, height);
    
    /* const plane1 = SceneUtils.createMultiMaterialObject(planeGeometry, [
        new THREE.MeshPhongMaterial({ color: 'red', side: THREE.FrontSide }),
        new THREE.MeshPhongMaterial({ color: 'red', side: THREE.BackSide })
    ]);
    const plane2 = SceneUtils.createMultiMaterialObject(planeGeometry, [
        new THREE.MeshPhongMaterial({ color: 'blue', side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ color: 'blue', side: THREE.FrontSide })
    ]);
    const plane3 = SceneUtils.createMultiMaterialObject(planeGeometry, [
        new THREE.MeshPhongMaterial({ color: 'green', side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ color: 'green', side: THREE.FrontSide })
    ]);
    const plane4 = SceneUtils.createMultiMaterialObject(planeGeometry, [
        new THREE.MeshPhongMaterial({ color: 'yellow', side: THREE.FrontSide }),
        new THREE.MeshPhongMaterial({ color: 'yellow', side: THREE.BackSide })
    ]);
    const plane5 = SceneUtils.createMultiMaterialObject(planeGeometry, [
        new THREE.MeshPhongMaterial({ color: 'cyan', side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ color: 'cyan', side: THREE.FrontSide })
    ]);
    const plane6 = SceneUtils.createMultiMaterialObject(planeGeometry, [
        new THREE.MeshPhongMaterial({ color: 'white', side: THREE.FrontSide }),
        new THREE.MeshPhongMaterial({ color: 'white', side: THREE.BackSide })
    ]); */

    {
        const plane1 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.FrontSide }),
            new THREE.MeshPhongMaterial({ map: armorTexture, side: THREE.BackSide })
        ]);
        const plane2 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.BackSide }),
            new THREE.MeshPhongMaterial({ map: evilEyeTexture, side: THREE.FrontSide })
        ]);
        const plane3 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.BackSide }),
            new THREE.MeshPhongMaterial({ map: itemsTexture, side: THREE.FrontSide })
        ]);
        const plane4 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.FrontSide }),
            new THREE.MeshPhongMaterial({ map: magicStarTexture, side: THREE.BackSide })
        ]);
        const plane5 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.BackSide }),
            new THREE.MeshPhongMaterial({ map: magicTexture, side: THREE.FrontSide })
        ]);
        const plane6 = SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshPhongMaterial({ map: mysteryTexture, side: THREE.FrontSide }),
            new THREE.MeshPhongMaterial({ map: scrollTexture, side: THREE.BackSide })
        ]);

        plane1.position.set(0, 0, 4); //red
        plane1.rotation.y = Math.PI / 4;

        plane2.position.set(-4, 0, 0); //blue
        plane2.rotation.y = Math.PI / 4;

        plane3.position.set(-4, 0, 4) //green
        plane3.rotation.y = Math.PI / 1.33;

        plane4.position.set(-2, 2.8, 2); //yellow
        plane4.rotation.x = - Math.PI / 2;
        plane4.rotation.z = Math.PI / 4;

        plane5.position.set(-2, -2.8, 2); //cyan
        plane5.rotation.x = - Math.PI / 2;
        plane5.rotation.z = Math.PI / 4;

        plane6.position.set(0, 0, 0); //white
        plane6.rotation.y = Math.PI / 1.33;

        containerComponents = [plane1, plane2, plane3, plane4, plane5, plane6];
        containerComponents.forEach(element => {
            container.add(element);
        });

        scene.add(container);
    }

    //axes helper
    // const axes = new THREE.AxesHelper(10);
    // axes.material.depthTest = false;
    // axes.renderOrder = 1;
    // container.add(axes);

    //Event listeners on the cube is clicked: detects if the cube in the scene is clicked on
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    window.addEventListener('dblclick', e => {
        raycaster.setFromCamera(mouse, camera);
        let target = [];
        containerComponents.forEach(element => {
            target = [...target, ...element.children];
        });
        let isIntersected = raycaster.intersectObjects(target);
        if (isIntersected.length && rotator > 0) open = true;
    });

    window.addEventListener('mousemove', e => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    });

    function openBox(containerObj) {
        const [plane1, plane2, plane3, plane4, plane5, plane6] = containerObj;
        
        plane1.position.z += speed;
        plane1.position.x += speed;

        plane2.position.z -= speed;
        plane2.position.x -= speed;

        plane3.position.z += speed;
        plane3.position.x -= speed;

        plane4.position.y += speed;

        plane5.position.y -= speed;

        plane6.position.z -= speed;
        plane6.position.x += speed;

        distance += speed;
    }

    function flipBoxSides(containerObj) {
        const [plane1, plane2, plane3, plane4, plane5, plane6] = containerObj;

        let rotation = rotator >= speed ? speed : rotator;

        plane1.rotation.y += rotation;
        plane2.rotation.y += rotation;
        plane3.rotation.y += rotation;
        plane4.rotation.x += rotation;
        plane5.rotation.x += rotation;
        plane6.rotation.y += rotation;

        rotator -= speed;

        if (rotator < 0) direction = 'shrink';
    }

    function shrinkBox(containerObj) {
        const [plane1, plane2, plane3, plane4, plane5, plane6] = containerObj;

        plane1.position.z -= speed;
        plane1.position.x -= speed;

        plane2.position.z += speed;
        plane2.position.x += speed;

        plane3.position.z -= speed;
        plane3.position.x += speed;

        plane4.position.y -= speed;

        plane5.position.y += speed;

        plane6.position.z += speed;
        plane6.position.x -= speed;
        distance -= speed;

        if (distance < 0) open = false; //stops the process
    }

    function animate(time) {
        renderer.render(scene, camera);
        if(open) {
            if (direction === 'expand' && distance < 1) openBox(containerComponents);
            if (distance >= 1 && direction === 'expand') flipBoxSides(containerComponents);
            if (direction === 'shrink') shrinkBox(containerComponents);
        }
        requestAnimationFrame(animate);
    }

    //Resize window listener
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    requestAnimationFrame(animate);
}

main();