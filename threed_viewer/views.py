from django.shortcuts import render
from django.template.response import TemplateResponse
from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
import threegis.threed_func as three_func

class ThreeViewer(View):

    template_name = 'threed_viewer.html'
    dict_to_return = {'key': 'value'}

    tiff_fishriverwalk = r'static/dem/hermanus_v2.tif'

    def get(self, request):
        if request.is_ajax():
            return JsonResponse(self.dict_to_return)

        dict_fishriverwalk = three_func.import_spatial_layer(self.tiff_fishriverwalk, "aoi").object_dict()

        self.dict_to_return.update(dict_fishriverwalk)
        for keys in self.dict_to_return:
            print(keys)
        # <view logic>
        return render(request, self.template_name, self.dict_to_return)
# Create your views here.
