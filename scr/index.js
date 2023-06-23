import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
/* import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'  
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import chroma from "chroma-js" */

 function init() {

        
        var scene = new THREE.Scene();
        //\scene.fog = new THREE.Fog(0xaaaaaa, 0.010, 200);

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


        // create a render and set the size
        var renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0xaaaaff, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;


        // create the ground plane
        var textureGrass = new THREE.TextureLoader().load("../grasslight-big.jpg");
        textureGrass.wrapS = THREE.RepeatWrapping;
        textureGrass.wrapT = THREE.RepeatWrapping;
        textureGrass.repeat.set(10, 10);
        textureGrass.offset.x = 90/(50*Math.PI);


        var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({
    map: textureGrass
  });

        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // create a cube
        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // position the cube
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;

        // add the cube to the scene
        scene.add(cube);

         var clock = new THREE.Clock();

   

   var fpControls = new FirstPersonControls(camera,document.body);
  fpControls.lookSpeed = 0.01;
  fpControls.movementSpeed = 20;
  fpControls.lookVertical = true;
  fpControls.constrainVertical = true;
  fpControls.verticalMin = 1.0;
  fpControls.verticalMax = 2.0;
  fpControls.lon = -150;
  fpControls.lat = 120; 

        var sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // position the sphere
        sphere.position.x = 10;
        sphere.position.y = -5;
        sphere.position.z = 20;
        sphere.castShadow = true;

        // add the sphere to the scene
        scene.add(sphere);
        addHouseAndTree(scene)

        // position and point the camera to the center of the scene
        camera.position.x = -20;
        camera.position.y = 15;
        camera.position.z = 45;
//        camera.position.x = -120;
//        camera.position.y = 165;
//        camera.position.z = 145;
        camera.lookAt(new THREE.Vector3(50, -50, -50));


        // add spotlight for a bit of light
        var spotLight0 = new THREE.SpotLight(0xcccccc);
        //spotLight0.shadow.mapSize.set(2048, 2048);
        spotLight0.position.set(0, 1000, -10);
        spotLight0.lookAt(plane);
        scene.add(spotLight0);


        var target = new THREE.Object3D();
        target.position = new THREE.Vector3(15, -5, 0);

        var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
        hemiLight.position.set(0, 500, 0);
        scene.add(hemiLight);


        var pointColor = "#ffffff";
//    var dirLight = new THREE.SpotLight( pointColor);
        var dirLight = new THREE.DirectionalLight(pointColor);
        dirLight.position.set(30, 10, -50);
        dirLight.castShadow = true;
        dirLight.target = plane;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 200;
        dirLight.shadow.camera.left = -50;
        dirLight.shadow.camera.right = 50;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = -50;
        dirLight.shadow.mapSize.idth = 2048;
        dirLight.shadow.mapSize.height = 2048;


        scene.add(dirLight);


        // add the output of the renderer to the html element
        document.body.append(renderer.domElement);

        // call the render function
        var step = 0;

        // used to determine the switch point for the light animation
        var invert = 1;
        var phase = 0;

        var controls = new function () {
            this.rotationSpeed = 0.03;
            this.bouncingSpeed = 0.03;

            this.hemisphere = true;
            this.color = 0x00ff00;
            this.skyColor = 0x0000ff;
            this.intensity = 0.6;

        };


        render();

        function render() {
            //stats.update();
            // rotate the cube around its axes
            cube.rotation.x += controls.rotationSpeed;
            cube.rotation.y += controls.rotationSpeed;
            cube.rotation.z += controls.rotationSpeed;

            // bounce the sphere up and down
            step += controls.bouncingSpeed;
            sphere.position.x = 20 + ( 10 * (Math.cos(step)));
            sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));
            fpControls.update(clock.getDelta());

            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        
    }
    function addHouseAndTree(scene) {

    
    createHouse(scene);
    createTree(scene);

   

    function createHouse(scene) {
        var roof = new THREE.ConeGeometry(5, 4);
        var base = new THREE.CylinderGeometry(5, 5, 6);

        // create the mesh
        var roofMesh = new THREE.Mesh(roof, new THREE.MeshPhongMaterial({
            color: 0x8b7213
        }));
        var baseMesh = new THREE.Mesh(base, new THREE.MeshPhongMaterial({
            color: 0xffe4c4
        }));

        roofMesh.position.set(25, 8, 0);
        baseMesh.position.set(25, 3, 0);

        roofMesh.receiveShadow = true;
        baseMesh.receiveShadow = true;
        roofMesh.castShadow = true;
        baseMesh.castShadow = true;

        scene.add(roofMesh);
        scene.add(baseMesh);
    }

    /**
     * Add the tree to the scene
     */
    function createTree(scene) {
        var trunk = new THREE.CylinderGeometry(1, 1, 8);
        var leaves = new THREE.SphereGeometry(4);

        // create the mesh
        var trunkMesh = new THREE.Mesh(trunk, new THREE.MeshPhongMaterial({
            color: 0x8b4513
        }));
        var leavesMesh = new THREE.Mesh(leaves, new THREE.MeshPhongMaterial({
            color: 0x00ff00
        }));

        /// position the trunk. Set y to half of height of trunk
        trunkMesh.position.set(-10, 4, 0);
        leavesMesh.position.set(-10, 12, 1);

        trunkMesh.castShadow = true;
        trunkMesh.receiveShadow = true;
        leavesMesh.castShadow = true;
        leavesMesh.receiveShadow = true;

        scene.add(trunkMesh);
        scene.add(leavesMesh);
    }
}
    window.onload = init;