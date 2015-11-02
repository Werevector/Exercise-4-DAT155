function Player(){
  this._scene = null;
  this._camera = null;
  this._model = this._loadPlayerModel('resources/models/player.obj');
  //this._scene.add(this._model);
}

// Player.prototype.move(destinationPoint) {
//   //The player will use some pathfindig algorithm to move
//   //to the destination, the player will be bound to the terrain somehow
// }

// Player.prototype.turn(angle) {
//   //
// }

Player.prototype._loadPlayerModel = function(modelPath) {
  var objLoader = new THREE.OBJLoader;
  var material = new THREE.MeshBasicMaterial({
    color: 'yellow',
    side: THREE.DoubleSide
  });

  var pmodel;
  objLoader.load(modelPath, function(obj) {
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    pmodel = obj;
    //this._scene.add(obj);
  });
  return pmodel;
}

Player.prototype.setSceneP = function(scene){
  this._scene = scene;
}
