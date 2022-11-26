let aoi_map;
const loader = new THREE.GLTFLoader();

//$('#btn_light').click(function() {
//    console.log('hello button')
//    if ($('#btn_light').hasClass('btn btn-info black-background white')){
//        $('#btn_light').removeClass('btn btn-info black-background white').addClass('btn btn-info white-background black');
//
//    }else{
//    $('#btn_light').removeClass('btn btn-info white-background black').addClass('btn btn-info black-background white');
//    }
//
//    if(aoi_map.material.transparent===true){
//        aoi_map.material.transparent=false;
//        pop_pie_mesh.material.transparent=false;
//    }else{
//        aoi_map.material.transparent=true;
//        pop_pie_mesh.material.transparent=true;
//    }
//    aoi_map.material.needsUpdate = true;
//    pop_pie_mesh.material.needsUpdate = true;
//
//
//  //$(this).addClass('btn btn-info').removeClass('btn-primary ');
//});

//function height_switch() {
//  $('.button').removeClass('btn-success').addClass('btn-primary ');
//  $(this).addClass('btn-success').removeClass('btn-primary ');
//    if(aoi_map.material.displacementScale ===0.002){
//        aoi_map.material.displacementScale = 0;
//    }else{
//        aoi_map.material.displacementScale = 0.002;
//    }
//    aoi_map.material.needsUpdate = true;
//
//}

function displacement_maps(dis_width, dis_height, res_width, res_height, centr_x, centr_y, base_img, disp_img, d_scale, alpha_img) {

    let mat_dict = {};
    let base_texture;
    let displace_texture;
    let alpha_texture;

    if (base_img === undefined){
        console.log('undefined')
        //mat_dict['map'] = 0x1D1D1E;
            }else{
                    base_texture = new THREE.TextureLoader().load('static/dpm/'+base_img)
                        mat_dict['map'] = base_texture;

                    }

    if (disp_img === undefined){
        console.log('no displacement image')
            }else{
                    displace_texture = new THREE.TextureLoader().load('static/dpm/'+disp_img)
                    mat_dict['displacementMap'] = displace_texture;
                    if (d_scale === undefined){
                          mat_dict['displacementScale'] = 1;
                    }else{mat_dict['displacementScale'] = d_scale;}

                    }

    if (alpha_img === undefined){
        console.log('no alpha image')
            }else{
                    alpha_texture = new THREE.TextureLoader().load('static/dpm/'+alpha_img)
                     mat_dict['alphaMap'] = alpha_texture;
                     mat_dict['transparent'] = true;

                    }

    const displacementMat = new THREE.MeshStandardMaterial(mat_dict);


    const displacementPlane = new THREE.PlaneBufferGeometry(dis_width, dis_height, res_width, res_height);
    displacementPlane.receiveShadow=true;
    displacementPlane.castShadow=true;

    const mesh_displacement = new THREE.Mesh( displacementPlane, displacementMat );
    scene.add( mesh_displacement );

    mesh_displacement.material.side = THREE.DoubleSide;
    mesh_displacement.rotation.set(-Math.PI*0.5, 0, -Math.PI*0.5);
    mesh_displacement.position.set(centr_y ,0, centr_x);

    return mesh_displacement
}


// THREE.js BASE MAP //
(function(){var script=document.createElement('script');
script.onload=function(){var stats=new Stats();
document.body.appendChild(stats.dom);
requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};
script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

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

			const geometry = new THREE.BoxGeometry( 1, 1, 1 );
			const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			const cube = new THREE.Mesh( geometry, material );
			scene.add( cube );

			camera.position.x = trade_y-(aoi_vertices[0] - aoi_vertices.at(-3))/2;
			camera.position.y = (aoi_vertices[0] - aoi_vertices.at(-3))+0.02;
			camera.position.z = trade_x;

let geometry_aoi = new THREE.BufferGeometry();
geometry_aoi.setIndex(aoi_indices);
//geometry_aoi.toNonIndexed();
geometry_aoi.setAttribute( 'position', new THREE.BufferAttribute( aoi_vertices, 3 ) );
geometry_aoi.setAttribute( 'uv', new THREE.BufferAttribute( aoi_uvs, 2 ) );
//geometry_aoi.setAttribute( 'color', new THREE.BufferAttribute( aoi_colors, 3 ) );
geometry_aoi.computeVertexNormals();

console.log(aoi_vertices)


let texture = new THREE.TextureLoader().load('static/images/hermanus.png');
//let a_texture = new THREE.TextureLoader().load('static/images/fishriver_walk_ex_alpha.jpeg');

const material_aoi = new THREE.MeshStandardMaterial();
aoi_map = new THREE.Mesh( geometry_aoi, material_aoi );
scene.add( aoi_map );
aoi_map.material.map = texture;
//aoi_map.material.alphaMap = a_texture;

console.log("here");
aoi_map.material.metalness = 0;
aoi_map.material.roughness = 1;
aoi_map.material.needsUpdate = true;
//aoi_map.scale.y = 0.001;


const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
scene.add( light );

const directLight_slected_area = new THREE.DirectionalLight( 0x1D1D1E, 1);
directLight_slected_area.position.set(aoi_centroid[1],1,aoi_centroid[0]+0.008);
directLight_slected_area.target.position.set(aoi_centroid[1],0,aoi_centroid[0]);
scene.add( directLight_slected_area );
scene.add(directLight_slected_area.target);

document.getElementById("webgl_id").appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

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

