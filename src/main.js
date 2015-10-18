"use strict";

var renderer;
var scene;

var camera;
var clock;
var model;
var skyTexture;
var frameStats;

var init = function(){

  var width = window.innerWidth;
  var height = window.innerHeight;

  //Set up the three.js renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  //fps counter
  frameStats = new Stats();
  frameStats.setMode( 0 );
  // align top-left
  frameStats.domElement.style.position = 'absolute';
  frameStats.domElement.style.left = '0px';
  frameStats.domElement.style.top = '0px';
  document.body.appendChild( frameStats.domElement );

  scene = new THREE.Scene;
  clock = new THREE.Clock;

  //Load the single object inside the scene, with a wireframe helper object
  var loader = new THREE.JSONLoader;
  loader.load('resources/models/monkey2.json', function (geometry, materials) {
    var skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
    skinnedMesh.scale.set(50, 50, 50);
    model = skinnedMesh;
    scene.add(model);
    var wireframe = new THREE.WireframeHelper( model, 0xffffff );
    scene.add(wireframe);

    //animate(skinnedMesh);
  });

  //A loading manager, that runs the update() loop when it has finished loading
  THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
    if(loaded == total){

      update();
    }
    camera.lookAt(model.position);
  };

  skyTexture = THREE.ImageUtils.loadTexture('resources/background.jpg');

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
  camera.position.y = 160;
  camera.position.z = 400;
  scene.add(camera);

  //The skybox in the background
  var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
  var skyboxMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, color: 0xffffff, side: THREE.BackSide});
  var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  scene.add(skybox);

  var pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(0,300,200);
  scene.add(pointLight);

}
window.addEventListener("load", init);

var render = function(){
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

var update = function(){
  frameStats.begin();
  model.rotation.y -= 1 * clock.getDelta();
  render();
  frameStats.end();
  window.requestAnimFrame(update);
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

//Unfinished generic model loader
// var loadModelJSON = function(path){
//   var loader = new THREE.JSONLoader;
//   var lmod = loader.load(path, function (geometry, materials) {
//     var skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
//     skinnedMesh.scale.set(50, 50, 50);
//     return skinnedMesh;
//     //scene.add(skinnedMesh);
//     //animate(skinnedMesh);
//   });
//   return lmod;
// }
