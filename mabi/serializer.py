# -*- coding: utf-8 -*-

import logging

from django.utils import simplejson

from mabi.enchant_class import EnchantClass
from mabi.equipment_class import EquipmentClass
from mabi.element import Element
from mabi.equipment_set import EquipmentSet

logger = logging.getLogger('Serializer')

'''JSON とモデルの変換を行う

todo すでに DB に存在する場合は、そのモデルを取得し、プロパティを更新する。
保存は行わない。
'''
def deserialize(json):
    json = simplejson.loads(json);
    # logger.debug(json)
    cls = type_to_class(json['type'])
    return cls(name = json['name'])

def type_to_class(name):
    '''type 名から class を取得する'''
    map = {'Element': Element,
           'EquipmentSet': EquipmentSet}
    return map[name]