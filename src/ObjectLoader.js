function loadModel(modelPath, materialPath) {
  var objLoader = new THREE.OBJMTLLoader;
  var pmodel = new THREE.Object3D();
  objLoader.load(modelPath, materialPath, function(obj) {
    pmodel.add(obj);
  });
  return pmodel;
}

function loadTexturedObj(objPath, texturePath) {
  var objLoader = new THREE.OBJLoader();
  var model = new THREE.Object3D();
  objLoader.load(objPath, function(obj) {
    obj.traverse(function(child) {
      if(child instanceof THREE.Mesh) {
        child.material.map = THREE.ImageUtils.loadTexture(texturePath);
        child.material.needsUpdate = true;
      }
    });
    model.add(obj);
  });
  return model;
}
