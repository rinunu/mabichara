# -*- coding: utf-8 -*-
"""
インポート管理画面
"""

import logging
from google.appengine.ext import db
from google.appengine.api.labs import taskqueue

from django.views.generic.simple import direct_to_template
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.http import HttpResponse

from ragendja.auth.decorators import staff_only

import enchant_importer
import weapon_importer
from mabi.enchant import Enchant
from mabi.weapon_class import WeaponClass
from mabi.weapon_upgrade import WeaponUpgrade
from mabi.weapon import Weapon
from admin.source import Source


@staff_only
def setup(request):
    """初期設定を行う"""

    db.delete(Source.all())
    
    source = Source(name=u'suffix(英字)',
                    type=u'enchant',
                    url=r'http://mabinogi.wikiwiki.jp/index.php?%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fsuffix%28%C0%DC%C8%F8%29%2F%B1%D1')
    source.put()
    
    source = Source(name=u'suffix(数字)',
                    type=u'enchant',
                    url=r'http://mabinogi.wikiwiki.jp/index.php?%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fsuffix%28%C0%DC%C8%F8%29%2F%BF%F4')
    source.put()
    
    source = Source(name=u'prefix(英字)',
                    type=u'enchant',
                    url=r'http://mabinogi.wikiwiki.jp/index.php?%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fprefix%28%C0%DC%C6%AC%29%2F%B1%D1')
    source.put()
    
    source = Source(name=u'prefx(数字)',
                    type=u'enchant',
                    url=r'http://mabinogi.wikiwiki.jp/index.php?%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fprefix%28%C0%DC%C6%AC%29%2F%BF%F4')
    source.put()
    
    source = Source(name=u'未実装ES',
                    type=u'enchant_unimplemented',
                    url=r'http://mabinogi.wikiwiki.jp/index.php?%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2F%CC%A4%BC%C2%C1%F5ES')
    source.put()

    source = Source(name=u'刀剣類',
                    type=u'equipments',
                    url=r'http://mabinogi.wikiwiki.jp/index.php?%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%C5%E1%B7%F5%CE%E0')
    source.put()    

    return HttpResponseRedirect(reverse('admin.views.index'))

@staff_only
def index(request):
    """取り込み元一覧を表示する
    """
    
    context = {
        'sources': Source.all(),
        'weapon_classes': WeaponClass.all(),
        }

    return direct_to_template(request, 'index.html', context)

@staff_only
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

@staff_only
def import_data(request, key):
    """取り込み元の内容を取り込む"""

    source = Source.get(db.Key(key))
    source.load()
    source.put()

    map = {
        'equipments' : _import_equipments
        }

    if source.type == u'enchant':
        result = enchant_importer.parse(source.url, source.content)
        context = {
            'result': result
            }
        for a in result: a.put()
        return direct_to_template(request, 'import_result.html', context)
    if source.type == u'enchant_unimplemented':
        result = enchant_importer.parse_unimplemented(source.url, source.content)
        context = {
            'result': result
            }
        for a in result: a.put()
        return direct_to_template(request, 'import_result.html', context)
    elif source.type == u'weapon':
        weapon_class, upgrades = weapon_importer.import_data(source.url, source.content)
        context = {
            'weapon_class': weapon_class,
            'upgrades': upgrades,
            'weapons': Weapon.all().filter('weapon_class = ', weapon_class), # todo 条件足りない
            }
        return direct_to_template(request, 'import_result_weapons.html', context)
    else:
        return map[source.type](source)

@staff_only
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
        


@staff_only
def update_weapon(request):
    """指定された武器の情報を更新する"""

    w = WeaponClass.get(request.POST['key'])
    
    _update_weapon(w, w.upgrades, [])

    return HttpResponseRedirect(reverse('admin.views.index'))

@staff_only
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

@staff_only
def update(request):
    """データを更新する(その場しのぎに)"""

    # db.delete(Weapon.all())
    ws = Weapon.all().fetch(300)
    for w in ws:
        w.delete()

    if len(ws) >= 300:
        taskqueue.add(url=reverse('admin.views.update'))
    
    context = {
        'result': None
        }

    return direct_to_template(request, 'update_result.html', context)

