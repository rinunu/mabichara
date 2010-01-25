# -*- coding: utf-8 -*-
from django.conf.urls.defaults import *

rootpatterns = patterns('',
    (r'^app-admin/', include('admin.urls')),
)
