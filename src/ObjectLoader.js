var loadModel = function(modelPath, materialPath) {
  var objLoader = new THREE.OBJMTLLoader;
  var pmodel = new THREE.Object3D();
  objLoader.load(modelPath, materialPath, function(obj) {
    pmodel.add(obj);
  });
  return pmodel;
}
