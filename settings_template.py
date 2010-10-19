try:
    from djangoappengine.settings_base import *
    has_djangoappengine = True
except ImportError:
    has_djangoappengine = False
    DEBUG = True
    TEMPLATE_DEBUG = DEBUG

import os

SECRET_KEY = '設定してね！'

TIME_ZONE = 'Japan'

INSTALLED_APPS = (
    'djangotoolbox',
#    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'mediagenerator',
    'mabi',
    'admin'
)

if has_djangoappengine:
    INSTALLED_APPS = ('djangoappengine',) + INSTALLED_APPS

TEST_RUNNER = 'djangotoolbox.test.CapturingTestSuiteRunner'

ADMIN_MEDIA_PREFIX = '/media/admin/'
MEDIA_ROOT = os.path.join(os.path.dirname(__file__), 'media')
TEMPLATE_DIRS = (os.path.join(os.path.dirname(__file__), 'templates'),)

ROOT_URLCONF = 'urls'




# media
main_js = (
     'jquery.dataTables.min.js',
     'jquery.jsonp-2.1.2.min.js',

     # util
     'util/console.js',
     'util/util.js',
     'util/track.js',
     'util/command.js',
     'util/event.js',

     'mabi.js',

     # mabi.util
     'ajax.js',
     'routedevent.js',

     # Model
     'element.js',
     'effect.js',
     'referenceelement.js',
     'equipment.js',
     'enchant.js',
     'character.js',
     'inventory.js',
     'equipmentset.js',
     'title.js',
     'upgrade.js',

     'store.js',
     'enchantstore.js',
     'equipmentstore.js',
     'titlestore.js',

     'contextualelement.js',

     # View
     'etc.js',
     'equipmentsetview.js',
     'inventoryview.js',
     'enchantview.js',
     'equipmentview.js',
     'optionsview.js',
     'elementsview.js',
     'titleview.js',
     'upgradeview.js',

     'dummy.js',
     )
MEDIA_BUNDLES = (
    ('main.css', 
     'theme.css',
     'common.css',
     ),
    ('main.js',) + main_js,
    ('equipment_tmp.js',) + main_js + ('equipment_tmp.js',),
)
GLOBAL_MEDIA_DIRS = (os.path.join(os.path.dirname(__file__), 'media'),)

MEDIA_DEV_MODE = DEBUG
PRODUCTION_MEDIA_URL = '/media/'
if MEDIA_DEV_MODE:
    MEDIA_URL = '/devmedia/'
else:
    MEDIA_URL = PRODUCTION_MEDIA_URL

