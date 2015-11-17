"use strict";

function Controller(world) {
	this.world = world;
	this.cursor = new Cursor();
	this.relativePosition = new THREE.Vector3(0, 40, 10);
	this.movementSpeed = 5;
	
	var self = this;
	document.addEventListener("mousedown", function(event) {
		var vec = new THREE.Vector3();
		var raycaster = new THREE.Raycaster();
		var dir = new THREE.Vector3();
		vec.set((event.clientX / window.innerWidth) * 2 - 1,
				- ( event.clientY / window.innerHeight ) * 2 + 1);
		raycaster.set(self.world._camera.position,
				  	  vec.sub(self.world._camera.position).normalize());
		var intersects = raycaster.intersectObjects([self.world._terrain]);
		if(intersects.length > 0) {
			self.cursor._model.position = intersects[0].point;
		}
	});
}

Controller.prototype.load = function(objMtlLoader) {
	this.cursor.load(objMtlLoader);
}

Controller.prototype.update = function(delta) {
	var pos = new THREE.Vector3();
	pos.copy(this.world._player._model.position);
	pos.add(this.relativePosition);
	this.world._camera.position.set(pos.x, pos.y, pos.z);
	this.world._camera.lookAt(this.world._player._model.position);
	this.world._camera.updateProjectionMatrix();
}
