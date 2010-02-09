# -*- coding: utf-8 -*-
"""
エンチャント検索について
1. 親カテゴリに対してエンチャントできるもの。 子カテゴリは厳密に比較するもの。
  武器
  子供にしかエンチャントできないものはNGとみなす
  => 武器$

2. 親カテゴリに対してエンチャントできるもの。 その子供も含めるもの。
  /巨大料理道具/
  子供にのみエンチャントできるものも、OKとみなす
  => これを含んでいれば OK

----

エンチャント側

or は どれかにマッチしていれば OK

and もどれかにマッチしていれば OK
=> 革素材の鎧は鎧で検索して引っ掛けたいため

"""

import re
import logging
import types

from django.views.generic.simple import direct_to_template
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.http import HttpResponse

import json

from mabi.enchant import Enchant
from mabi.weapon import Weapon

######################################################################

def jsonp(obj, callback):

   class MyJsonWriter(json.JsonWriter):
       def _write(self, obj):
           ty = type(obj)
           if ty is types.FloatType:
               self._append(str(obj)) # 0.1000000 => 0.1 にする
           else:
               json.JsonWriter._write(self, obj)

   return '%s(%s);' % (re.sub('[^_\da-zA-Z]', '_', callback), MyJsonWriter().write(obj))

def enchants(request):
    """エンチャント一覧を表示する
    """
    
    context = {
        'enchants': Enchant.all(),
        }

    return direct_to_template(request, 'enchants.html', context)

def to_map(enchant):
    '''Enchant をマップに変換する

    (JSON に変換するための前処理)
    '''
    
    obj = {}
    obj['names'] = enchant.names
    obj['english_name'] = enchant.english_name
    obj['rank'] = enchant.rank
    obj['rank_text'] = enchant.rank_text
    obj['root'] = enchant.root
    obj['equipment'] = enchant.equipment
    obj['equipment_text'] = enchant.equipment_text

    obj['effects'] = effects = []
    for effect in enchant.effects.split('\n'):
        a = effect.split(' ')
        if a[1] == '-':
            min = int(a[3]) * -1
            max = int(a[2]) * -1
        else:
            min = int(a[2])
            max = int(a[3])
        effects.append({
                'status': a[0],
                'min': min,
                'max': max
                })
    
    obj['effect_texts'] = enchant.effects_text.split('\n')
    obj['season'] = enchant.season
    
    obj['wiki'] = str(enchant.source)
    
    obj['attack_max'] = enchant.attack_max
    obj['melee_attack_max'] = enchant.melee_attack_max
    obj['ranged_attack_max'] = enchant.ranged_attack_max
    obj['critical'] = int(enchant.critical * 100)
    obj['life_max'] = enchant.life_max
    obj['mana_max'] = enchant.mana_max
    obj['stamina_max'] = enchant.stamina_max
    obj['defence'] = enchant.defence
    obj['protection'] = enchant.protection

    return obj    

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

    q = Enchant.find(order=order, limit=limit, **cond)

    result = []
    for a in q:
        result.append(to_map(a))

    if callback:
        result = jsonp(result, callback)
    else:
        result = json.write(result)
    return HttpResponse(result) # , 'application/json')


######################################################################
# 武器一覧

def weapons(request):
    """武器一覧を表示する
    """
    
    context = {
        'weapons': Weapon.all()
        }

    return direct_to_template(request, 'weapons.html', context)

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


