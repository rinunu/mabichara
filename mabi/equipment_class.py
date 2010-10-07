# -*- coding: utf-8 -*-

from google.appengine.ext import db
from mabi.element import Element

class EquipmentClass(Element):
    '''装備データ
    '''

    category = db.StringProperty()

    # todo
    # speed = db.StringProperty()
    # hit = db.IntegerProperty()
    
    # 改造可能回数
    ug = db.IntegerProperty()

    # 可能な改造
    # upgrade_keys = db.ListProperty(db.Key)

    # @property
    # def upgrades(self):
    #     return WeaponUpgrade.get(self.upgrade_keys)
