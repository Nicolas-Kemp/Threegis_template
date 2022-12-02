let aoi_map;
const loader = new THREE.GLTFLoader();



window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize(){

        camera.aspect = (window.innerWidth)  / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( (window.innerWidth) , window.innerHeight );
        renderer.setClearColor( 0xFFA03B, 0 );

    }

//Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.00001, 200 );
let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.setClearColor( 0xFFA03B, 0 );
let trade_y = aoi_centroid[1];
let trade_x = aoi_centroid[0];


camera.position.x = trade_y-(aoi_vertices[0] - aoi_vertices.at(-3))/2;
camera.position.y = (aoi_vertices[0] - aoi_vertices.at(-3))+0.02;
camera.position.z = trade_x;


// LAYERS TO ADD TO THE SCENE //
 // Base relief map
let geometry_aoi = new THREE.BufferGeometry();
geometry_aoi.setIndex(aoi_indices);
geometry_aoi.setAttribute( 'position', new THREE.BufferAttribute( aoi_vertices, 3 ) );
geometry_aoi.setAttribute( 'uv', new THREE.BufferAttribute( aoi_uvs, 2 ) );
geometry_aoi.computeVertexNormals();

//light
const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
scene.add( light );

//Add to view
document.getElementById("webgl_id").appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};

THREE.MapControls = function ( object, domElement ) {

    THREE.OrbitControls.call( this, object, domElement );

    this.mouseButtons.LEFT = THREE.MOUSE.PAN;
    this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

    this.touches.ONE = THREE.TOUCH.PAN;
    this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

};

THREE.MapControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.MapControls.prototype.constructor = THREE.MapControls;



controls = new THREE.MapControls.prototype.constructor( camera, renderer.domElement );
controls.target.set(aoi_centroid[1],0,aoi_centroid[0]);
controls.maxPolarAngle = Math.PI/2;
controls.zoomSpeed = 0.4;
controls.position0 = 0;
controls.screenSpacePanning = false;
controls.update();
//controls.addEventListener('change', onPositionChange);
animate();

