function loadModel(modelPath, materialPath) {
  var objLoader = new THREE.OBJMTLLoader;
  var pmodel = new THREE.Object3D();
  objLoader.load(modelPath, materialPath, function(obj) {
    pmodel.add(obj);
  });
  return pmodel;
}

/*
function loadJson(jsonLoader, jsonPath) {
  var model = null;
  jsonLoader.load(jsonPath, function(geometry, materials) {
    model = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
  });
  return model;
}
*/
