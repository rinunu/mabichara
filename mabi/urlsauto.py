from django.conf.urls.defaults import *

rootpatterns = patterns('',
    (r'^mabi/', include('mabi.urls')),
)
