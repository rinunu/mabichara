from django.conf.urls.defaults import *

urlpatterns = patterns(
    'admin',
    (r'^index$', 'views.index'),
    (r'^contents/(?P<id>.*)$', 'views.source_content'),
    (r'^import_data/(?P<id>.*)$', 'views.import_data'),
    (r'^setup$', 'views.setup'),
    (r'^update$', 'views.update'),
    (r'^update_weapon$', 'views.update_weapon'),
    (r'^update_weapon_sequences$', 'views.update_weapon_sequences'),
)
