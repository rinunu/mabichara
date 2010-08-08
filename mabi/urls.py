# -*- coding: utf-8 -*-

from django.conf.urls.defaults import *

urlpatterns = patterns(
    '',
    

    (url(r'^enchants$', 'django.views.generic.simple.direct_to_template', {'template': 'enchants_ajax.html'}, name='enchants_ajax')),
    # (r'^enchants$', 'mabi.views.enchants'),
    (r'^enchants\.json$', 'mabi.views.enchants_json'),
    (r'^enchants/(?P<id>.*)\.json$', 'mabi.views.enchant_json'),
    
    (r'^weapons$', 'mabi.views.weapons'),
    (r'^weapons.json$', 'mabi.views.weapons_json'),

    (url(r'^equipment$', 'django.views.generic.simple.direct_to_template', {'template': 'equipment.html'}, name='equipment')),

    (url(r'^about$', 'django.views.generic.simple.direct_to_template', {'template': 'about.html'}, name='about')),
    (url(r'^twitter_bot$', 'django.views.generic.simple.direct_to_template', {'template': 'twitter_bot.html'}, name='twitter_bot')),
    (url(r'^api_doc$', 'django.views.generic.simple.direct_to_template', {'template': 'api_doc.html'}, name='api_doc')),

    # 一時的なもの
    (url(r'^enchants2$', 'django.views.generic.simple.direct_to_template', {'template': 'enchants2.html'}, name='enchants2')),
)
