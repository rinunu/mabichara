# -*- coding: utf-8 -*-

from google.appengine.ext import db

class WeaponUpgrade(db.Model):
    """武器の改造レシピ"""

    name = db.StringProperty()

    proficiency = db.IntegerProperty() # 必要熟練
    cost = db.IntegerProperty() # 必要コスト
    
    # アップグレード数
    ug_min = db.IntegerProperty()
    ug_max = db.IntegerProperty()

    details_text = db.StringProperty(multiline = True)

    # 効果
    
    attack_min = db.IntegerProperty(default = 0)
    attack_max = db.IntegerProperty(default = 0)
    balance = db.IntegerProperty(default = 0);
    critical = db.IntegerProperty(default = 0)
#     injury_min = db.IntegerProperty(default = 0);
#     injury_max = db.IntegerProperty(default = 0);
    durability = db.IntegerProperty(default = 0)

    @classmethod
    def get_or_create(cls, weapon, name):
        '''取得もしくは作成する

        このメソッドは排他制御は考慮しない'''

        key_name = '/' + weapon.name + '/' + name
        a = cls.get_by_key_name(key_name)
        if not a: a = cls(key_name = key_name, name = name)
        return a
    