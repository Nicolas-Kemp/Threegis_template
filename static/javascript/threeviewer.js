let aoi_map;
const loader = new THREE.GLTFLoader();

let check_plato = document.getElementById("cb_plato");
// THREE. JS layers Buttons
$('#btn_light').click(function() {
    console.log('hello button')
    if ($('#btn_light').hasClass('btn btn-info black-background white')){
        $('#btn_light').removeClass('btn btn-info black-background white').addClass('btn btn-info white-background black');

    }else{
    $('#btn_light').removeClass('btn btn-info white-background black').addClass('btn btn-info black-background white');
    }

    if(aoi_map.material.transparent===true){
        aoi_map.material.transparent=false;

    }else{
        aoi_map.material.transparent=true;
    }
    aoi_map.material.needsUpdate = true;

  //$(this).addClass('btn btn-info').removeClass('btn-primary ');
});

function height_switch() {
  $('.button').removeClass('btn-success').addClass('btn-primary ');
  $(this).addClass('btn-success').removeClass('btn-primary ');
    if(aoi_map.material.displacementScale ===0.002){
        aoi_map.material.displacementScale = 0;
        poi_plato.position.y = poi_plato.position.y - 0.002;
        poi_osm_poi.position.y = poi_osm_poi.position.y - 0.002;
        poi_osm_poi_hermanus.position.y = poi_osm_poi_hermanus.position.y - 0.002;
    }else{
        aoi_map.material.displacementScale = 0.002;
        poi_plato.position.y = poi_plato.position.y + 0.002;
        poi_osm_poi.position.y = poi_osm_poi.position.y + 0.002;
        poi_osm_poi_hermanus.position.y = poi_osm_poi_hermanus.position.y + 0.002;
    }
    aoi_map.material.needsUpdate = true;

}

function poi_checked(cb_name, poi_name)
{

    console.log(cb_name);
    console.log(poi_name);
    let selectedObject = scene.getObjectByName(cb_name);

    console.log(renderer.info)
  if (typeof selectedObject !== 'undefined')
  {
      scene.remove( selectedObject );
  } else {
      scene.add( window[poi_name]);
  }

}




// THREE.js GLTF INSTANCING FUNCTIONS//
function object_instance(loader, object_name, scale, rotation_z, locations_vertices) {
        let model_path = '/static/gltf/' + object_name
        let object_model;
        let obj_group = new THREE.Group();
        //scene.add( obj_group );

        loader.load( model_path, function ( gltf ) {

            object_model = gltf.scene;
            object_model.traverse( function(child) {

            if (child instanceof THREE.Mesh) {

                const instanceCount = child.material.userData.instanceCount;
                const instanceID = new THREE.InstancedBufferAttribute(
                        new Float32Array( new Array( instanceCount ).fill( 0 ).map( ( _, index ) => index ) ),
                        1
                     );

                geometry = new THREE.InstancedBufferGeometry().copy( child.geometry );
                geometry.scale(scale,scale,scale);
                geometry.rotateZ((Math.PI/180)*rotation_z);
                geometry.setAttribute( 'instanceID', instanceID );
                geometry.InstancedCount = instanceCount;
                cnt_positions = geometry.attributes.position.count;

                var geom_instance = new THREE.InstancedMesh(geometry, child.material, locations_vertices.length);
                //console.log(pin_instance);
                obj_group.add(geom_instance)


            }

            });

            //scene.add( obj_group );
            y_displacement = scale*2;

            create_instances(obj_group, locations_vertices, y_displacement);

            }, undefined, function ( error ) {

                console.error( error );

        });

        return obj_group

}


function create_instances(instance_mesh_group, instance_array, y_displacement){

    instance_mesh_group.traverse( function(child) {

        if (child instanceof THREE.InstancedMesh) {


            child.matrixAutoUpdate = true;
            let vertice_locations = instance_array;
            let vertice_count = vertice_locations.length;
            let dummy_increment = 0;
            let matrix = new THREE.Matrix4();
            //let v_scale = new THREE.Vector3(0.2, 0.2, 0.2);
            for(let i = 0; i < vertice_count; i += 3){

                matrix.setPosition( vertice_locations[i],
                                    vertice_locations[i+1]+(y_displacement),
                                    vertice_locations[i+2]);
                child.setMatrixAt(dummy_increment, matrix);
                dummy_increment += 1;

            }
        }else{
            console.log('not running instance - mesh is not an object')
        }
    });
}
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
//(function(){var script=document.createElement('script');
//script.onload=function(){var stats=new Stats();
//document.body.appendChild(stats.dom);
//requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};
//script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

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

    let texture = new THREE.TextureLoader().load('static/images/hermanus.jpg');
    let a_texture = new THREE.TextureLoader().load('static/images/hermanus_alpha.jpg');

    const material_aoi = new THREE.MeshStandardMaterial();
    aoi_map = new THREE.Mesh( geometry_aoi, material_aoi );
    scene.add( aoi_map );
    aoi_map.material.map = texture;
    aoi_map.material.alphaMap = a_texture;
    aoi_map.material.displacementMap = a_texture;
    aoi_map.material.displacementScale = 0;
    aoi_map.material.transparent=false;

    aoi_map.material.metalness = 0;
    aoi_map.material.roughness = 1;
    aoi_map.material.needsUpdate = true;

    //Pins
    poi_osm_poi = object_instance(loader, 'pin_poi.gltf', 0.005, 0, osm_poi_vertices);
    poi_osm_poi.name = 'cb_osm_poi';
    poi_osm_poi_hermanus = object_instance(loader, 'pin_poi.gltf', 0.00025, 0, osm_poi_hermanus_vertices);
    poi_osm_poi_hermanus.name = 'cb_osm_poi_hermanus';
    poi_plato = object_instance(loader, 'Plato_v2.gltf', 0.001, 0, plato_vertices);
    poi_plato.name = 'cb_plato';


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

