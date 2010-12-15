# -*- coding: utf-8 -*-

import logging

from django.utils import simplejson

from mabi.enchant_class import EnchantClass
from mabi.equipment_class import EquipmentClass
from mabi.element import Element
from mabi.effect import Effect
from mabi.equipment_set import EquipmentSet
from mabi.mob import Mob

logger = logging.getLogger('Serializer')

def deserialize(json):
    '''JSON とモデルの変換を行う

    todo すでに DB に存在する場合は、そのモデルを取得し、プロパティを更新する。
    保存は行わない。
    '''

    json = simplejson.loads(json);
    return deserialize_element(json)

def serialize(model):
    '''オブジェクトを dict と list のみからなる形式へ変換する'''
    return serialize_element(model)


# ----------------------------------------------------------------------

def serialize_element(element):
    '''Effect を dict に変換する'''
    obj = {}
    obj['id'] = unicode(element.key())
    obj['name'] = element.name
    obj['type'] = type(element).__name__

    effects = element.effects
    if effects:
        obj['effects'] = [serialize_effect(e) for e in effects]
    # obj['source'] = element.source

    children = element.children
    if children:
        obj['children'] = [{'slot': e.slot, 'child': serialize_element(e)} for e in children]
    return obj

def serialize_effect(e):
    '''Effect を dict に変換する'''

    b = {
        'op': e.op,
        'param': e.param,
        'min': e.min,
        'max': e.max
        }

    if e.condition:
        b['condition'] = e.condition
    return b

def deserialize_element(json):
    '''JSON(のPython オブジェクトへ変換した物)を Element として Deserialize する'''

    cls = type_to_class(json['type'])

    effects = json.get('effects')
    if effects:
        effects = deserialize_effects(effects)
    else:
        effects = []
    element = cls(name=json['name'], effects=effects)

    children = json.get('children')
    if children:
        for child in children:
            slot = child.get('slot')
            child = child.get('child')
            child = deserialize_element(child)
            child.slot = slot
            element.children.append(child)
    return element

    
def deserialize_effects(json):
    '''effects を JSON から Effect[] へ変換します'''

    result = []
    for effect in json:
        a = Effect(
            op=effect['op'], 
            param=effect['param'], 
            min=effect['min'],
            max=effect.get('max'),
            condition=effect.get('condition'),
            )
        result.append(a)
    return result

def type_to_class(name):
    '''type 名から class を取得する'''
    map = {'Element': Element,
           'EquipmentSet': EquipmentSet,
           'Mob': Mob,
           }
    return map[name]