"use strict";

function World() {
  this._scene = new THREE.Scene();
  this._objects = [];
  this._player = new Player(this._scene);
  this.rata = null;
  this._terrain = null;
  this._skyTexture = null;
  this._groundtex = null;
  this._skybox = null;

  //Kameraposisjon relativt til player
  var zoom = 5;
  this._relativeCameraPosition = new THREE.Vector3(zoom, zoom, zoom);
  this._camera = new THREE.PerspectiveCamera(70, RENDER_WIDTH/RENDER_HEIGHT, 0.1, 10000);

  // this._camera.position.y = 25;
  // this._camera.position.z = 6;
  // this._camera.position.x = 3;
  //this._camera.lookAt(new THREE.Vector3(0,0, -3));
  //this._camControls = new THREE.FirstPersonControls(this._camera);

  this._spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
  this._ambientLight = new THREE.AmbientLight(0x222222);
  this._cursor = null;

  this.mapWidth = 256;
  this.mapDepth = 256;
  this.mapMaxHeight = 15;
  this.shadowMapWidth = 2048;
  this.shadowMapHeight = 2048;
  // this.mapWidth = 128;
  // this.mapDepth = 128;
}

World.prototype.init = function() {
  this._scene.add(this._camera);

  var skyboxGeometry = new THREE.SphereGeometry(3000, 60, 60);
  var skyboxMaterial = new THREE.MeshBasicMaterial({
    map: this._skyTexture,
    color: 0xffffff,
    side: THREE.BackSide
  });

  this._skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  this._scene.add(this._skybox);

  var directionalLight = new THREE.DirectionalLight(new THREE.Color(1.0, 1.0, 1.0));
  directionalLight.name = 'sun';
  directionalLight.position.set(1, 10000, 0);
  //directionalLight.rotateZ(45 *Math.PI/180);

  this._scene.add(directionalLight);
  this._scene.add(new THREE.DirectionalLightHelper(directionalLight, 10));

  this.rata.setSkinName('ctf_r');
	this.rata.setWeaponName('w_sshotgun');

  this._scene.add(this.rata.character.object3d);

  this._spotLight.position.set( 0, 1500, 1000 );
  this._spotLight.target.position.set( 0, 0, 0 );
  // this._spotLight.castShadow = true;
  // this._spotLight.shadowCameraNear = 1200;
  // this._spotLight.shadowCameraFar = 2500;
  // this._spotLight.shadowCameraFov = 50;
  // this._spotLight.shadowBias = 0.0001;
  // this._spotLight.shadowMapWidth = this.shadowMapWidth;
  // this._spotLight.shadowMapHeight = this.shadowMapHeight;
  this.addObject(this._spotLight);
  this.addObject(this._ambientLight);

  //////////////////////////////////////////////////////////////////////////////////
	//		controls.input based on keyboard				//
	//////////////////////////////////////////////////////////////////////////////////
  var ratat = this.rata;
	document.body.addEventListener('keydown', function(event){
		var inputs	= ratat.controls.inputs
		if( event.keyCode === 'W'.charCodeAt(0) )	inputs.up	= true
		if( event.keyCode === 'S'.charCodeAt(0) )	inputs.down	= true
		if( event.keyCode === 'A'.charCodeAt(0) )	inputs.left	= true
		if( event.keyCode === 'D'.charCodeAt(0) )	inputs.right	= true

		// to support arrows
		if( event.keyCode === 38 )	inputs.up	= true
		if( event.keyCode === 40 )	inputs.down	= true
		if( event.keyCode === 37 )	inputs.left	= true
		if( event.keyCode === 39 )	inputs.right	= true
	});
	document.body.addEventListener('keyup', function(event){
		var inputs	= ratat.controls.inputs
		if( event.keyCode === 'W'.charCodeAt(0) )	inputs.up	= false
		if( event.keyCode === 'S'.charCodeAt(0) )	inputs.down	= false
		if( event.keyCode === 'A'.charCodeAt(0) )	inputs.left	= false
		if( event.keyCode === 'D'.charCodeAt(0) )	inputs.right	= false
    //if( event.keyCode === 'R'.charCodeAt(0) ) ratat.setAnimationName('stand');

		// to support arrows
		if( event.keyCode === 38 )	inputs.up	= false
		if( event.keyCode === 40 )	inputs.down	= false
		if( event.keyCode === 37 )	inputs.left	= false
		if( event.keyCode === 39 )	inputs.right	= false
	});

  //Last inn heightmap
  var heightMapImg = document.getElementById('heightmap');
  var terrainData = getPixelValues(heightMapImg, 'r');
  var heightMapGeometry = new HeightMapBufferGeometry(terrainData, heightMapImg.width, heightMapImg.height);
  heightMapGeometry.scale(this.mapWidth, this.mapMaxHeight, this.mapDepth);

  // this._groundtex.wrapS = this._groundtex.wrapT = THREE.RepeatWrapping;
  // this._groundtex.repeat.set( 2, 1 );
  var terrainMaterial = new THREE.MeshPhongMaterial({
    //map: this._groundtex,
    color: 0x005500,
    shininess: 1
  });
  this._terrain = new HeightMapMesh(heightMapGeometry, terrainMaterial);
  this.rata.character.object3d.position.y =
  this._terrain.getHeightAtPoint(this.rata.character.object3d.position);
  this._camera.lookAt(this.rata.character.object3d.position);

  this._terrain.name = "terrain";

  this.addObject(this._terrain);
  this.addObject(this._cursor);

  //this._player._model.position.z = this._terrain.getHeightAtPoint(this._player._model.position);
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


  var ratapos = this.rata.character.object3d.position;
  var terrheight = this._terrain.getHeightAtPoint(ratapos);
  var diff = Math.abs(ratapos.y - terrheight)*10;

  //if(ratapos.y = terrheight){
    //this.rata.character.object3d.position.y = terrheight;
  //}
  console.log(diff);
  if(ratapos.y > terrheight){
    this.rata.character.object3d.position.y -= (0.5+diff)*delta;
  }
  if(ratapos.y < terrheight){
    this.rata.character.object3d.position.y += (0.5+diff)*delta;
  }

  //this.rata.character.object3d.position.y = this._terrain.getHeightAtPoint(ratapos);

  var inputs	= this.rata.controls.inputs
  if( inputs.up || inputs.down ){
    this.rata.setAnimationName('run')
  }else {
    this.rata.setAnimationName('stand')
  }
  this.rata.update(delta);
  //this._camControls.update(delta);

  var pos = new THREE.Vector3();
  pos.copy(ratapos);
  pos.add(this._relativeCameraPosition);
  this._camera.position.set(pos.x, pos.y, pos.z);
  this._camera.lookAt(ratapos);
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

  this.rata = new THREEx.MD2CharacterRatmahatta();

  this._skyTexture = THREE.ImageUtils.loadTexture("resources/skydome.jpg");
  this._groundtex = THREE.ImageUtils.loadTexture("resources/maptex.png");
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
