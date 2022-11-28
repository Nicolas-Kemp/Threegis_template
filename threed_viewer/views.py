from django.shortcuts import render
from django.template.response import TemplateResponse
from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
import threegis.threed_func as three_func
import geopandas as gpd

class ThreeViewer(View):

    template_name = 'threed_viewer.html'
    dict_to_return = {'key': 'value'}

    tiff_hermanus = r'static/dem/hermanus.tif'
    gdf_osm_poi = gpd.read_file(r'static/gpkg/template.gpkg', layer='osm_poi')
    gdf_osm_poi_hermanus = gpd.read_file(r'static/gpkg/template.gpkg', layer='osm_poi_hermanus')
    gdf_plato = gpd.read_file(r'static/gpkg/template.gpkg', layer='plato_coffee')


    def get(self, request):
        if request.is_ajax():
            return JsonResponse(self.dict_to_return)

        dict_fishriverwalk = three_func.import_spatial_layer(self.tiff_hermanus, "aoi").object_dict()
        dict_osm_poi = three_func.import_spatial_layer(self.gdf_osm_poi, "osm_poi", height_map=self.tiff_hermanus).object_dict()
        dict_osm_poi_hermanus = three_func.import_spatial_layer(self.gdf_osm_poi_hermanus, "osm_poi_hermanus",
                                                       height_map=self.tiff_hermanus).object_dict()
        dict_plato = three_func.import_spatial_layer(self.gdf_plato, "plato", height_map=self.tiff_hermanus).object_dict()
        self.dict_to_return.update(dict_fishriverwalk)
        self.dict_to_return.update(dict_osm_poi)
        self.dict_to_return.update(dict_osm_poi_hermanus)
        self.dict_to_return.update(dict_plato)

        for keys in self.dict_to_return:
            print(keys)
        # <view logic>
        return render(request, self.template_name, self.dict_to_return)

