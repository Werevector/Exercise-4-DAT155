"use strict";

function World() {
  this._scene = new THREE.Scene();
  this._objects = [];
  this._player = new Player(this._scene);
  this._terrain = null;
  this._skyTexture = null;
  this._skybox = null;
  this._camera = new THREE.PerspectiveCamera(70, RENDER_WIDTH/RENDER_HEIGHT, 0.1, 10000);
  this._camControls = new THREE.FirstPersonControls(this._camera);  
  this._pointLight = new THREE.PointLight(0xFFFFFF, 2);
  this._ambientLight = new THREE.AmbientLight(0x222222);
}

World.prototype.init = function() {
  this._camControls.lookSpeed = 0.4;
  this._camControls.movementSpeed = 20;
  this._scene.add(this._camera);
  
  var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
  var skyboxMaterial = new THREE.MeshBasicMaterial({ 
    map: this._skyTexture,
    color: 0xffffff,
    side: THREE.BackSide
  });
  this._skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  this._scene.add(this._skybox);

  this._scene.add(this._player._model);

  this._pointLight.position.y = 10;
  this._pointLight.position.z = 10;
  this.addObject(this._pointLight);
  this.addObject(this._ambientLight);
  
  this.addObject(this._terrain);
}

World.prototype.render = function(renderer) {
  renderer.render(this._scene, this._camera);
}

World.prototype.update = function(delta) {
  this._camControls.update(delta);
}

World.prototype.addObject = function(object) {
  this._objects.push(object);
  this._scene.add(object);
}

World.prototype.load = function(objMtlLoader) {
  var self = this;
  objMtlLoader.load("resources/models/terrain3.obj",
                    "resources/models/terrain3.mtl",
                    function(obj) {
                      self._terrain = obj;
                    });
  
  this._skyTexture = THREE.ImageUtils.loadTexture('resources/background.jpg');
}
