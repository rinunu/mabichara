# -*- coding: utf-8 -*-

"""
"""

import re
import logging
from google.appengine.ext import db

import datastore_helper
    
class Enchant(db.Model):
    
    """エンチャントデータ
    """

    url = db.StringProperty()

    english_name = db.StringProperty(required = True)
    
    names = db.StringListProperty()

    rank = db.IntegerProperty(required = True)
    
    # prefix or suffix
    root = db.StringProperty(required = True)

    # 貼り付け可能装備
    equipment = db.StringProperty()

    # 貼り付け可能装備の説明
    equipment_text = db.StringProperty()

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
    attack_max = db.FloatProperty()
    critical = db.FloatProperty()
    life_max = db.FloatProperty()
    mana_max = db.FloatProperty()
    stamina_max = db.FloatProperty()
    defence = db.FloatProperty()
    protection = db.FloatProperty()

    melee_attack_max = db.FloatProperty()
    ranged_attack_max = db.FloatProperty()

    # 以下は検索用
    # ある属性が上昇するなら 1, 減少するなら 2, 変化無しなら 0

    # 単一効果
    effect_attack_max = db.IntegerProperty(default = 0)
    effect_attack_min = db.IntegerProperty(default = 0)
    effect_critical = db.IntegerProperty(default = 0)
    effect_str = db.IntegerProperty(default = 0)
    effect_dex = db.IntegerProperty(default = 0)
    effect_will = db.IntegerProperty(default = 0)
    effect_luck = db.IntegerProperty(default = 0)
    effect_int = db.IntegerProperty(default = 0)
    effect_balance  = db.IntegerProperty(default = 0)
    effect_life_max = db.IntegerProperty(default = 0)
    effect_mana_max = db.IntegerProperty(default = 0)
    effect_stamina_max = db.IntegerProperty(default = 0)
    effect_defence = db.IntegerProperty(default = 0)
    
    effect_protection = db.IntegerProperty(default = 0)
    effect_injury_max = db.IntegerProperty(default = 0)
    effect_injury_min = db.IntegerProperty(default = 0)
    effect_cp = db.IntegerProperty(default = 0)

    effect_mana_consumption = db.IntegerProperty(default = 0) # マナ消費
    effect_poison_resistance = db.IntegerProperty(default = 0) # 毒免疫
    effect_explosion_resistance = db.IntegerProperty(default = 0) # 爆発抵抗
    effect_crystal_making = db.IntegerProperty(default = 0) # 結晶製作成功率
    effect_dissolution = db.IntegerProperty(default = 0) # 分解成功率
    effect_synthesis = db.IntegerProperty(default = 0) # 合成成功率
    effect_alchemy_wind = db.IntegerProperty(default = 0)
    effect_alchemy_water = db.IntegerProperty(default = 0)
    effect_alchemy_fire = db.IntegerProperty(default = 0)

    # 複合
    effect_attack_max_dex_str = db.IntegerProperty(default = 0)
    effect_attack_min_dex_str = db.IntegerProperty(default = 0)
    effect_critical_luck_will = db.IntegerProperty(default = 0)

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
        self.attack_max = 0.0
        self.melee_attack_max = 0.0
        self.ranged_attack_max = 0.0
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
            up_or_down = 1 if max > 0 else 2
            if type == u'attack_max':
                self.attack_max += max
                self.melee_attack_max += max
                self.ranged_attack_max += max
                self.effect_attack_max = up_or_down
                self.effect_attack_max_dex_str = up_or_down
            elif type == u'attack_min':
                self.effect_attack_min = up_or_down
            elif type == u'critical':
                self.critical += max / 100
                self.effect_critical = up_or_down
                self.effect_critical_luck_will = up_or_down
            elif type == u'str':
                self.melee_attack_max += max / 2.5
                self.effect_str = up_or_down
                self.effect_attack_max_dex_str = up_or_down
                self.effect_attack_min_dex_str = up_or_down
            elif type == u'dex':
                self.ranged_attack_max += max / 2.5
                self.effect_dex = up_or_down
                self.effect_attack_max_dex_str = up_or_down
                self.effect_attack_min_dex_str = up_or_down
            elif type == u'will':
                self.critical += max / 1000
                self.effect_will = up_or_down
                self.effect_critical_luck_will = up_or_down
            elif type == u'luck':
                self.critical += max / 500
                self.effect_luck = up_or_down
                self.effect_critical_luck_will = up_or_down
            elif type == u'int':
                self.effect_int = up_or_down
            elif type == u'balance':
                self.effect_balance = up_or_down
            elif type == u'life_max':
                self.life_max += max
                self.effect_life_max = up_or_down
            elif type == u'mana_max':
                self.mana_max += max
                self.effect_mana_max = up_or_down
            elif type == u'stamina_max':
                self.stamina_max += max
                self.effect_stamina_max = up_or_down
            elif type == u'defence':
                self.defence += max
                self.effect_defence = up_or_down
            elif type == u'protection':
                self.protection += max
                self.effect_protection = up_or_down
            elif type == u'injury_max':
                self.effect_injury_max = up_or_down
            elif type == u'injury_min':
                self.effect_injury_min = up_or_down
            elif type == u'cp':
                self.effect_cp = up_or_down

            elif type == u'mana_consumption':
                self.effect_mana_consumption = up_or_down
            elif type == u'poison_resistance':
                self.effect_poison_resistance = up_or_down
            elif type == u'explosion_resistance':
                self.effect_explosion_resistance = up_or_down
            elif type == u'crystal_making':
                self.effect_crystal_making = up_or_down
            elif type == u'dissolution':
                self.effect_dissolution = up_or_down
            elif type == u'synthesis':
                self.effect_synthesis = up_or_down
            elif type == u'alchemy_wind':
                self.effect_alchemy_wind = up_or_down
            elif type == u'alchemy_water':
                self.effect_alchemy_water = up_or_down
            elif type == u'alchemy_fire':
                self.effect_alchemy_fire = up_or_down
                

    @classmethod
    def get(cls, english_name, root, rank):
        q = cls.all()
        q.filter('english_name = ', english_name)
        q.filter('rank = ', rank)
        q.filter('root = ', root)
        return q.get()

    # よく使うステータス。 インデックスを用意してある
    # 全部のステータス用にインデックスを用意すると多いので。
    _popular_status = ['attack_max_dex_str', 'critical_luck_will']

    
    common_index = ['rank', 'root', 'equipment']
    # インデックスを作成しているもの
    # これ以外のものは手動で並べ替える
    # フィルタ: [オーダー, ...] の形になっている
    indexes = {'root': common_index,
               'effect_attack_max_dex_str': common_index + ['attack_max', 'melee_attack_max', 'ranged_attack_max'],
               'effect_critical_luck_will': common_index + ['critical'],}

    @classmethod
    def _can_order_by_gae(cls, filters, order):
        if len(filters) == 0:
            return True
        elif len(filters) >= 2:
            return False
        else:
            f = filters[0]
            index = cls.indexes.get(f.name)
            order = re.sub('-', '', order)
            if index and order in index:
                return True
            else:
                return False
    
    @classmethod
    def find(cls,
             order=None, limit=None,
             effects=None,
             equipment=None,
             name=None,
             rank=None,
             root=None
            ):
        '''指定された検索条件で検索する

        指定された条件はすべて AND で検索する

        Arguments:
            order -- 並び順を指定する。 Enchant のプロパティのどれかを指定する。
            降順にする場合はプロパティ名の先頭に - をつける。

            limit --

            root --

            rank --

            name -- names と前方一致比較する(TODO english_name も)
            effects -- 効果。「+attack_max -critical」のような形式で指定する。 アンド検索を行う

            equipment -- 貼付け可能装備。 正規表現で指定する。
            
        '''
        
        if limit:
            limit = int(limit)

        q = datastore_helper.DatastoreHelper(Enchant)
        q.order_by_gae(True)

        # Filter を作成する
        # なるべく GAE によって処理したいものを最初に作成する(なるべく絞り込めるもの)

        if name:
            q.add_filter(datastore_helper.PrefixFilter(Enchant, 'names', name))

        # 効果用のフィルター作成
        if effects:
            effects = effects.split(u' ')
            effect_re = re.compile(ur'([-+])([a-zA-Z0-9_]+)')
            for e in effects:
                m = effect_re.match(e)
                value = 1 if m.group(1) == '+' else 2
                status = m.group(2)
                key = 'effect_%s' % status # 先頭に effect をつけるため、不正な値でも、最悪存在しないプロパティへのアクセスですむ
                q.add_filter(datastore_helper.Filter(Enchant, key, value))

        if root:
            q.add_filter(datastore_helper.Filter(Enchant, 'root', root))
            
        if rank:
            q.add_filter(datastore_helper.Filter(Enchant, 'rank', rank))

        if order:
            q.order_by_gae(cls._can_order_by_gae(q.filters, order))
            q.order(order)
        
        q = q.all()

        # プログラムによるフィルタ
        if isinstance(equipment, basestring):
            equipment = re.compile(equipment)

        result = []
        for e in q:
            es_equipment = e.equipment or ''
            if equipment and not equipment.match(es_equipment):
                continue

            result.append(e)
            if limit and limit <= len(result):
                break

        return result

