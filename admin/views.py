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

import enchant_importer
import title_importer
import weapon_importer

from mabi.enchant import Enchant
from mabi.title import Title

from mabi.weapon_class import WeaponClass
from mabi.weapon_upgrade import WeaponUpgrade
from mabi.weapon import Weapon
from admin.source import Source

def add_source(name, type, url):
    source = Source(name=name,
                    type=type,
                    url='http://mabinogi.wikiwiki.jp/index.php?' + url)
    source.put()

def setup(request):
    '''初期設定/HTMLキャッシュのクリアを行う'''

    db.delete(Source.all())
    
    add_source(name=u'suffix(英字)',
               type=u'enchant',
               url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fsuffix%28%C0%DC%C8%F8%29%2F%B1%D1')
    
    add_source(name=u'suffix(数字)',
               type=u'enchant',
               url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fsuffix%28%C0%DC%C8%F8%29%2F%BF%F4')
    
    add_source(name=u'prefix(英字)',
               type=u'enchant',
               url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fprefix%28%C0%DC%C6%AC%29%2F%B1%D1')
    
    add_source(name=u'prefx(数字)',
               type=u'enchant',
               url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fprefix%28%C0%DC%C6%AC%29%2F%BF%F4')
    
    # add_source(name=u'未実装ES',
    #            type=u'enchant_unimplemented',
    #            url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2F%CC%A4%BC%C2%C1%F5ES')
    
    add_source(name=u'タイトル1～20', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F1%A1%C120')
    add_source(name=u'タイトル21～40', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F21%A1%C140')
    add_source(name=u'タイトル41～60', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F41%A1%C160')
    add_source(name=u'タイトル61～80', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F61%A1%C180')
    add_source(name=u'タイトル81～100', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F81%A1%C1100')
    add_source(name=u'タイトルその他', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F%A4%BD%A4%CE%C2%BE')
    add_source(name=u'タイトルシールブレイカー', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F%A5%B7%A1%BC%A5%EB%A5%D6%A5%EC%A5%A4%A5%AB%A1%BC')
    add_source(name=u'タイトルスキルマスター', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F%A5%B9%A5%AD%A5%EB%A5%DE%A5%B9%A5%BF%A1%BC')


    add_source(name=u'刀剣類',
               type=u'equipments',
               url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%C5%E1%B7%F5%CE%E0')

    return HttpResponseRedirect(reverse('admin.views.index'))

def _put_enchants(enchants):
    result = []
    for enchant in enchants:
        model = Enchant.create_or_update(**enchant)
        result.append(model)
    return result

def _put_titles(items):
    result = []
    for item in items:
        model = Title.create_or_update(
            name=item['name'],
            effects = [unicode(e) for e in item['effects']]
            )
        result.append(model)
    return result

# Source.type に関する情報
types = {
    'enchant': {
        'parser': enchant_importer.parse,
        'saver': _put_enchants,
        'result_page': 'import_result.html'
        },
    'title': {
        'parser': title_importer.parse,
        'saver': _put_titles,
        'result_page': 'titles.html'
        }
}

def index(request):
    """取り込み元一覧を表示する
    """
    
    context = {
        'sources': Source.all(),
        'weapon_classes': WeaponClass.all(),
        }

    return direct_to_template(request, 'index.html', context)

def source_content(request, key):
    """取り込み元の内容を返す"""

    source = Source.get(db.Key(key))

    context = {
        'content': source.content
        }

    return direct_to_template(request, 'content.html', context)

def _import_equipments(source):
    weapon_importer.import_equipments(source.url, source.content)
    
    return HttpResponseRedirect(reverse('admin.views.index'))

def import_data(request, key):
    """取り込み元の内容を取り込む"""

    source = Source.get(db.Key(key))
    source.load()
    source.put()

    type_info = types[source.type]

    result = type_info['parser'](source.url, source.content)
    result = type_info['saver'](result)

    context = {
        'result': result
        }
    return direct_to_template(request, type_info['result_page'], context)

    # if source.type == u'enchant_unimplemented':
    #     result = enchant_importer.parse_unimplemented(source.url, source.content)
    #     context = {
    #         'result': result
    #         }
    #     for a in result: a.put()
    #     return direct_to_template(request, 'import_result.html', context)
    # elif source.type == u'weapon':
    #     weapon_class, upgrades = weapon_importer.import_data(source.url, source.content)
    #     context = {
    #         'weapon_class': weapon_class,
    #         'upgrades': upgrades,
    #         'weapons': Weapon.all().filter('weapon_class = ', weapon_class), # todo 条件足りない
    #         }
    #     return direct_to_template(request, 'import_result_weapons.html', context)
    # else:
    #     return map[source.type](source)

def _update_weapon(weapon_class, upgrades, process):
    '''
    Arguments:
        
    '''

    times = len(process) # 何回目の改造か(0-). 0 のときは無改造
    url = reverse('admin.views.update_weapon_sequences')

    name = unicode(times) + '-' + u'-'.join([unicode(hash(a.name)) for a in [weapon_class] + process]) # 名前をつけるのはデバッグ用
    
    if times < 3:
        # process までの改造を登録する
        taskqueue.add(url=url,
                      # name=name,
                      params={
                'weapon_class_key': weapon_class.key(),
                'upgrade_keys': u','.join([unicode(i.key()) for i in process]),
                'upgrade_max': times,
                })
        for u in upgrades:
            if u.ug_min <= times <= u.ug_max:
                _update_weapon(weapon_class, upgrades, process + [u])
    else: # これ以降の times は登録時にループする
        taskqueue.add(url=url,
                      # name=name,
                      params={
                'weapon_class_key': weapon_class.key(),
                'upgrade_keys': u','.join([unicode(i.key()) for i in process]),
                'upgrade_max': -1,
                })
        return
        


def update_weapon(request):
    """指定された武器の情報を更新する"""

    w = WeaponClass.get(request.POST['key'])
    
    _update_weapon(w, w.upgrades, [])

    return HttpResponseRedirect(reverse('admin.views.index'))

def update_weapon_sequences(request):
    """指定された武器の情報を更新する"""

    w = WeaponClass.get(request.POST['weapon_class_key'])
    max = int(request.POST['upgrade_max'])
    if len(request.POST['upgrade_keys']) == 0:
        u = []
    else:
        u = [WeaponUpgrade.get(ukey) for ukey in request.POST['upgrade_keys'].split(',')]

    logging.info(u'update_sequence: ' + unicode(max))

    weapon_importer.update_sequences(w, u, max)

    return HttpResponse()

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


