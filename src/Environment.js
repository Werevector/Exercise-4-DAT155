function Environment() {
  this._trees = null;
  this._tree = null;

  this._rocks = null;
  this._rock = null;
}

Environment.prototype.loadTreeModel = function(objectMaterialLoader) {
  var self = this;
  objectMaterialLoader.load(
    'resources/models/lowpolytree.obj',
    'resources/models/lowpolytree.mtl',
    function(loadedObject) {
      "use strict";
      // Custom function to handle what's supposed to happen once we've loaded the model

      var bbox = new THREE.Box3().setFromObject(loadedObject);
      console.log(bbox);
      self._tree = loadedObject;
    });
}

Environment.prototype.loadRockModel = function(objectMaterialLoader) {
  var self = this;
  objectMaterialLoader.load(
    'resources/models/Rock1.obj',
    'resources/models/Rock1.mtl',
    function(loadedObject) {
      "use strict";
      // Custom function to handle what's supposed to happen once we've loaded the model

      var bbox = new THREE.Box3().setFromObject(loadedObject);
      console.log(bbox);
      self._rock = loadedObject;
    });
}

Environment.prototype.setupTrees = function(terrain, scene) {
  "use strict";

  var worldMapWidth = 250;
  var worldMapDepth = 250;
  var worldMapMaxHeight = 100;

  var maxNumObjects = 70;
  var spreadCenter = new THREE.Vector3(-0.2 * worldMapWidth, 0, -0.2 * worldMapDepth);
  var spreadRadius = 0.5 * worldMapWidth;
  //var geometryScale = 30;

  var minHeight = 1;
  var maxHeight = 5;
  var maxAngle = 30 * Math.PI / 180;

  // var scaleMean = 100;
  // var scaleSpread = 40;
  // var scaleMinimum = 10;

  var scaleMean = 0;
  var scaleSpread = 0;
  var scaleMinimum = 0;


  var generatedAndValidPositions = generateRandomData(maxNumObjects,
    generateGaussPositionAndCorrectHeight.bind(null, terrain, spreadCenter, spreadRadius),
    // The previous is functionally the same as
    // function() {
    //      return generateGaussPositionAndCorrectHeight(terrain, spreadCenter, spreadRadius)
    // }

    // If you want to accept every position just make function that returns true
    positionValidator.bind(null, terrain, minHeight, maxHeight, maxAngle),

    // How many tries to generate positions before skipping it?
    5
  );

  var generatedAndValidScales = generateRandomData(generatedAndValidPositions.length,

    // Generator function
    function() {
      return Math.abs(scaleMean + randomGauss() * scaleSpread);
    },

    // Validator function
    function(scale) {
      return scale > scaleMinimum;
    }
  );

  var numObjects = generatedAndValidPositions.length;

  var bbox = new THREE.Box3().setFromObject(this._tree);
  console.log(bbox);

  var terrheight = 0;
  for (var i = 0; i < numObjects; ++i) {
    var object = this._tree.clone();

    // We should know where the bottom of our object is
    object.position.copy(generatedAndValidPositions[i]);
    terrheight = terrain.getHeightAtPoint(object.position);
    object.position.y = terrheight + 1.5;//bbox.min.y * terrheight;

    // object.scale.set(
    //   generatedAndValidScales[i],
    //   generatedAndValidScales[i],
    //   generatedAndValidScales[i]
    // );

    object.name = "LowPolyTree";
    //terrain.add(object);
    scene.add(object);
    //this._trees = object;
  }
}


Environment.prototype.setupRocks = function(terrain, scene) {
  "use strict";

  var worldMapWidth = 250;
  var worldMapDepth = 250;
  var worldMapMaxHeight = 100;

  var maxNumObjects = 200;
  var spreadCenter = new THREE.Vector3(-0.2 * worldMapWidth, 0, -0.2 * worldMapDepth);
  var spreadRadius = 0.5 * worldMapWidth;
  //var geometryScale = 30;

  var minHeight = 1;
  var maxHeight = 5;
  var maxAngle = 30 * Math.PI / 180;

  // var scaleMean = 100;
  // var scaleSpread = 40;
  // var scaleMinimum = 10;

  var scaleMean = 3;
  var scaleSpread = 3;
  var scaleMinimum = 1;


  var generatedAndValidPositions = generateRandomData(maxNumObjects,
    generateGaussPositionAndCorrectHeight.bind(null, terrain, spreadCenter, spreadRadius),
    // The previous is functionally the same as
    // function() {
    //      return generateGaussPositionAndCorrectHeight(terrain, spreadCenter, spreadRadius)
    // }

    // If you want to accept every position just make function that returns true
    positionValidator.bind(null, terrain, minHeight, maxHeight, maxAngle),

    // How many tries to generate positions before skipping it?
    5
  );

  var generatedAndValidScales = generateRandomData(generatedAndValidPositions.length,

    // Generator function
    function() {
      return Math.abs(scaleMean + randomGauss() * scaleSpread);
    },

    // Validator function
    function(scale) {
      return scale > scaleMinimum;
    }
  );

  var numObjects = generatedAndValidPositions.length;

  var bbox = new THREE.Box3().setFromObject(this._tree);
  console.log(bbox);

  var terrheight = 0;
  for (var i = 0; i < numObjects; ++i) {
    var object = this._rock.clone();

    // We should know where the bottom of our object is
    object.position.copy(generatedAndValidPositions[i]);
    terrheight = terrain.getHeightAtPoint(object.position);
    object.position.y = terrheight;//bbox.min.y * terrheight;

    object.scale.set(
      generatedAndValidScales[i],
      generatedAndValidScales[i],
      generatedAndValidScales[i]
    );

    object.name = "LowPolyRock";
    //terrain.add(object);
    scene.add(object);
    //this._trees = object;
  }
}

function generateGaussPositionAndCorrectHeight(terrain, center, radius) {
  "use strict";
  var pos = randomGaussPositionMaker(center, radius);
  //var pos = randomUniformPositionMaker(center, radius);
  return terrain.computePositionAtPoint(pos);
}

function positionValidator(terrain, minHeight, maxHeight, maxAngle, candidatePos) {
  "use strict";

  var normal = terrain.computeNormalAtPoint(candidatePos);
  var notTooSteep = true;

  var angle = normal.angleTo(new THREE.Vector3(0, 1, 0));
  //var maxAngle = 30 * Math.PI/180;

  if (angle > maxAngle) {
    notTooSteep = false;
  }

  var withinTerrainBoundaries = terrain.withinBoundaries(candidatePos);
  var withinHeight = (candidatePos.y >= minHeight) && (candidatePos.y <= maxHeight);

  return withinTerrainBoundaries && withinHeight && notTooSteep;
}

function makeFloat32Array(vectorList) {
  "use strict";
  var totalSize = 0;

  for (var i = 0; i < vectorList.length; ++i) {
    var v = vectorList[i];

    if (v instanceof Number || typeof(v) == "number") {
      totalSize += 1;
    } else if (v instanceof THREE.Vector2) {
      totalSize += 2;
    } else if (v instanceof THREE.Vector3) {
      totalSize += 3;
    } else if (v instanceof THREE.Vector4) {
      totalSize += 4;
    }
    /*else if (vectorList[i] instanceof THREE.Color) {
               totalSize += 3;
           }*/
  }

  var array = new Float32Array(totalSize);

  var offset = 0;

  for (var i = 0; i < vectorList.length; ++i) {
    var v = vectorList[i];

    if (v instanceof Number || typeof(v) == "number") {
      array[offset] = v;
      offset += 1;
    } else {
      v.toArray(array, offset);

      if (v instanceof THREE.Vector2) {
        offset += 2;
      } else if (v instanceof THREE.Vector3) {
        offset += 3;
      } else if (v instanceof THREE.Vector4) {
        offset += 4;
      }
      /*else if (v instanceof THREE.Color) {
                  offset += 3;
                  }*/
    }
  }

  return array;
}
