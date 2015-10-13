"use strict";

var init = function(){
    var aspect = window.innerWidth / window.innerHeight;
    var fov = 70;
    var near = 0.1;
    var far = 1000;
    
    var canvas = document.getElementById("canvas");
    var renderer = new THREE.WebGLRenderer({
        canvas: canvas, antialias: false
    });
    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    
    var scene = new THREE.Scene();
    
    var sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    
    var testSphere = new function(){
        this.texture = null;
        this.material = null;
        this.mesh = null;
        
        this.init = function(){
            this.texture = THREE.ImageUtils.loadTexture("textures/jupiter.jpg");
            this.material = THREE.MeshPhongMaterial({ map: this.texture });
            this.mesh = new THREE.Mesh(sphereGeometry, this.material);
        }
    }
    testSphere.init();
    
    scene.add(testSphere.mesh);
    
    var light = new function(){
        this.point = null;
        this.ambient = null
        this.point.position.z = null;
        this.point.position.y = null;
        
        this.init = function(){
            this.point = new THREE.PointLight(0xFFFFFF, 5);
            this.ambient = new THREE.AmbientLight(0x888888);
            this.point.position.z = 10;
            this.point.position.y = 10;
        }
    }
    light.init();
    
    scene.add(light.point);
    scene.add(light.ambient);
    camera.position.z = 10;
    
    renderer.setClearColor(0x000000);
    
    function render(){
        renderer.setSize(window.innerWidth, window.innerHeight);
        testSphere.mesh.rotation.y += 0.05;
        renderer.render(scene, camera);
        window.requestAnimFrame(render);
    }
    
    render();
}


window.addEventListener("load", init);

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
