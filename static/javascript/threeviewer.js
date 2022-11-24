// THREE.js BASE MAP //
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

document.getElementById("webgl_id").appendChild(renderer.domElement);

const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
scene.add( light );

let bufg_fishriver = new THREE.BufferGeometry();
bufg_fishriver.setIndex(fishriverwalk_indices);
bufg_fishriver.setAttribute( 'position', new THREE.BufferAttribute( fishriverwalk_vertices, 3 ) );
bufg_fishriver.setAttribute( 'uv', new THREE.BufferAttribute( fishriverwalk_uvs, 2 ) );
bufg_fishriver.computeVertexNormals();
let todelete;

let img_fishriverwalk = new THREE.TextureLoader().load('static/images/fishriver_walk_ex.jpeg');
let img_fishriverwalk_alpha = new THREE.TextureLoader().load('static/images/fishriver_walk_ex_alpha.jpeg');
var tc_fishriver_walk = {
                map: img_fishriverwalk,
                roughness: 1,
                metalness: 0.1,
                alphaMap: img_fishriverwalk_alpha,
                transparent: true,
                depthTest: true

        };

if (img_fishriverwalk['image']===null) {
                console.log('texture is undefined');
                var tc_fishriver_walk = {
                color: 0xA6A4A1,
                roughness: 3,
                metalness: 0.6,
                        };
                    }

const mat_fishriver = new THREE.MeshStandardMaterial(tc_fishriver_walk);
map_fishriver = new THREE.Mesh( bufg_fishriver, mat_fishriver );
map_fishriver.scale.y = 0.00001;
scene.add( map_fishriver );


         const animate = function () {

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


        //Controls (Scene rotation with mouse/keyboard)
//          function onPositionChange(o) {
//
//                        console.log("Camera Position");
//                        console.log(camera.position);
//                        console.log("Target Position");
//                        console.log(controls.target.z);
//                      }
        const dis_c_x = 24.71308708190918
        const dis_c_y = -28.517240524291992
        console.log(fishriverwalk_centroid[0])

        controls = new THREE.MapControls.prototype.constructor( camera, renderer.domElement );
        controls.target.set(fishriverwalk_centroid[0],0,fishriverwalk_centroid[1]);
        controls.maxPolarAngle = Math.PI/2;
        controls.zoomSpeed = 0.4;
        controls.position0 = 0;
        controls.screenSpacePanning = false;
        controls.update();
        //controls.addEventListener('change', onPositionChange);
        animate();