function Player(scene){
  this._scene = scene;
  this._camera = null;
  this._model = loadModel('resources/models/player.obj', 'resources/models/player.mtl');

  // THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
  // 	console.log( item, loaded, total );
  // 	if(loaded == total){
  // 		this.addObject(this.tempPlayer._model);
  // 	}
  // };
  //this._scene.add(this._model);
}

// Player.prototype.move(destinationPoint) {
//   //The player will use some pathfindig algorithm to move
//   //to the destination, the player will be bound to the terrain somehow
// }

// Player.prototype.turn(angle) {
//   //
// }

// Player.prototype._loadPlayerModel = function(modelPath, materialPath) {
//   var objLoader = new THREE.OBJMTLLoader;
//   var material = new THREE.MeshBasicMaterial({
//     color: 'yellow',
//     side: THREE.DoubleSide
//   });
//
//   var pmodel = new THREE.Object3D();
//   objLoader.load(modelPath, materialPath, function(obj) {
//     obj.traverse(function(child) {
//       if (child instanceof THREE.Mesh) {
//         //child.material = material;
//       }
//     });
//     pmodel.add(obj);
//   });
//   //this._model = pmodel;
//
//   return pmodel;
// }

Player.prototype.setSceneP = function(scene){
  this._scene = scene;
}
