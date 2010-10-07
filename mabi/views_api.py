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

def to_effects_map(effects_str):
    '''Effect の文字列表現を Map に変換する'''

    effects = []
    for effect in effects_str.split('\n'):
        effects.append(to_effect_map(effect))
    return effects

def create_feed(items, callback):
    '''指定された items を含む feed を作成する'''

    result = {}
    result['version'] = '1.0'
    result['entry'] = items

    return jsonp(result, callback)

# ----------------------------------------------------------------------
# Enchant API

def to_map(enchant):
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

    obj['effects'] = to_effects_map(enchant.effects)
    
    obj['effect_texts'] = enchant.effects_text.split('\n')
    obj['season'] = enchant.season
    
    obj['wiki'] = str(enchant.source)
    
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

def enchant_json(request, id):
    '''エンチャント詳細の json インタフェース'''

    callback = request.GET.get('callback')

    a = EnchantClass.get_by_id(id)

    if not a:
        raise Http404

    return HttpResponse(create_feed([to_map(a)], callback)) # , 'application/json')

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
        items.append(to_map(i))

    return HttpResponse(create_feed(items, callback)) # , 'application/json')


def weapons_json(request):

    order = request.GET.get('orderby')
    if order and request.GET.get('sortorder') == 'descending':
        order = '-' + order

    max = request.GET.get('max-results')
    if max: max = int(max)
    else: max = 50
    
    json = []


    cls = Weapon
    q = cls.all()
    if order: q.order(order)
    
    for w in q.fetch(max):
        obj = {}
        obj['name'] = w.weapon_class.name
        obj['attack_min'] = w.attack_min
        obj['attack_max'] = w.attack_max
        obj['balance'] = w.balance
        obj['critical'] = w.critical
        obj['durability'] = w.durability
        obj['cost'] = w.cost
        obj['proficiency'] = w.proficiency
        obj['upgrades_text'] = '>'.join(u.name for u in w.upgrades)
        # obj['injury_min'] = w.injury_min
        # obj['injury_max'] = w.injury_max

        obj['initial_attack_min'] = w.initial_attack_min
        
        json.append(obj)
            
    return HttpResponse(_to_json(json)) # , 'application/json')

