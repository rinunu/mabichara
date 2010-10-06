# -*- coding: utf-8 -*-

from google.appengine.ext import db
from mabi import Element

class EquipmentClass(Element):
    '''装備データ
    '''

    speed = db.StringProperty()
    hit = db.IntegerProperty()
    
    # 改造可能回数
    ug = db.IntegerProperty()

    # 可能な改造
    upgrade_keys = db.ListProperty(db.Key)

    def _set_upgrades(self, v):
        self.upgrade_keys = [i.key() for i in v]

    def _get_upgrades(self):
        return WeaponUpgrade.get(self.upgrade_keys)

    upgrades = property(_get_upgrades, _set_upgrades)
