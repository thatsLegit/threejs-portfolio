import * as THREE from 'three';

//let's make triangles, planes and sphere to define the walkable surface
class Ground {
    constructor() {
        this.planes = [];
        this.spheres = [];
        this.triangles = [];

        this._init();
    }

    _init() {
        this._addPlanes();
        this._addSphere();
        this._addTriangles();
    }

    _addPlanes() {
        {
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(740, 600),
                new THREE.MeshBasicMaterial({ color: 0x808080 })
            );
            plane.rotation.x = -Math.PI / 2;
            const box = new THREE.Box3().setFromObject(plane);
            this.planes.push(box);
        }
        {
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(115, 800),
                new THREE.MeshBasicMaterial({ color: 0x808080 })
            );
            plane.rotation.x = -Math.PI / 2;
            plane.position.set(30, 3, 800);
            const box = new THREE.Box3().setFromObject(plane);
            this.planes.push(box);
        }
        {
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(120, 375),
                new THREE.MeshBasicMaterial({ color: 0x808080 })
            );
            plane.rotation.x = -Math.PI / 2;
            plane.position.set(40, 3, -500);
            const box = new THREE.Box3().setFromObject(plane);
            this.planes.push(box);
        }
    }

    _addSphere() {
        const sphere = new THREE.Sphere(new THREE.Vector3(43, 0, -720), 54);
        this.spheres.push(sphere);
    }

    _addTriangles() {
        // starting from the top
        {
            const v1 = new THREE.Vector3(-370, 0, 300); //haut
            const v2 = new THREE.Vector3(-500, 0, 0);
            const v3 = new THREE.Vector3(-370, 0, -300);
            const triangle = new THREE.Triangle(v1, v2, v3);
            this.triangles.push(triangle);
        }
        {
            const v1 = new THREE.Vector3(-370, 0, -300); //gauche
            const v2 = new THREE.Vector3(0, 0, -400);
            const v3 = new THREE.Vector3(370, 0, -300);
            const triangle = new THREE.Triangle(v1, v2, v3);
            this.triangles.push(triangle);
        }
        {
            const v1 = new THREE.Vector3(370, 0, -300); //bas
            const v2 = new THREE.Vector3(500, 0, 0);
            const v3 = new THREE.Vector3(370, 0, 300);
            const triangle = new THREE.Triangle(v1, v2, v3);
            this.triangles.push(triangle);
        }
        {
            const v1 = new THREE.Vector3(-370, 0, 300); //droite
            const v2 = new THREE.Vector3(0, 0, 400);
            const v3 = new THREE.Vector3(370, 0, 300);
            const triangle = new THREE.Triangle(v1, v2, v3);
            this.triangles.push(triangle);
        }
    }
}

export default Ground;
