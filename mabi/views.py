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
    return '%s(%s);' % (re.sub('[^_\da-zA-Z]', '_', callback),  json.write(obj))

def enchants(request):
    """エンチャント一覧を表示する
    """
    
    context = {
        'enchants': Enchant.all(),
        }

    return direct_to_template(request, 'enchants.html', context)


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
        obj = {}
        obj['names'] = a.names
        obj['english_name'] = a.english_name
        obj['rank'] = a.rank
        obj['rank_text'] = a.rank_text
        obj['root'] = a.root
        obj['equipment'] = a.equipment
        obj['equipment_text'] = a.equipment_text
        obj['effects'] = a.effects.split('\n')
        obj['effect_texts'] = a.effects_text.split('\n')
        obj['season'] = a.season
        
        obj['wiki'] = str(a.source)

        obj['attack_max'] = a.attack_max
        obj['melee_attack_max'] = a.melee_attack_max
        obj['ranged_attack_max'] = a.ranged_attack_max
        obj['critical'] = int(a.critical * 100)
        obj['life_max'] = a.life_max
        obj['mana_max'] = a.mana_max
        obj['stamina_max'] = a.stamina_max
        obj['defence'] = a.defence
        obj['protection'] = a.protection

        result.append(obj)

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


