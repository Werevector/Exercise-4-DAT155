"use strict";

function Water(height){
	this._height = height;
	this._texture = null;
	this.mesh = null;
}

Water.prototype.init = function(){
	this._texture.wrapS = this._texture.wrapT = THREE.RepeatWrapping;
	this._texture.repeat.x = this._texture.repeat.y = 60;
	
	var geom = new THREE.PlaneGeometry(256, 256, 1, 1);
	
	var material = new THREE.MeshLambertMaterial({ 
		color: 0x888888,
		map: this._texture,
		transparent: true,
		opacity: 0.5
	});
	this.mesh = new THREE.Mesh(geom, material);
	this.mesh.rotateX(-Math.PI / 2);
	this.mesh.position.y += this._height;
}

Water.prototype.load = function(){
	this._texture = THREE.ImageUtils.loadTexture("resources/water.jpg");
}