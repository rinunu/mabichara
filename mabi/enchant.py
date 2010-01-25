# -*- coding: utf-8 -*-

"""
"""

from google.appengine.ext import db

class Enchant(db.Model):
    
    """エンチャントデータ
    """

    url = db.StringProperty()

    english_name = db.StringProperty(required = True)
    
    names = db.StringListProperty()

    # 別名 todo list
    name2 = db.StringProperty()
    
    # 別名
    name3 = db.StringProperty()

    rank = db.IntegerProperty(required = True)
    
    # prefix or suffix
    root = db.StringProperty(required = True)

    # 貼り付け可能部位
    equipment = db.StringProperty()

    # 貼り付け可能部位の説明
    equipment_text = db.StringProperty()

    generation = db.StringProperty()

    # 効果
    effects = db.StringProperty(multiline = True)

    # 効果の説明
    effects_text = db.StringProperty(multiline = True)

    updated_at = db.DateTimeProperty(auto_now = True)

    # 実装時期(現在はチャプターレベルで記録)
    season = db.StringProperty()

    # 未実装なら False
    implemented = db.BooleanProperty(default = True)

    # データ元へのリンク
    source = db.LinkProperty()

    # ステータス上昇(or 低下)
    damage_max = db.FloatProperty()
    melee_damage_max = db.FloatProperty()
    ranged_damage_max = db.FloatProperty()
    critical = db.FloatProperty()
    life_max = db.FloatProperty()
    mana_max = db.FloatProperty()
    stamina_max = db.FloatProperty()
    defence = db.FloatProperty()
    protection = db.FloatProperty()

    @property
    def critical_text(self):
        '''クリティカルを人間に読みやすい表現を返す'''
        if self.critical:
            return self.critical * 100
        else: return self.critical

    @property
    def rank_text(self):
        '''ランクの人間に読みやすい表現を返す'''
        map = {
            10: 'A',
            11: 'B',
            12: 'C',
            13: 'D',
            14: 'E',
            15: 'F',
            }
        if self.rank >= 10: return map[self.rank]
        else: return self.rank
    
    def update_computed(self):
        '''計算によって求まるプロパティを設定する'''
        self.damage_max = 0.0
        self.melee_damage_max = 0.0
        self.ranged_damage_max = 0.0
        self.critical = 0.0
        self.life_max = 0.0
        self.mana_max = 0.0
        self.stamina_max = 0.0
        self.defence = 0.0
        self.protection = 0.0

        for effect in self.effects.split('\n'):
            a = effect.split(' ')
            if a[1] == '*' or a[2] == 'todo': continue

            type = a[0]
            max = float(a[1] + a[3])
            if type == u'最大ダメージ':
                self.damage_max += max
                self.melee_damage_max += max
                self.ranged_damage_max += max
            elif type == u'クリティカル':
                self.critical += max / 100
            elif type == u'Str':
                self.melee_damage_max += max / 2.5
            elif type == u'Dex':
                self.ranged_damage_max += max / 2.5
            elif type == u'Will':
                self.critical += max / 1000
            elif type == u'Luck':
                self.critical += max / 500
            elif type == u'最大生命力':
                self.life_max += max
            elif type == u'最大マナ':
                self.mana_max += max
            elif type == u'最大スタミナ':
                self.stamina_max += max
            elif type == u'防御':
                self.defence += max
            elif type == u'保護':
                self.protection += max

    @classmethod
    def get(cls, english_name, root, rank):
        q = cls.all()
        q.filter('english_name = ', english_name)
        q.filter('rank = ', rank)
        q.filter('root = ', root)
        return q.get()
    