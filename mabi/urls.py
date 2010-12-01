# -*- coding: utf-8 -*-

from django.conf.urls.defaults import *

urlpatterns = patterns(
    '',
    (url(r'^simulator$', 'django.views.generic.simple.direct_to_template', {'template': 'simulator.html'}, name='simulator')),

    (url(r'^damage$', 'django.views.generic.simple.direct_to_template', {'template': 'damage/main.html'}, name='damage')),


    # 静的
    (url(r'^about$', 'django.views.generic.simple.direct_to_template', {'template': 'about.html'}, name='about')),
    (url(r'^twitter_bot$', 'django.views.generic.simple.direct_to_template', {'template': 'twitter_bot.html'}, name='twitter_bot')),
    (url(r'^api_doc$', 'django.views.generic.simple.direct_to_template', {'template': 'api_doc.html'}, name='api_doc')),

    # API
    (r'^enchants\.json$', 'mabi.views_api.enchants_json'),
    (r'^enchants/(?P<id>.*)\.json$', 'mabi.views_api.enchant_json'),

    (r'^equipments.json$', 'mabi.views_api.equipments_json'),
    (r'^equipments/(?P<id>.*)\.json$', 'mabi.views_api.equipment_json'),

    (r'^titles.json$', 'mabi.views_api.titles_json'),

)
