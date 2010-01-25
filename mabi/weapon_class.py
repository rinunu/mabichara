# -*- coding: utf-8 -*-

from google.appengine.ext import db

from weapon_upgrade import WeaponUpgrade

class WeaponClass(db.Model):
    
    """武器データ

    保存時は WeaponUpgrade も手動で保存しなければならない
    """

    # wiki URL
    source = db.StringProperty()

    name = db.StringProperty()

    upgrade_keys = db.ListProperty(db.Key)
    
    speed = db.StringProperty()
    attack_min = db.IntegerProperty()
    attack_max = db.IntegerProperty()
    balance = db.IntegerProperty();
    hit = db.IntegerProperty()
    critical = db.IntegerProperty()
    
    # 負傷
    injury_min = db.IntegerProperty();
    injury_max = db.IntegerProperty();

    # 耐久
    durability = db.IntegerProperty()

    def _set_upgrades(self, v):
        self.upgrade_keys = [i.key() for i in v]

    def _get_upgrades(self):
        return WeaponUpgrade.get(self.upgrade_keys)

    upgrades = property(_get_upgrades, _set_upgrades)
    
    @classmethod
    def get_by_name(cls, name):
        key_name = '/' + name
        return cls.get_by_key_name(key_name)

    @classmethod
    def create(cls, name):
        '''指定された名前で作成する(保存はしない)'''
        a = cls(key_name = '/' + name)
        a.name = name
        return a

