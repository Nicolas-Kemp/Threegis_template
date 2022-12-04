# Threegis_template

This Django template include the basics needed to visualise a dem (digital elevation model) in 3D. 

Included in this template are a few class methods found in threegis->threed_func.py, which converts a dem to a dictionary contaianing the following:
    vertices
    indices
    uvs
    ulx (upper left x)
    uly (upper left y)
    lrx (lower right x)
    lry (lower right y)
    xres (x resolution)
    yres (y resolution)
    centroid
    height_colours (Different colours for heights falling in the following percentiles: 5, 15, 30, 40, 60, 75, 85, 97)
    
    
