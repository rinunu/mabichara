from django.conf.urls.defaults import *

urlpatterns = patterns(
    '',
    (url(r'^about$', 'django.views.generic.simple.direct_to_template', {'template': 'about.html'}, name='about')),
    
    (r'^enchants$', 'mabi.views.enchants'),
    (r'^weapons$', 'mabi.views.weapons'),
    (r'^weapons.json$', 'mabi.views.weapons_json'),

    (url(r'^equipment$', 'django.views.generic.simple.direct_to_template', {'template': 'equipment.html'}, name='equipment')),
)
