# -*- coding: utf-8 -*-

import logging

from django.utils import simplejson

from mabi.enchant_class import EnchantClass
from mabi.equipment_class import EquipmentClass
from mabi.element import Element
from mabi.effect import Effect
from mabi.equipment_set import EquipmentSet

logger = logging.getLogger('Serializer')

def deserialize(json):
    '''JSON とモデルの変換を行う

    todo すでに DB に存在する場合は、そのモデルを取得し、プロパティを更新する。
    保存は行わない。
    '''

    json = simplejson.loads(json);
    return deserialize_element(json)

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
           'EquipmentSet': EquipmentSet}
    return map[name]