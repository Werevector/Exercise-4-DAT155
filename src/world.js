"use strict";

function World() {
  this._scene = new THREE.Scene();
  this._objects = [];
  this._player = new Player(this._scene);
  this.rata = null;
  this._terrain = null;
  this._skyTexture = null;
  this._skybox = null;
  this._camera = new THREE.PerspectiveCamera(70, RENDER_WIDTH/RENDER_HEIGHT, 0.1, 10000);
  this._camera.position.y = 4;
  this._camera.position.z = 6;
  this._camera.position.x = 3;
  //this._camera.lookAt(new THREE.Vector3(0,0, -3));
  //this._camControls = new THREE.FirstPersonControls(this._camera);
  this._pointLight = new THREE.PointLight(0xFFFFFF, 2);
  this._ambientLight = new THREE.AmbientLight(0x222222);
}

World.prototype.init = function() {
  //this._camControls.lookSpeed = 0.1;
  //this._camControls.movementSpeed = 10;
  this._camera.lookAt(this.rata.character.object3d.position);
  this._scene.add(this._camera);

  var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
  var skyboxMaterial = new THREE.MeshBasicMaterial({
    map: this._skyTexture,
    color: 0xffffff,
    side: THREE.BackSide
  });

  this._skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  this._scene.add(this._skybox);

  //this._scene.add(this._player._model);


	this.rata.setSkinName('ctf_r');
	this.rata.setWeaponName('w_sshotgun');

  this._scene.add(this.rata.character.object3d);

  this._pointLight.position.y = 10;
  this._pointLight.position.z = 10;
  this.addObject(this._pointLight);
  this.addObject(this._ambientLight);

  this.addObject(this._terrain);

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

}

World.prototype.render = function(renderer) {
  renderer.render(this._scene, this._camera);
}

World.prototype.update = function(delta) {
  this._camera.lookAt(this.rata.character.object3d.position);

  var inputs	= this.rata.controls.inputs
  if( inputs.up || inputs.down ){
    this.rata.setAnimationName('run')
  }else {
    this.rata.setAnimationName('stand')
  }
  this.rata.update(delta);
  //this._camControls.update(delta);
}

World.prototype.addObject = function(object) {
  this._objects.push(object);
  this._scene.add(object);
}

World.prototype.load = function(objMtlLoader, jsonLoader) {
  var self = this;
  objMtlLoader.load("resources/SnowTerrain/SnowTerrain.obj",
                    "resources/SnowTerrain/SnowTerrain.mtl",
                    function(obj) {
                      self._terrain = obj;
                    });
  this._player.load(jsonLoader);
  this.rata = new THREEx.MD2CharacterRatmahatta();
  this._skyTexture = THREE.ImageUtils.loadTexture('resources/background.jpg');

}
