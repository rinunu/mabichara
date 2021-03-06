# -*- coding: utf-8 -*-
"""
API 用のビュー

"""

import re
import logging
import types

from django.views.generic.simple import direct_to_template
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import Http404

import json

from mabi.enchant_class import EnchantClass
from mabi.equipment_class import EquipmentClass
from mabi.upgrade_class import UpgradeClass
from mabi.title import Title

# ----------------------------------------------------------------------
# JSON

class MyJsonWriter(json.JsonWriter):
    def _write(self, obj):
        ty = type(obj)
        if ty is types.FloatType:
            self._append(str(obj)) # 0.1000000 => 0.1 にする
        else:
            json.JsonWriter._write(self, obj)

def jsonp(obj, callback):
    '''obj を json/jsonp 形式に変換して返す'''

    json = MyJsonWriter().write(obj)
    if callback:
        return '%s(%s);' % (re.sub('[^_\da-zA-Z]', '_', callback), json)
    else:
        return json

def create_feed(items, callback):
    '''指定された items を含む feed を作成する'''

    result = {}
    result['version'] = '1.0'
    result['entry'] = items

    return jsonp(result, callback)

# ----------------------------------------------------------------------

def to_effect_map(s):
    '''Effect の文字列表現を Map に変換する'''

    a = s.split(',')
    b = {
        'op': a[1],
        'param': a[0],
        'min': int(a[2]),
        'max': int(a[3]),
        }
    if len(a) >= 5: b['condition'] = a[4]
    return b

def to_effects_list(effects_str):
    '''Effect の文字列表現をリストに変換する'''

    effects = []
    for effect in effects_str.split('\n'):
        effects.append(to_effect_map(effect))
    return effects

def to_enchant_map(enchant):
    '''Enchant をマップに変換する

    (JSON に変換するための前処理)
    '''
    
    obj = {}
    obj['names'] = enchant.names
    obj['english_name'] = enchant.english_name
    obj['rank'] = enchant.rank
    obj['root'] = 'p' if enchant.root.startswith('p') else 's'
    obj['equipment'] = enchant.equipment
    obj['equipment_text'] = enchant.equipment_text

    obj['id'] = enchant.id

    obj['effects'] = to_effects_list(enchant.effects)
    
    obj['effect_texts'] = enchant.effects_text.split('\n')
    obj['season'] = enchant.season
    
    obj['wiki'] = unicode(enchant.source)
    
    obj['attack_max'] = enchant.attack_max
    obj['melee_attack_max'] = enchant.melee_attack_max
    obj['ranged_attack_max'] = enchant.ranged_attack_max
    obj['critical'] = enchant.critical
    obj['life_max'] = enchant.life_max
    obj['mana_max'] = enchant.mana_max
    obj['stamina_max'] = enchant.stamina_max
    obj['defence'] = enchant.defence
    obj['protection'] = enchant.protection
    obj['implemented'] = enchant.implemented

    return obj

def to_element_map(source):
    '''Effect をマップに変換する'''
    obj = {}
    obj['id'] = unicode(source.key())
    obj['name'] = source.name
    obj['effects'] = [to_effect_map(e) for e in source.effects]
    obj['source'] = source.source
    return obj

def to_upgrade_map(source):
    obj = to_element_map(source)
    obj['ug'] = (source.ug_min, source.ug_max)
    obj['cost'] = source.cost
    obj['proficiency'] = source.proficiency
    return obj

def to_equipment_map(source):
    '''Equipment をマップに変換する
    '''
    
    obj = to_element_map(source)
    obj['ug'] = source.ug
    obj['category'] = source.category
    return obj

def to_equipment_detail_map(source):
    '''Equipment をマップに変換する
    '''
    
    obj = to_equipment_map(source)
    obj['upgrades'] = [to_upgrade_map(i) for i in UpgradeClass.get_by_equipment(source)]

    return obj

def to_title_map(source):
    '''Equipment をマップに変換する
    '''
    
    obj = to_element_map(source)
    return obj

# ----------------------------------------------------------------------
# ビュー

def query(request, model_class, to_map):
    '''request を元に検索を行う

    結果を JSON 形式で返す

    to_map に JSON 用のマップへ変換する関数を指定する'''

    callback = request.GET.get('callback')

    q = model_class.all()
    
    items = [to_map(i) for i in q.fetch(1000)]
    
    return HttpResponse(create_feed(items, callback)) # , 'application/json')


def get(request, key, model_class, to_map):
    '''装備詳細の json インタフェース'''

    callback = request.GET.get('callback')

    a = model_class.get(key)

    if not a:
        raise Http404

    return HttpResponse(create_feed([to_map(a)], callback)) # , 'application/json')

def enchant_json(request, id):
    return get(request, id, EnchantClass, to_enchant_map)

def enchants_json(request):
    '''エンチャント一覧の json インタフェース'''
    
    order = request.GET.get('orderby')
    if order and request.GET.get('sortorder') == 'descending':
        order = '-' + order

    limit = request.GET.get('max-results')
    if limit: limit = int(limit)
    else: limit = 50

    callback = request.GET.get('callback')

    cond = {}
    cond_names = ['name', 'rank', 'root', 'equipment', 'effects']
    for name in cond_names:
        value = request.GET.get(name)
        if value:
            cond[name] = value

    q = EnchantClass.find(order=order, limit=limit, **cond)

    items = []
    for i in q:
        items.append(to_enchant_map(i))

    return HttpResponse(create_feed(items, callback)) # , 'application/json')

def equipments_json(request):
    return query(request, EquipmentClass, to_equipment_map)

def equipment_json(request, id):
    return get(request, id, EquipmentClass, to_equipment_detail_map)

def titles_json(request):
    return query(request, Title, to_title_map)

