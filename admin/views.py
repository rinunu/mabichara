# -*- coding: utf-8 -*-
"""
インポート管理画面
"""

import logging
from google.appengine.ext import db
from google.appengine.api.labs import taskqueue
from google.appengine.api import users

from django.views.generic.simple import direct_to_template
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.http import HttpResponse

from importer import Importer

from admin.source import Source
from mabi.equipment_class import EquipmentClass
from mabi.enchant_class import EnchantClass
from mabi.title import Title
from mabi.upgrade_class import UpgradeClass
from mabi.element import Element

def setup(request):
    '''初期設定/HTMLキャッシュのクリアを行う'''
    importer = Importer()
    importer.setup()

    return HttpResponseRedirect(reverse('admin.views.index'))


def index(request):
    """取り込み元一覧を表示する
    """
    
    context = {
        'sources': Source.all(),
        }

    return direct_to_template(request, 'index.html', context)

def import_data(request, key):
    """取り込み元の内容を取り込む"""

    importer = Importer()

    source = Source.get(db.Key(key))
    result = importer.import_data(source)
    return HttpResponseRedirect(reverse('admin.views.index'))

def delete_all(request):
    '''データを全て削除する'''

    db.delete(EnchantClass.all(keys_only=True))

    context = {}

    return direct_to_template(request, 'update_result.html', context)

def delete_source_caches(request):
    Importer().delete_source_caches()
    return HttpResponseRedirect(reverse('admin.views.index'))

def delete_equipments(request):
    '''装備を全て削除する'''

    db.delete(EquipmentClass.all(keys_only=True))
    db.delete(UpgradeClass.all(keys_only=True))

    context = {}

    return HttpResponseRedirect(reverse('admin.views.index'))

def equipments(request):
    '''装備をすべて表示する'''

    equipments = []
    for i in EquipmentClass.all():
        equipments.append({
                'equipment': i,
                'upgrades': UpgradeClass.get_by_equipment(i)})
    context = {
        'items': equipments
        }
    return direct_to_template(request, 'equipments.html', context)

def enchants(request):
    '''エンチャントをすべて表示する'''

    context = {
        'items': EnchantClass.all()
        }
    return direct_to_template(request, 'enchants_admin.html', context)

def titles(request):
    '''タイトルをすべて表示する'''

    context = {
        'items': Title.all()
        }
    return direct_to_template(request, 'titles.html', context)

def login(request):
    """管理機能用のログイン画面を表示する"""

    return HttpResponseRedirect(users.create_login_url("/"))

def logout(request):
    """管理機能用のログアウト画面を表示する"""

    return HttpResponseRedirect(users.create_logout_url("/"))


