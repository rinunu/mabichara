# -*- coding: utf-8 -*-

from google.appengine.ext import db

from weapon_class import WeaponClass
from weapon_upgrade import WeaponUpgrade

class Weapon(db.Model):
    
    """具体的な武器

    ユーザの作成した武器や、システムが作成した武器はすべてこのオブジェクトで表す
    
    WeaponClass のオブジェクト的な存在
    """

    # 人間にわかりやすい名前
    name = db.StringProperty()
    
    weapon_class = db.ReferenceProperty(WeaponClass)
    upgrade_keys = db.ListProperty(db.Key)

    # 最終性能(改造など込み)
    attack_min = db.IntegerProperty()
    attack_max = db.IntegerProperty()
    balance = db.IntegerProperty();
    critical = db.IntegerProperty()
    durability = db.IntegerProperty() # 耐久
    injury_min = db.IntegerProperty(); # 負傷
    injury_max = db.IntegerProperty();

    proficiency = db.IntegerProperty() # 必要熟練
    cost = db.IntegerProperty() # 必要コスト

    # 改造前の初期性能
    # 1級品、合成品などはここを変更する
    initial_attack_min = db.IntegerProperty()
    initial_attack_max = db.IntegerProperty()
    initial_balance = db.IntegerProperty();
    initial_critical = db.IntegerProperty()
    initial_durability = db.IntegerProperty()
    
    def _set_upgrades(self, v):
        ''' '''
        
        self.upgrade_keys = [i.key() for i in v]

    def _get_upgrades(self):
        return WeaponUpgrade.get(self.upgrade_keys)

    upgrades = property(_get_upgrades, _set_upgrades)

    def _update_computed(self, upgrades):
        '''
        '''

        self.attack_min = self.initial_attack_min
        self.attack_max = self.initial_attack_max
        self.balance = self.initial_balance
        self.critical = self.initial_critical
        self.durability = self.initial_durability
        
        self.proficiency = 0
        self.cost = 0

        for u in upgrades:
            self.attack_min += u.attack_min
            self.attack_max += u.attack_max
            self.balance += u.balance
            self.critical += u.critical
            self.durability += u.durability

            self.proficiency += u.proficiency
            self.cost += u.cost

        if self.attack_min < 0: self.attack_min = 0
        if self.attack_max < 0: self.attack_max = 0
        if self.balance < 0: self.balance = 0
        if self.critical < 0: self.critical = 0
        if self.durability < 0: self.durability = 0
    
    def update_computed(self):
        '''
        '''

        _update_computed(self.upgrades)

    @classmethod
    def create_or_update(cls, weapon_class, upgrades, name):
        '''同じ性能の武器がすでにあるならそれを返し、なければ追加する

        同じ性能の武器と判断されるのは、このメソッドを使用して作成した武器のみである

        '''

        key_name = '/' + '/'.join([weapon_class.name] + sorted([u.name for u in upgrades]))

        def tx():
            a = cls.get_by_key_name(key_name)
            if not a:
                a = cls(key_name=key_name)
                a.weapon_class = weapon_class
                a.upgrades = upgrades
            a.name = name
            a.initial_attack_min = weapon_class.attack_min
            a.initial_attack_max = weapon_class.attack_max
            a.initial_balance = weapon_class.balance
            a.initial_critical = weapon_class.critical
            a.initial_durability = weapon_class.durability
            a._update_computed(upgrades)
            a.put()
            return a

        a = db.run_in_transaction(tx)
        return a

