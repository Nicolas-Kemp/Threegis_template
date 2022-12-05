# Threegis_template

This Django template include the basics needed to visualise a dem (digital elevation model) in 3D. 

Included in this template are a few class methods stored under threegis->threed_func.py, which converts a dem to a dictionary contaianing the following:
* vertices
* indices
* uvs
* ulx (upper left x)
* uly (upper left y)
* lrx (lower right x)
* lry (lower right y)
* xres (x resolution)
* yres (y resolution)
* centroid
* height_colours (Different colours for heights falling in the following percentiles: 5, 15, 30, 40, 60, 75, 85, 97)


## Example

### Calling The Raster Class

You will need to pass in a tiff or tif file acompanied by a name. The name will be used a prefix for the dictionary items created.
it is also possible to add a bounding box by including tiff_bbox=[minx, maxy, maxx, miny].

example call:

```
dict_fishriverwalk = three_func.import_spatial_layer(self.tiff_fishriverwalk, "fishriverwalk").object_dict()
```

The impor_spatial_layer class detects whether the imput is a valid tiff file and passes it to the raster class. The raster class extracts all necessary information and package and return a dictionary by calling object_dict().

### Create JAvaScript Variables
Convert the dictionary items to the correct three.js format by creating the following JavaScript variables inside the project's html file:

```
    <script>
            const fishriverwalk_vertices = new Float32Array({{fishriverwalk_vertices}})
            const fishriverwalk_indices = {{fishriverwalk_indices}}
            const fishriverwalk_uvs = new Float32Array({{fishriverwalk_uvs}})
            const fishriverwalk_ulx = {{fishriverwalk_ulx}}
            const fishriverwalk_uly = {{fishriverwalk_uly}}
            const fishriverwalk_lrx = {{fishriverwalk_lrx}}
            const fishriverwalk_lry = {{fishriverwalk_lry}}
            const fishriverwalk_centroid = {{fishriverwalk_centroid}}
            const fishriverwalk_scale = {{fishriverwalk_scale}}
    </script>
```

### THREE.JS

```
let bufg_fishriver = new THREE.BufferGeometry();
bufg_fishriver.setIndex(fishriverwalk_indices);
bufg_fishriver.setAttribute( 'position', new THREE.BufferAttribute( fishriverwalk_vertices, 3 ) );
bufg_fishriver.setAttribute( 'uv', new THREE.BufferAttribute( fishriverwalk_uvs, 2 ) ); //necessary to drape image over raster
bufg_fishriver.computeVertexNormals();
let todelete;

//colour image (satellite image)
let img_fishriverwalk = new THREE.TextureLoader().load('static/images/fishriver_walk_ex.jpeg');
//black and white image (black = 100% transparent)
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
map_fishriver.scale.y = 0.00001; //height exaggeration value
scene.add( map_fishriver );

```







    
