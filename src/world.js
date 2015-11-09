"use strict";

function World() {

  this._scene = new THREE.Scene();
  this._objects = [];
  this._player = null;

  //Remove this when player class have camera
  this.tempCamera = new THREE.PerspectiveCamera(70, RENDER_WIDTH/RENDER_HEIGHT, 0.1, 10000);
  this.camControls = new THREE.FirstPersonControls(this.tempCamera);
  this.camControls.lookSpeed = 0.4;
  this.camControls.movementSpeed = 20;

  this._scene.add(this.tempCamera);

  var skyTexture = THREE.ImageUtils.loadTexture('resources/background.jpg');
  var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
  var skyboxMaterial = new THREE.MeshBasicMaterial({ 
    map: skyTexture,
    color: 0xffffff,
    side: THREE.BackSide
  });
  this.skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  this._scene.add(this.skybox);

  this.tempPlayer = new Player(this._scene);
  this._scene.add(this.tempPlayer._model);

  var terrain = loadTexturedObj('resources/models/terrain2.obj', 'resources/grass.jpg');
  this.addObject(terrain);

  var light = new function() {
  this.point = null;
  this.ambient = null

  this.init = function() {
    this.point = new THREE.PointLight(0xFFFFFF, 2);
    this.ambient = new THREE.AmbientLight(0x222222);
    this.point.position.y = 10;
    this.point.position.z = 10;
  }
}

  light.init();
  this.addObject(light.point);
  this.addObject(light.ambient);

}

World.prototype.render = function(renderer) {
  renderer.render(this._scene, this.tempCamera);
}

World.prototype.update = function(delta) {
  this.camControls.update(delta);
}

World.prototype.addObject = function(object) {
  this._objects.push(object);
  this._scene.add(object);
}
