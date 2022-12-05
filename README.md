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

'''dict_fishriverwalk = three_func.import_spatial_layer(self.tiff_fishriverwalk, "fishriverwalk").object_dict()'''

The impor_spatial_layer class detects whether the imput is a valid tiff file and passes it to the raster class. The raster class extracts all necessary information and package and return a dictionary by calling object_dict().








    
