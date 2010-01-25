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

from django.views.generic.simple import direct_to_template
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.http import HttpResponse

from mabi.enchant import Enchant
from mabi.weapon import Weapon

def enchants(request):
    """エンチャント一覧を表示する
    """
    
    context = {
        'enchants': Enchant.all(),
        }

    return direct_to_template(request, 'enchants.html', context)

######################################################################
# 武器一覧

def weapons(request):
    """武器一覧を表示する
    """
    
    context = {
        'weapons': Weapon.all()
        }

    return direct_to_template(request, 'weapons.html', context)

def _to_json_map(map):
    result = []

    for k, v in map.iteritems():
        if isinstance(v, basestring):
            v = '\'' + v + '\''
        result.append(u'%s:%s' % (k, v))
    return u'{' + u','.join(result) + u'}'

def _to_json(obj):
    '''マップのシーケンスのみ対応'''
    result = []
    for o in obj:
        result.append(_to_json_map(o))
    return u'[' + u',\n'.join(result) + u']'

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


