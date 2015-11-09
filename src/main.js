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

  world = new World();

  THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
    if(loaded == total){

      update();
    }
  };

}
window.addEventListener("load", init);

var render = function(){
  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT);
  world.render(renderer);
}

var update = function(){
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
