# -*- coding: utf-8 -*-
try:
    from djangoappengine.settings_base import *
    has_djangoappengine = True
except ImportError:
    has_djangoappengine = False
    DEBUG = True
    TEMPLATE_DEBUG = DEBUG

from settings_custom import *

import os

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
common_js = (
    'jquery.dataTables.min.js',
    'jquery.jsonp-2.1.2.min.js',

    # util
    'util/console.js',
    'util/util.js',
    'util/track.js',
    'util/command.js',
    'util/event.js',
)

# すべてのアプリケーションで使用するコード
core_js = common_js + (
    'mabi.js',

    # mabi.util
    'ajax.js',
    'util.js',
    # 'routedevent.js',
    'collection.js',

    # Model
    'element.js',
    'effect.js',
    'referenceelement.js',
    'instanceelement.js',

    'equipment.js',
    'equipmentset.js',
    'skill.js',
    'enchant.js',
    'title.js',
    'mob.js',
    'upgrade.js',
    
    'alchemy.js',

    'store.js',
    'skillstore.js',
    'enchantstore.js',
    'titlestore.js',
)

main_js = common_js + (
     # Model
     'character.js',
     'inventory.js',

     'equipmentstore.js',

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

damage_js = core_js + (
    'damage/dam.js',

    'damage/util.js',
    'damage/jquery.binding.js',

    # Model
    'damage/character.js',
    'damage/body.js',
    'damage/expression.js',
    'damage/context.js',
    'damage/condition.js',

    'damage/equipmentstore.js',

    'damage/damagedata.js',
    'damage/offensedefensedamagedata.js',

    'damage/expressions.js',

    # View
    'damage/offensesview.js',
    'damage/defensesview.js',

    'damage/damagetable.js',
    'damage/menu.js',
    'damage/help.js',
    'damage/generatorview.js',
    'damage/chartview.js',
    'damage/optionsview.js',

    # helper
    'damage/elementbuilder.js',

    'damage/builtin.js',

    'damage/main.js',
    )

MEDIA_BUNDLES = (
    ('main.css', 
     # 'theme.css',
     'common.css',
     ),

    ('damage.css', 'damage.css',),

    ('main.js',) + main_js,
    ('equipment_tmp.js',) + main_js + ('equipment_tmp.js',),
    ('damagemain.js',) + damage_js,

    ('spec.js',
     'spec/Builder.js',
     'spec/DamageSpecHelper.js',
     'spec/SpecHelper.js',

     # core
     'spec/ElementSpec.js',
     'spec/ReferenceElementSpec.js',
     'spec/InstanceElementSpec.js',
     'spec/BodySpec.js',
     'spec/EquipmentSpec.js',
     'spec/SkillSpec.js',
     'spec/EnchantSpec.js',
     'spec/UpgradeSpec.js',

     # damage
     'spec/ExpressionSpec.js',
     'spec/ContextSpec.js',
     'spec/ConditionSpec.js',
     'spec/OffenseDefenseDamageDataSpec.js',

     # 'spec/BuiltInEquipmentSpec.js',
     'spec/BuiltInWeaponsSpec.js',
     'spec/BuiltInSkillsSpec.js',

     'spec/DamageBasicSpec.js',
     'spec/DamageMagicSpec.js',
     'spec/DamageCombatSpec.js',
     'spec/DamageAlchemySpec.js',
     )
)
GLOBAL_MEDIA_DIRS = (os.path.join(os.path.dirname(__file__), 'media'),)

MEDIA_DEV_MODE = DEBUG
PRODUCTION_MEDIA_URL = '/media/'
if MEDIA_DEV_MODE:
    MEDIA_URL = '/devmedia/'
else:
    MEDIA_URL = PRODUCTION_MEDIA_URL

