import * as THREE from 'three';
import { MD2Loader } from 'three/examples/jsm/loaders/MD2Loader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui' 

function init() {
    var mixer = new THREE.AnimationMixer();        
    var selectedClipAction        

    var scene = new THREE.Scene();
    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMap.enabled= true;

    // position and point the camera to the center of the scene
    camera.position.x = -50;
    camera.position.y = 40;
    camera.position.z = 60;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(50, 70, 60);
    spotLight.intensity = 1;
    scene.add(spotLight);
      var ambientLight = new THREE.AmbientLight("#0c0c0c");
  //scene.add(ambientLight);
  // the point light where working with
  var pointColor = "#ccffcc";
  var pointLight = new THREE.PointLight(pointColor);
  pointLight.decay = 0.1

  //pointLight.castShadow = true;

  scene.add(pointLight);

    // add the output of the renderer to the html element
    document.body.append(webGLRenderer.domElement);
    
    var clock = new THREE.Clock();

    var loader = new MD2Loader();
    loader.load('ogro.md2', function (result) {            
        var mat = new THREE.MeshLambertMaterial(
                {
                    map: new THREE.TextureLoader().load("skin.jpg"),
                    morphTargets: true, morphNormals: true
                });
    var mesh = new THREE.Mesh(result, mat);

    scene.add(mesh);

    // setup the mixer
    mixer = new THREE.AnimationMixer(mesh);
    
    enableControls(result);    });

    function enableControls(geometry) {
        var gui = new GUI();          

        var animationsArray = geometry.animations.map(function(e) { 
        return e.name;});

        animationsArray.push("none")
        var animationMap = geometry.animations.reduce(function(res, el) { 
        res[el.name] = el
        return res;}, 
        {"none" : undefined});

        gui.add({animation: "none"}, "animation", animationsArray).onChange(function(selection) {
        //stop privious selection
        if (selectedClipAction) selectedClipAction.stop();

        if (selection != "none") {
            selectedClipAction = mixer.clipAction( animationMap[selection] ).play();    
        }
        });    }

        render();
        const controls = new OrbitControls( camera, webGLRenderer.domElement );
        controls.update()
        function render() {            
            var delta = clock.getDelta();
            if (mixer ) {
            mixer.update( delta );
            }            
            // render using requestAnimationFrame
            requestAnimationFrame(render);
            webGLRenderer.render(scene, camera);
        }        
}
window.onload = init;
