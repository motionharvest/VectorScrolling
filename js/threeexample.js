function ThreeExample(hor){
    var size, renderer, scene, camera, light, objectHolder, geom, geomMaterial;
    size = {x:1600, y:800};
    
    //Main scene
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(size.x, size.y);
    scene = new THREE.Scene();
    camera = new THREE.Camera( 45, size.x/size.y, 0.1, 10000 );
    camera.position.y = 150;
    camera.position.z = 1000;
    
    var $core = renderer.domElement;
    
    this.core = function(){
        return $core;
    }
    
    
    objectHolder = new THREE.Object3D();
    scene.addObject(objectHolder);
    
    geomMaterial = new THREE.MeshLambertMaterial( { color: 0xdfdfdf, shading: THREE.FlatShading } );
    
    //Default lights
    var ambientLight = new THREE.AmbientLight( 0xbcbcbc );
    scene.addLight( ambientLight );
    
    var directionalLight = new THREE.DirectionalLight( 0xaaaaaa );
    directionalLight.position.y = .3;
    scene.addLight( directionalLight );
    
    directionalLight = new THREE.DirectionalLight( 0xaaaaaa );
    directionalLight.position.y = -.3;
    scene.addLight( directionalLight );
    
    //Scene objects
    //Radians used, degrees commented
    //Scaling used, multiply scale by hard coded object size to get actual size
    geom = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), geomMaterial );
    geom.position.x = -125.50;
    geom.position.z = -299.00;
    geom.rotation.x = -0.01; //-0.29 degrees
    geom.rotation.y = 0.02; //1.15 degrees
    objectHolder.addChild(geom);
    
    geom = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), geomMaterial );
    geom.position.x = 204.00;
    geom.position.z = -12.00;
    objectHolder.addChild(geom);
    
    geom = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), geomMaterial );
    geom.position.x = -234.50;
    geom.position.z = -653.00;
    geom.rotation.y = 0.01; //0.29 degrees
    objectHolder.addChild(geom);
    
    geom = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), geomMaterial );
    geom.position.x = 117.00;
    geom.position.y = 152.00;
    geom.position.z = -214.00;
    objectHolder.addChild(geom);
    
    geom = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), geomMaterial );
    geom.position.x = -150.50;
    geom.position.y = 144.50;
    objectHolder.addChild(geom);
    
    geom = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), geomMaterial );
    geom.position.x = -66.50;
    geom.position.z = 191.50;
    objectHolder.addChild(geom);
    
    var cameraZ = 1000;
    var _offset = -400;
    
    this.focus = function(){
      $(window).bind("scroll.three", scroll)  
    };
    function scroll(e){
        cameraZ = MathUtils.map(_offset, -400, 400, 1000, 100);
    }
    
    this.render = function(offset){
        _offset = offset;
        camera.position.z = ((cameraZ - camera.position.z) / 30) + camera.position.z;
        renderer.render(scene, camera);
    }
    
    this.blur = function(){
        $(window).unbind('scroll.three');
    };
    
    
    
    renderer.render(scene, camera);
}