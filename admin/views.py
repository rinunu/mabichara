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

from mabi import EquipmentClass

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
        'equipments': EquipmentClass.all(),
        }

    return direct_to_template(request, 'index.html', context)

def import_data(request, key):
    """取り込み元の内容を取り込む"""

    types = {
        'enchant': {
            'result_page': 'import_result.html'
            },
        'title': {
            'result_page': 'titles.html'
            },
        'weapon_list': {
            'result_page': 'titles.html'
            },
        }


    importer = Importer()

    source = Source.get(db.Key(key))
    result = importer.import_data(source)

    context = {
        'result': result
        }

    if source.type == 'weapon_list':
        return HttpResponseRedirect(reverse('admin.views.index'))
    else:
        return direct_to_template(request, types[source.type]['result_page'], context)

def delete_all(request):
    '''データを全て削除する'''

    db.delete(Enchant.all(keys_only=True))

    context = {}

    return direct_to_template(request, 'update_result.html', context)

def login(request):
    """管理機能用のログイン画面を表示する"""

    return HttpResponseRedirect(users.create_login_url("/"))

def logout(request):
    """管理機能用のログアウト画面を表示する"""

    return HttpResponseRedirect(users.create_logout_url("/"))

# def _update_weapon(weapon_class, upgrades, process):
#     '''
#     Arguments:
        
#     '''

#     times = len(process) # 何回目の改造か(0-). 0 のときは無改造
#     url = reverse('admin.views.update_weapon_sequences')

#     name = unicode(times) + '-' + u'-'.join([unicode(hash(a.name)) for a in [weapon_class] + process]) # 名前をつけるのはデバッグ用
    
#     if times < 3:
#         # process までの改造を登録する
#         taskqueue.add(url=url,
#                       # name=name,
#                       params={
#                 'weapon_class_key': weapon_class.key(),
#                 'upgrade_keys': u','.join([unicode(i.key()) for i in process]),
#                 'upgrade_max': times,
#                 })
#         for u in upgrades:
#             if u.ug_min <= times <= u.ug_max:
#                 _update_weapon(weapon_class, upgrades, process + [u])
#     else: # これ以降の times は登録時にループする
#         taskqueue.add(url=url,
#                       # name=name,
#                       params={
#                 'weapon_class_key': weapon_class.key(),
#                 'upgrade_keys': u','.join([unicode(i.key()) for i in process]),
#                 'upgrade_max': -1,
#                 })
#         return
        


# def update_weapon(request):
#     """指定された武器の情報を更新する"""

#     w = WeaponClass.get(request.POST['key'])
    
#     _update_weapon(w, w.upgrades, [])

#     return HttpResponseRedirect(reverse('admin.views.index'))

# def update_weapon_sequences(request):
#     """指定された武器の情報を更新する"""

#     w = WeaponClass.get(request.POST['weapon_class_key'])
#     max = int(request.POST['upgrade_max'])
#     if len(request.POST['upgrade_keys']) == 0:
#         u = []
#     else:
#         u = [WeaponUpgrade.get(ukey) for ukey in request.POST['upgrade_keys'].split(',')]

#     logging.info(u'update_sequence: ' + unicode(max))

#     weapon_importer.update_sequences(w, u, max)

#     return HttpResponse()



