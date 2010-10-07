from django.conf.urls.defaults import *

urlpatterns = patterns(
    'admin',
    (r'^index$', 'views.index'),

    (r'^import_data/(?P<key>.*)$', 'views.import_data'),

    (r'^setup$', 'views.setup'),
    (r'^delete_source_caches$', 'views.delete_source_caches'),

    (r'^delete_all$', 'views.delete_all'),
    (r'^delete_equipments$', 'views.delete_equipments'),

    (r'^equipments$', 'views.equipments'),
    (r'^enchants$', 'views.enchants'),
    (r'^titles$', 'views.titles'),

    # (r'^update_weapon$', 'views.update_weapon'),
    # (r'^update_weapon_sequences$', 'views.update_weapon_sequences'),

    (r'^login$', 'views.login'),
    (r'^logout$', 'views.logout'),
)
