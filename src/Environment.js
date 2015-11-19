function Environment() {
  this._trees = null;
  this._tree = null;

  this._rocks = null;
  this._rock = null;
  this._terrainmaterial = null;
}

Environment.prototype.loadTreeModel = function(objectMaterialLoader) {
  var self = this;
  objectMaterialLoader.load(
    'resources/models/lowpolytree.obj',
    'resources/models/lowpolytree.mtl',
    function(loadedObject) {
      "use strict";
      // Custom function to handle what's supposed to happen once we've loaded the model
      loadedObject.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
          node.castShadow = true;
        }
      });

      var bbox = new THREE.Box3().setFromObject(loadedObject);
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
      loadedObject.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; } } );
      var bbox = new THREE.Box3().setFromObject(loadedObject);
      console.log(bbox);
      self._rock = loadedObject;
    });
}

Environment.prototype.loadRockModelI = function(objectMaterialLoader) {

  this._terrainmaterial = new THREE.ShaderMaterial({
    // We are reusing vertex shader from MeshBasicMaterial

    defines: {
        'USE_MAP': true
    },

    uniforms: {
                'heightMap': { type: 't', value: heightMapTexture },

                'seabed': { type: 't', value: sandTexture },
                'grass': { type: 't', value: grassTexture },
                'rock': { type: 't', value: rockTexture },
                'snow': { type: 't', value: snowTexture },

                'grassLevel': { type: 'f', value: 0.1 },
                'rockLevel': { type: 'f', value: 0.6 },
                'snowLevel': { type: 'f', value: 0.8 },

                // Scale the texture coordinates when coloring the terrain
                'terrainTextureScale': { type: 'v2', value: new THREE.Vector2(200, 200) },

                // This is a default offset (first two numbers), and repeat (last two values)
                // Just use the default values to avoid fiddling with the uv-numbers from the vertex-shader
                'offsetRepeat': { type: 'v4', value: new THREE.Vector4(0, 0, 1, 1) }
            },

    vertexShader: THREE.ShaderLib['basic'].vertexShader,
    fragmentShader: document.getElementById('terrain-fshader').textContent,
  });

  objectMaterialLoader.load(
    'models/rocks/rock1/Rock1.obj',
    'models/rocks/rock1/Rock1.mtl',
    function (loadedObject) {
        "use strict";
        // Custom function to handle what's supposed to happen once we've loaded the model

        // Extract interesting object (or modify the model in a 3d program)
        var object = loadedObject.children[1].clone();

        // Traverse the model objects and replace their geometry with an instanced copy
        // Each child in the geometry with a custom color(, and so forth) will be drawn with a
        object.traverse(function(node) {
          if (node instanceof THREE.Mesh) {
            console.log('mesh', node);

            var oldGeometry = node.geometry;

            node.geometry = new THREE.InstancedBufferGeometry();

            // Copy the the prevoius geometry
            node.geometry.fromGeometry(oldGeometry);

            // Associate our generated values with named attributes.
            node.geometry.addAttribute("translate", translationAttribute);
            node.geometry.addAttribute("scale", scaleAttribute);

            //node.geometry.scale(geometryScale, geometryScale, geometryScale);

            // A hack to avoid custom making a boundary box
            node.frustumCulled = false;

            // Set up correct material. We must replace whatever has been set with a fitting material
            // that can be used for instancing.
            var oldMaterial = node.material;
            console.log('material', oldMaterial);

            node.material = instancedMaterial.clone();
            if ("color" in oldMaterial) {
                node.material.uniforms['diffuse'] = {
                    type: 'c',
                    value: oldMaterial.color
                };
            }
          }
        });

        var bbox = new THREE.Box3().setFromObject(object);

        // We should know where the bottom of our object is
        object.position.y -= bbox.min.y;

        object.name = "RockInstanced";

        terrain.add(object);
  }
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
    object.castShadow = true;
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

Environment.prototype.setupRocksI = function(terrain, scene) {
  "use strict";
  var maxNumObjects = 2000;
  var spreadCenter = new THREE.Vector3(0.1*worldMapWidth, 0, 0.2*worldMapDepth);
  var spreadRadius = 0.2*worldMapWidth;
  //var geometryScale = 30;

  var minHeight = 0.2*worldMapMaxHeight;
  var maxHeight = 0.6*worldMapMaxHeight;
  var maxAngle = 30 * Math.PI / 180;

  var scaleMean = 50;
  var scaleSpread = 20;
  var scaleMinimum = 1;

  var generatedAndValidPositions = generateRandomData(maxNumObjects,
    //generateGaussPositionAndCorrectHeight.bind(null, terrain, spreadCenter, spreadRadius),
    // The previous is functionally the same as
    function() {
      return generateGaussPositionAndCorrectHeight(terrain, spreadCenter, spreadRadius)
    },

    // If you want to accept every position just make function that returns true
    positionValidator.bind(null, terrain, minHeight, maxHeight, maxAngle)
  );
  var translationArray = makeFloat32Array(generatedAndValidPositions);

  var generatedAndValidScales = generateRandomData(generatedAndValidPositions.length,

    // Generator function
    function() { return Math.abs(scaleMean + randomGauss()*scaleSpread); },

    // Validator function
    function(scale) { return scale > scaleMinimum; }
  );
  var scaleArray = makeFloat32Array(generatedAndValidScales);

  // Lots of other possibilities, eg: custom color per object, objects changing (requires dynamic
  // InstancedBufferAttribute, see its setDynamic), but require more shader magic.
  var translationAttribute = new THREE.InstancedBufferAttribute(translationArray, 3, 1);
  var scaleAttribute = new THREE.InstancedBufferAttribute(scaleArray, 1, 1);

  var instancedMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge(
              //THREE.UniformsLib['lights'],
              {
                  color: {type: "c", value: new THREE.Color(Math.random(), Math.random(), Math.random())}
              }
      ),
      vertexShader: document.getElementById("instanced-vshader").textContent,
      fragmentShader: THREE.ShaderLib['basic'].fragmentShader,

      //lights: true
  });

  objectMaterialLoader.load(
          'models/rocks/rock1/Rock1.obj',
          'models/rocks/rock1/Rock1.mtl',
          function (loadedObject) {
              "use strict";
              // Custom function to handle what's supposed to happen once we've loaded the model

              // Extract interesting object (or modify the model in a 3d program)
              var object = loadedObject.children[1].clone();

              // Traverse the model objects and replace their geometry with an instanced copy
              // Each child in the geometry with a custom color(, and so forth) will be drawn with a
              object.traverse(function(node) {
                  if (node instanceof THREE.Mesh) {
                      console.log('mesh', node);

                      var oldGeometry = node.geometry;

                      node.geometry = new THREE.InstancedBufferGeometry();

                      // Copy the the prevoius geometry
                      node.geometry.fromGeometry(oldGeometry);

                      // Associate our generated values with named attributes.
                      node.geometry.addAttribute("translate", translationAttribute);
                      node.geometry.addAttribute("scale", scaleAttribute);

                      //node.geometry.scale(geometryScale, geometryScale, geometryScale);

                      // A hack to avoid custom making a boundary box
                      node.frustumCulled = false;

                      // Set up correct material. We must replace whatever has been set with a fitting material
                      // that can be used for instancing.
                      var oldMaterial = node.material;
                      console.log('material', oldMaterial);

                      node.material = instancedMaterial.clone();
                      if ("color" in oldMaterial) {
                          node.material.uniforms['diffuse'] = {
                              type: 'c',
                              value: oldMaterial.color
                          };
                      }
                  }
              });

              var bbox = new THREE.Box3().setFromObject(object);

              // We should know where the bottom of our object is
              object.position.y -= bbox.min.y;

              object.name = "RockInstanced";

              terrain.add(object);
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
