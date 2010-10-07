# -*- coding: utf-8 -*-

from google.appengine.ext import db
from mabi.element import Element

class UpgradeClass(Element):
    '''改造ステップ'''

    proficiency = db.IntegerProperty() # 必要熟練
    cost = db.IntegerProperty() # 必要コスト
    
    # 適用可能なアップグレード数
    ug_min = db.IntegerProperty()
    ug_max = db.IntegerProperty()

    # 宝石改造

    @classmethod
    def create_or_update(cls, name, equipment, **kwdargs):
        return cls.create_or_update_impl(name = name, parent = equipment, **kwdargs)


    @classmethod
    def get_by_equipment(cls, equipment):
        '''指定した装備に施せる改造を取得する'''
        return cls.all().ancestor(equipment).fetch(100)
