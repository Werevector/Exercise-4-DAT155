"use strict";

function World() {
  this._scene = new THREE.Scene();
  this._objects = [];
  this._player = new Player(this._scene);
  this._terrain = null;
  this._skyTexture = null;
  this._skybox = null;
  
  //Kameraposisjon relativt til player
  this._relativeCameraPosition = new THREE.Vector3(20, 50, 20);
  this._camera = new THREE.PerspectiveCamera(70, RENDER_WIDTH/RENDER_HEIGHT, 0.1, 10000);
  
  this._pointLight = new THREE.PointLight(0xFFFFFF, 2);
  this._ambientLight = new THREE.AmbientLight(0x222222);
  this._cursor = null;
  
  this.mapWidth = 256;
  this.mapDepth = 256;
  this.mapMaxHeight = 15;
}

World.prototype.init = function() {
  this._scene.add(this._camera);
  
  var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
  var skyboxMaterial = new THREE.MeshBasicMaterial({ 
    map: this._skyTexture,
    color: 0xffffff,
    side: THREE.BackSide
  });
  this._skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  this._scene.add(this._skybox);

  this._pointLight.position.y = 40;
  this._pointLight.position.z = 10;
  this.addObject(this._pointLight);
  this.addObject(this._ambientLight);
  
  //Last inn heightmap
  var heightMapImg = document.getElementById('heightmap');
  var terrainData = getPixelValues(heightMapImg, 'r');
  var heightMapGeometry = new HeightMapBufferGeometry(terrainData, heightMapImg.width, heightMapImg.height);
  heightMapGeometry.scale(this.mapWidth, this.mapMaxHeight, this.mapDepth);
  var terrainMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  this._terrain = new HeightMapMesh(heightMapGeometry, terrainMaterial);
  this._terrain.name = "terrain";
  
  this.addObject(this._terrain);
  this.addObject(this._cursor);
  
  this._player._model.position.z = this._terrain.getHeightAtPoint(this._player._model.position);
  this._scene.add(this._player._model);
  
  var self = this;
  document.addEventListener("mousedown", function(event){
    self.onMouseClick(event);
  });
}

World.prototype.render = function(renderer) {
  renderer.render(this._scene, this._camera);
}

World.prototype.update = function(delta) {
  var pos = new THREE.Vector3();
  pos.copy(this._player._model.position);
  pos.add(this._relativeCameraPosition);
  this._camera.position.set(pos.z, pos.y, pos.z);
  this._camera.lookAt(this._player._model.position);
  this._camera.updateProjectionMatrix();
}

World.prototype.addObject = function(object) {
  this._objects.push(object);
  this._scene.add(object);
}

World.prototype.load = function(objMtlLoader) {  
  var self = this;
  objMtlLoader.load("resources/StopSign/StopSign.obj",
                    "resources/StopSign/StopSign.mtl",
                    function(obj) {
                      self._cursor = obj;
                    });
  this._skyTexture = THREE.ImageUtils.loadTexture("resources/background.jpg");
}

World.prototype.onMouseClick = function(event) {
  var vec = new THREE.Vector3(
    (event.clientX/window.innerWidth)*2-1,
    -(event.clientY/window.innerHeight)*2+1,
    0.5
  );
  vec.unproject(this._camera);
  var raycaster = new THREE.Raycaster(
    this._camera.position,
    vec.sub(this._camera.position).normalize()
  );
  var intersects = raycaster.intersectObjects([this._terrain]);
  if(intersects.length > 0) {
    this._cursor.position.copy(intersects[0].point);
  }
}
