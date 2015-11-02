"use strict";

function World() {
  this._scene = new THREE.Scene();
  this._objects = [];
  this._player = null;

  //Remove this when player class have camera
  this.tempCamera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
  this._scene.add(this.tempCamera);
  this.tempCamera.position.z = 10;
  this.tempCamera.position.y = 10;

  this.tempPlayer = new Player(this._scene);
	// THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
	// 	console.log( item, loaded, total );
	// 	if(loaded == total){
	// 		this._scene.add(this.tempPlayer._model);
	// 	}
	// };
	this._scene.add(this.tempPlayer._model);

	//this.tempPlayer.setSceneP(this._scene);
	//this.tempPlayer._loadPlayerModel('resources/models/player.obj');

  var terrainMaterial = new THREE.MeshPhongMaterial( /*{wireframe: true}*/ );
  var terrain = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 10, 10), terrainMaterial);
  this.tempCamera.lookAt(terrain.position);
  this.addObject(terrain);

  var light = new function() {
    this.point = null;
    this.ambient = null

    this.init = function() {
      this.point = new THREE.PointLight(0xFFFFFF, 2);
      this.ambient = new THREE.AmbientLight(0x222222);
      this.point.position.y = 2;
      this.point.position.z = 2;
    }
  }
  light.init();
  this.addObject(light.point);
  this.addObject(light.ambient);

	// THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
	// 	console.log( item, loaded, total );
	// 	if(loaded == total){
	// 		this.addObject(this.tempPlayer._model);
	// 	}
	// };

}

World.prototype.render = function(renderer) {
  renderer.render(this._scene, this.tempCamera);
}

World.prototype.addObject = function(object) {
  this._objects.push(object);
  this._scene.add(object);
}
