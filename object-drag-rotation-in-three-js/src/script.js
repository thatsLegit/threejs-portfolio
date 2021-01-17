let camera, scene, renderer;
let cube;

let targetRotationX = 0.5;
let targetRotationOnMouseDownX = 0;
let targetRotationY = 0.2;
let targetRotationOnMouseDownY = 0;

let mouseX = 0;
let mouseXOnMouseDown = 0;
let mouseY = 0;
let mouseYOnMouseDown = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let slowingFactor = 0.25;

init();
animate();

function init() {
    canvas = document.querySelector('#canvas');

    renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setSize( canvas.clientWidth, canvas.clientHeight );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 150;
    camera.position.z = 500;

    let materials = [];

    for ( let i = 0; i < 6; i ++ ) {
        materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
    }

    cube = new THREE.Mesh(  new THREE.BoxGeometry( 200, 200, 200 ) , new THREE.MeshFaceMaterial(materials) );
    cube.position.y = 150;
    cube.overdraw = true;
    scene.add( cube );              				               

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

function onDocumentMouseDown(event) {
    event.preventDefault(); // ?

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );

    mouseXOnMouseDown = event.clientX - windowHalfX; //distance to half of the screen on x
    targetRotationOnMouseDownX = targetRotationX; //0.5

    mouseYOnMouseDown = event.clientY - windowHalfY; //distance to half of the screen on y
    targetRotationOnMouseDownY = targetRotationY; //0.2
}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX; //distance to half of the screen on x
    targetRotationX = ( mouseX - mouseXOnMouseDown ) * 0.00025; //distance between mouse down and move on x

    mouseY = event.clientY - windowHalfY;  //distance to half of the screen on y
    targetRotationY = ( mouseY - mouseYOnMouseDown ) * 0.00025; //distance between mouse down and move on x
}

function onDocumentMouseUp() {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut() {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function animate() {
    render();
    requestAnimationFrame(animate);
}

function render() {
    rotateAroundWorldAxis(cube, new THREE.Vector3(0, 1, 0), targetRotationX);
    rotateAroundWorldAxis(cube, new THREE.Vector3(1, 0, 0), targetRotationY);
    
    targetRotationY = targetRotationY * (1 - slowingFactor);
    targetRotationX = targetRotationX * (1 - slowingFactor);
    renderer.render( scene, camera );
}

//targetRotation is approximated to radians
function rotateAroundWorldAxis( object, axis, radians ) {
    let rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
    rotationMatrix.multiply( object.matrix );
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix( object.matrix );
}