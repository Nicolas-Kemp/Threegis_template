from osgeo import gdal
import numpy as np
import imghdr


def smooth(y, box_pts):
    box = np.ones(box_pts)/box_pts
    y_smooth = np.convolve(y, box, mode='same')
    return y_smooth

def import_spatial_layer(geo_dataframe, layer_name, **kwargs):
    height_map = []
    if kwargs.get("height_map"):
        height_map = kwargs.get("height_map")

    try:
        geo_dataframe.geometry.all()
    except:
        try:
            imghdr.what(geo_dataframe)
        except:
            print("could not find a valid geopandas or tif/tiff file")
            return
        else:
            if imghdr.what(geo_dataframe) == 'tiff' or imghdr.what(geo_dataframe) == 'tif':
                if 'tiff_bbox' in kwargs:
                    return RasterToThreeD(geo_dataframe, layer_name, tiff_bbox=kwargs.get('tiff_bbox'))
                else:
                    return RasterToThreeD(geo_dataframe, layer_name)
            else: print("raster file not in tiff/tif format")


class RasterToThreeD:
    vertices = []
    indices = []
    uvs = []
    tiff_transform = []
    tiff_width = []
    tiff_height = []
    tiff_values = []
    tiff_ulx = []
    tiff_uly = []
    tiff_lrx = []
    tiff_lry = []
    tiff_xres = []
    tiff_yres = []
    tiff_centroid = []
    height_colours = []

    def __init__(self, raster_layer, layer_name, **kwargs):
        if imghdr.what(raster_layer) == 'tiff' or imghdr.what(raster_layer) == 'tif':
            self.base_tiff = gdal.Open(raster_layer)
            if 'tiff_bbox' in kwargs:
                try:
                    self.base_tiff = gdal.Translate('', self.base_tiff, projWin=kwargs.get('tiff_bbox'), format='MEM')
                except:
                    "Bounding box is incorrect"
                    return
        else:
            print("raster layer should be in .tiff or .tif format")
            return
        self.layer_name = layer_name
        self.raster_info()

    def return_raster(self):
        return self.base_tiff

    def object_dict(self):
        self.vertices = self.raster_vertexarray()
        scale = max(self.vertices)-min(self.vertices)
        self.indices = self.raster_indexarray()
        self.uvs = self.raster_uvarray()
        self.height_colours = self.raster_colours()
        return {
            f'{self.layer_name}_vertices': self.vertices,
            f'{self.layer_name}_indices': self.indices,
            f'{self.layer_name}_uvs': self.uvs,
            f'{self.layer_name}_ulx': self.tiff_ulx,
            f'{self.layer_name}_uly': self.tiff_uly,
            f'{self.layer_name}_lrx': self.tiff_lrx,
            f'{self.layer_name}_lry': self.tiff_lry,
            f'{self.layer_name}_centroid': self.tiff_centroid,
            f'{self.layer_name}_scale': scale,
        }

    def raster_info(self):
        self.tiff_transform = self.base_tiff.GetGeoTransform()
        self.tiff_width = self.base_tiff.RasterXSize
        self.tiff_height = self.base_tiff.RasterYSize
        self.tiff_values = self.base_tiff.ReadAsArray()
        #self.tiff_values = (tiff_values - tiff_values.min()) / tiff_values.ptp() * 0.01
        self.tiff_ulx, self.tiff_xres, tiff_xskew, self.tiff_uly, tiff_yskew, self.tiff_yres = self.base_tiff.GetGeoTransform()
        self.tiff_lrx = self.tiff_ulx + (self.tiff_width * self.tiff_xres)
        self.tiff_lry = self.tiff_uly + (self.tiff_height * self.tiff_yres)
        centrx = (self.tiff_ulx + self.tiff_lrx) / 2
        centry = (self.tiff_uly + self.tiff_lry) / 2
        self.tiff_centroid = list([centrx, centry])

    def raster_bounds(self):
        return [self.tiff_ulx, self.tiff_lry,self.tiff_lrx, self.tiff_uly]

    def poly_extent(self, poly):
        base_tiff = self.base_tiff

        try:
           poly.total_bounds
        except:
            print("Warning: Clip layer is not a valid Geopandas dataframe. The entire raster will be returned")
        else:
            ulx, lry, lrx, uly = poly.total_bounds
            clip_tiff = gdal.Translate('/vsimem/clip.tif', self.base_tiff, projWin=[ulx, uly, lrx, lry])
            base_tiff = gdal.Open('/vsimem/clip.tif')

        return base_tiff

    def raster_vertexarray(self):

        x = np.arange(0, self.tiff_width) * self.tiff_transform[1] + self.tiff_transform[0]
        y = np.arange(0, self.tiff_height) * self.tiff_transform[5] + self.tiff_transform[3]
        xx, yy = np.meshgrid(x, y)

        vertices = np.vstack((xx, yy, self.tiff_values)).reshape([3, -1]).transpose()
        vertices[:, [0, 1, 2]] = vertices[:, [1, 2, 0]]
        # vertices[:,2] = savgol_filter(vertices[:,2], 51, 3)
        # #vertices[:,2] = smooth(vertices[:,2], 10)
        # # vertices[:,2] = [0 if x < 0.1 else x for x in vertices[:,2]]
        vertices = vertices.flatten().tolist()
        return list(vertices)

    def raster_indexarray(self):

        ai = np.arange(0, self.tiff_width - 1)
        aj = np.arange(0, self.tiff_height - 1)
        aii, ajj = np.meshgrid(ai, aj)
        a = aii + ajj * self.tiff_width
        a = a.flatten()

        tria = np.vstack((a, a + self.tiff_width, a + self.tiff_width + 1, a, a + self.tiff_width + 1, a + 1))
        triangles = np.transpose(tria).reshape([-1, 3])
        triangles = triangles.flatten().tolist()
        return list(triangles)

    def raster_uvarray(self):
        x_perc = 0
        y_perc = 1
        x_stepsize = 1 / (self.tiff_width - 1)
        y_stepsize = (1 / (self.tiff_height - 1)) * -1
        uv_list = []
        for y_step in range(self.tiff_height):
            for x_step in range(self.tiff_width):
                uv_list.append([round(x_perc, 4), round(y_perc, 4)])
                x_perc += x_stepsize
            y_perc += y_stepsize
            x_perc = 0

        uv_list = np.array(uv_list).flatten()
        uv_list[uv_list <= 0] = 0
        return list(uv_list)

    def raster_colours(self):
        vertices = self.raster_vertexarray()
        color_theme_1 = [[0, 156, 239], [58, 178, 243], [114, 240, 162],
                         [34, 173, 29], [252, 233, 79], [255, 198, 136], [255, 149, 35]
            , [242, 80, 34], [247, 0, 0]]
        color_theme_1 = [item / 255 for sublist in color_theme_1 for item in sublist]
        color_theme_1 = np.array(color_theme_1).reshape([-1, 3])
        height_val = np.array(vertices).reshape([-1, 3])[:, 1]
        height_val_quant = [val for val in height_val if val > 0]
        height_quant = np.percentile(height_val_quant, [5, 15, 30, 40, 60, 75, 85, 97])
        list_colors = []
        for i, height in enumerate(height_val):
            if height <= 0:
                list_colors.append(color_theme_1[0])
            elif height <= height_quant[1]:
                list_colors.append(color_theme_1[1])
            elif height <= height_quant[2]:
                list_colors.append(color_theme_1[2])
            elif height <= height_quant[3]:
                list_colors.append(color_theme_1[3])
            elif height <= height_quant[4]:
                list_colors.append(color_theme_1[4])
            elif height <= height_quant[5]:
                list_colors.append(color_theme_1[5])
            elif height <= height_quant[6]:
                list_colors.append(color_theme_1[6])
            elif height <= height_quant[7]:
                list_colors.append(color_theme_1[7])
            else:
                list_colors.append(color_theme_1[8])

        list_colors = np.array(list_colors).flatten().tolist()
        return {f'{self.layer_name}_colors': list(list_colors)}
