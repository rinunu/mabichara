from django.conf.urls.defaults import *

urlpatterns = patterns(
    'admin',
    (r'^index$', 'views.index'),

    (r'^import_data/(?P<key>.*)$', 'views.import_data'),
    (r'^setup$', 'views.setup'),
    (r'^delete_all$', 'views.delete_all'),

    # (r'^update_weapon$', 'views.update_weapon'),
    # (r'^update_weapon_sequences$', 'views.update_weapon_sequences'),

    (r'^login$', 'views.login'),
    (r'^logout$', 'views.logout'),
)
