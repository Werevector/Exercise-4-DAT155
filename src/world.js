"use strict";

function World(renderer) {
  this._scene = new THREE.Scene();
  this._objects = [];
  this._renderer = renderer;
  this._player = new Player();
  this._terrain = null;

  this._skyTexture = null;
  this._groundtex = null;

  this._environment = new Environment();

  this._groundbm = null;

  this._cameraZoom = 5;

  this._skybox = null;

  this._water = new Water(1.5);

  //Kameraposisjon relativt til player
  this._relativeCameraPosition = new THREE.Vector3(this._cameraZoom, this._cameraZoom, this._cameraZoom);
  this._camera = new THREE.PerspectiveCamera(70, RENDER_WIDTH/RENDER_HEIGHT, 0.1, 200);

  this._spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
  this._ambientLight = new THREE.AmbientLight(0x222222);
  this._cursor = null;

  var S = 1;
  this.mapWidth = 256 * S;
  this.mapDepth = 256 * S;
  this.mapMaxHeight = 15 * S;
  this.shadowMapWidth = 2048;
  this.shadowMapHeight = 2048;
}

World.prototype.init = function() {
  this._scene.add(this._camera);

  var skyboxGeometry = new THREE.SphereGeometry(175, 60, 60);
  var skyboxMaterial = new THREE.MeshBasicMaterial({
    map: this._skyTexture,
    color: 0xffffff,
    side: THREE.BackSide
  });

  this._skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  this._scene.add(this._skybox);

  var directionalLight = new THREE.DirectionalLight(new THREE.Color(1.0, 1.0, 1.0));
  directionalLight.name = 'sun';
  //directionalLight.intensity = 1;
  directionalLight.position.set(100, 1000, 0);

  this._scene.add(directionalLight);
  this._scene.add(new THREE.DirectionalLightHelper(directionalLight, 10));


  this._spotLight.position.set( 0, 1500, 1000 );
  this._spotLight.target.position.set( 0, 0, 0 );
  this._spotLight.castShadow = true;
  this._spotLight.shadowCameraNear = 1200;
  this._spotLight.shadowCameraFar = 2500;
  this._spotLight.shadowCameraFov = 50;
  this._spotLight.shadowBias = 0.0001;
  this._spotLight.shadowMapWidth = this.shadowMapWidth;
  this._spotLight.shadowMapHeight = this.shadowMapHeight;
  //this.addObject(this._spotLight);
  // this.addObject(this._ambientLight);

  //Last inn heightmap
  var heightMapImg = document.getElementById('heightmap');
  var terrainData = getPixelValues(heightMapImg, 'r');
  var heightMapGeometry = new HeightMapBufferGeometry(terrainData, heightMapImg.width, heightMapImg.height);
  heightMapGeometry.scale(this.mapWidth, this.mapMaxHeight, this.mapDepth);

  this._groundtex.wrapS	= THREE.RepeatWrapping;
	this._groundtex.wrapT	= THREE.RepeatWrapping;
	this._groundtex.repeat.x= 80
	this._groundtex.repeat.y= 80
	this._groundtex.anisotropy = this._renderer.getMaxAnisotropy();

  this._groundbm.wrapS	= THREE.RepeatWrapping;
  this._groundbm.wrapT	= THREE.RepeatWrapping;
  this._groundbm.repeat.x= 80
  this._groundbm.repeat.y= 80
  this._groundbm.anisotropy = this._renderer.getMaxAnisotropy();


  var terrainMaterial = new THREE.MeshPhongMaterial({
    map: this._groundtex,
    //bumpMap: this._groundbm,
    color: 0x888888,
    shininess: 1
  });
  this._terrain = new HeightMapMesh(heightMapGeometry, terrainMaterial);
  this._environment.setupRocks(this._terrain, this._scene);
  this._environment.setupTrees(this._terrain, this._scene);

  this._camera.lookAt(this._player.getPosition());

  this._terrain.name = "terrain";

  this.addObject(this._terrain);
  this.addObject(this._cursor);

  this._water.init();
  this._scene.add(this._water.mesh);

  this._player.init(this._scene, this._terrain);

  var self = this;
  document.addEventListener("mousedown", function(event){
    self.onMouseClick(event);
  });

  var rel = this._relativeCameraPosition;
  window.addEventListener("mousewheel", function(event){
    var delta = -(event.wheelDelta/100);
    rel.x += delta;
    rel.y += delta;
    rel.z += delta;
  });

  this._scene.fog = new THREE.Fog( 0xefd1b5, 0.0025, 200 );

}

World.prototype.render = function(renderer) {
  renderer.render(this._scene, this._camera);
}

World.prototype.update = function(delta) {
  this._player.update(delta);
  var pos = new THREE.Vector3();
  pos.copy(this._player.getPosition());
  pos.add(this._relativeCameraPosition);
  this._camera.position.set(pos.x, pos.y, pos.z);
  this._camera.lookAt(this._player.getPosition());
  this._camera.updateProjectionMatrix();
}

World.prototype.addObject = function(object) {
  this._objects.push(object);
  this._scene.add(object);
}

World.prototype.load = function(objMtlLoader) {
  var self = this;
  objMtlLoader.load("resources/models/flag.obj",
                    "resources/models/flag.mtl",
                    function(obj) {
                      obj.scale.set(0.2, 0.2, 0.2);
                      obj.rotateY(-0.7);
                      self._cursor = obj;
                    });
  this._water.load();
  this._environment.loadTreeModel(objMtlLoader);
  this._environment.loadRockModel(objMtlLoader);
  this._skyTexture = THREE.ImageUtils.loadTexture("resources/skydome.jpg");
  this._groundtex = THREE.ImageUtils.loadTexture("resources/grass.jpg");
  this._groundbm = THREE.ImageUtils.loadTexture("resources/dirtbm.jpg");
  this._player.load();
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
    this._player.setGoal(intersects[0].point);
  }
}
