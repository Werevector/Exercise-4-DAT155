"use strict";

var renderer;
var scene;
var world;

var camera;
var clock;
var model;
var skyTexture;
var frameStats;
var clock = new THREE.Clock();


var RENDER_WIDTH = window.innerWidth, RENDER_HEIGHT = window.innerHeight;


function onLoad(){

  var width = window.innerWidth;
  var height = window.innerHeight;

  //Set up the three.js renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.body.appendChild(renderer.domElement);

  //fps counter
  frameStats = new Stats();
  frameStats.setMode( 0 );
  // align top-left
  frameStats.domElement.style.position = 'absolute';
  frameStats.domElement.style.left = '0px';
  frameStats.domElement.style.top = '0px';
  document.body.appendChild( frameStats.domElement );

  var objMtlLoader = new THREE.OBJMTLLoader();
  var jsonLoader = new THREE.JSONLoader();
  world = new World(renderer);
  var uvtest = THREE.UVMapping;
  world.load(objMtlLoader, jsonLoader);

  THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
    if(loaded == total){
      init();
    }
  };

}
window.addEventListener("load", onLoad);

function init(){
  world.init();
  update();
}

function render(){
  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT);
  world.render(renderer);
}

function update(){
  var delta = clock.getDelta();
  frameStats.begin();
  //model.rotation.y -= 1 * clock.getDelta();
  world.update(delta);
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
