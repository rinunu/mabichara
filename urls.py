# -*- coding: utf-8 -*-
from django.conf.urls.defaults import *
from django.conf import settings

urlpatterns = patterns(
    '',
    (r'^$', 'django.views.generic.simple.direct_to_template',
     {'template': 'main.html'}),

    (r'^spec$', 'django.views.generic.simple.direct_to_template',
     {'template': 'SpecRunner.html'}),

    (r'^admin/', include('admin.urls')),
    (r'', include('mabi.urls')),
)

if settings.MEDIA_DEV_MODE:
    from mediagenerator.urls import urlpatterns as mediaurls
    urlpatterns += mediaurls

