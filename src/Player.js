"use strict";

function Player() {
	this._terrain = null;
	this._model = null;
	this._goal = new THREE.Vector2(0, 0);
}

Player.prototype.load = function() {
	this._model = new THREEx.MD2CharacterRatmahatta();
}

Player.prototype.init = function(scene, terrain) {
	this._terrain = terrain;
	this._model.setSkinName('ctf_r');
	this._model.setWeaponName('w_sshotgun');
	scene.add(this._model.character.object3d);
	this._model.character.object3d.position.y =
	this._terrain.getHeightAtPoint(this._model.character.object3d.position);
	
	var self = this;
	document.body.addEventListener('keydown', function(event) {
		var inputs = self._model.controls.inputs
		if (event.keyCode === 'W'.charCodeAt(0))
			inputs.up = true
		if (event.keyCode === 'S'.charCodeAt(0))
			inputs.down = true
		if (event.keyCode === 'A'.charCodeAt(0))
			inputs.left = true
		if (event.keyCode === 'D'.charCodeAt(0))
			inputs.right = true
		if (event.keyCode === 38)
			inputs.up = true
		if (event.keyCode === 40)
			inputs.down = true
		if (event.keyCode === 37)
			inputs.left = true
		if (event.keyCode === 39)
			inputs.right = true
	});
	document.body.addEventListener('keyup', function(event) {
		var inputs = self._model.controls.inputs
		if (event.keyCode === 'W'.charCodeAt(0))
			inputs.up = false
		if (event.keyCode === 'S'.charCodeAt(0))
			inputs.down = false
		if (event.keyCode === 'A'.charCodeAt(0))
			inputs.left = false
		if (event.keyCode === 'D'.charCodeAt(0))
			inputs.right = false
		if (event.keyCode === 38)
			inputs.up = false
		if (event.keyCode === 40)
			inputs.down = false
		if (event.keyCode === 37)
			inputs.left = false
		if (event.keyCode === 39)
			inputs.right = false
	});
}

Player.prototype.getPosition = function() {
	return this._model.character.object3d.position;
}

Player.prototype.setGoal = function(goal) {
	if (goal instanceof THREE.Vector2 || goal instanceof THREE.Vector3) {
		this._goal.x = goal.x;
		this._goal.y = goal.y;
	} else {
		this._goal.x = goal[0];
		this._goal.y = goal[1];
	}
}

Player.prototype.update = function(delta) {
	var pos = this.getPosition();
	var height = this._terrain.getHeightAtPoint(pos);
	var diff = Math.abs(pos.y-height)*10;
	
	if(pos.y > height){
		this._model.character.object3d.position.y -= (0.5+diff)*delta;
	}
	if(pos.y < height){
		this._model.character.object3d.position.y += (0.5+diff)*delta;
	}
	
	var inputs = this._model.controls.inputs;
	if(inputs.up || inputs.down){
		this._model.setAnimationName("run");
	} else{
		this._model.setAnimationName("stand");
	}
	
	this._model.update(delta);
}