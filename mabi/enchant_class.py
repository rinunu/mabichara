# -*- coding: utf-8 -*-

"""
"""

import re
import logging
from google.appengine.ext import db

import datastore_helper
    
class EnchantClass(db.Model):
    
    """エンチャントデータ
    """

    # 英語名
    english_name = db.StringProperty(required = True)

    # 日本語名
    names = db.StringListProperty()

    # 
    rank = db.IntegerProperty(required = True)
    
    # p(prefix) or s(suffix)
    root = db.StringProperty(required = True)

    # 貼り付け可能装備(内部用)
    equipment = db.StringProperty()

    # 貼り付け可能装備(ユーザ用)
    equipment_text = db.StringProperty()

    # 効果(内部用)
    # 効果を改行区切りにしたもの。各効果は(対象効果,増減,min,max,条件)をカンマ区切りしたもの。
    effects = db.StringProperty(multiline = True)

    # 効果(ユーザ用)
    effects_text = db.StringProperty(multiline = True)

    updated_at = db.DateTimeProperty(auto_now = True)

    # 実装時期(現在はチャプターレベルで記録)
    season = db.StringProperty()

    # 未実装なら False
    implemented = db.BooleanProperty(default = True)

    # 専用化
    personalized = db.BooleanProperty(default = False)

    # データ元へのリンク
    source = db.LinkProperty()

    # ----------------------------------------------------------------------
    # 以下は表示用

    # ステータス上昇(or 低下)
    attack_max = db.FloatProperty(default = 0.0)
    critical = db.FloatProperty(default = 0.0)
    life_max = db.FloatProperty(default = 0.0)
    mana_max = db.FloatProperty(default = 0.0)
    stamina_max = db.FloatProperty(default = 0.0)
    defence = db.FloatProperty(default = 0.0)
    protection = db.FloatProperty(default = 0.0)

    melee_attack_max = db.FloatProperty(default = 0.0)
    ranged_attack_max = db.FloatProperty(default = 0.0)

    # ----------------------------------------------------------------------
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

    # TODO 未使用？
    url = db.StringProperty()

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
        
    @property
    def id(self):
        return self._create_key_name(self.english_name, self.root, self.rank)

    def _set_effect(self, status, max_):
        '''指定された status を max_ 増加させる。 また、 effect_status を更新する

        status に関しては、マイナス効果は反映しないようにする(メタニー等、マイナス効果の影響で検索上位に出てこないものがあるので)。

        どちらもそのプロパティが存在しない場合は何もしない。
        '''
        if max_ > 0:
            try:
                prop = getattr(EnchantClass, status)
                a = prop.__get__(self, EnchantClass)
                prop.__set__(self, float(a) + max_)
            except AttributeError:
                pass
        
        try:
            prop = getattr(EnchantClass, 'effect_' + status)
            a = prop.__get__(self, EnchantClass)
            # TODO 現在プラス効果もマイナス効果もひとつのプロパティで持っている。 そのためプラスとマイナスの効果が混在していると問題になる
            # 現在はそのような場合はプラスの効果を優先する。
            if a != 1:
                prop.__set__(self, 1 if max_ > 0 else 2)
        except AttributeError:
            pass
        
    def update_computed(self):
        '''計算によって求まるプロパティを設定する
        1. effect から検索用の属性を設定する
        '''
        self.attack_max = 0.0
        self.melee_attack_max = 0.0
        self.ranged_attack_max = 0.0
        self.critical = 0.0
        self.life_max = 0.0
        self.mana_max = 0.0
        self.stamina_max = 0.0
        self.defence = 0.0
        self.protection = 0.0

        for a in dir(self):
            if a.startswith('effect_'):
                setattr(self, a, 0)

        for effect in self.effects.split('\n'):
            a = effect.split(',')
            if a[1] == '*' or a[2] == 'todo': continue

            status = a[0]
            max_ = float(a[1] + a[3])
            if status == u'attack_max':
                self._set_effect('melee_attack_max', max_)
                self._set_effect('ranged_attack_max', max_)
                self._set_effect('attack_max_dex_str', max_)
            elif status == u'critical':
                self._set_effect('critical_luck_will', max_)
            elif status == u'str':
                self._set_effect('melee_attack_max', max_ / 2.5)
                self._set_effect('attack_max_dex_str', max_ / 2.5)
                self._set_effect('attack_min_dex_str', max_ / 3)
            elif status == u'dex':
                self._set_effect('ranged_attack_max', max_ / 2.5)
                self._set_effect('attack_max_dex_str', max_ / 3.5)
                self._set_effect('attack_min_dex_str', max_ / 3.5)
            elif status == u'will':
                self._set_effect('critical', max_ / 10)
                self._set_effect('critical_luck_will', max_ / 10)
            elif status == u'luck':
                self._set_effect('critical', max_ / 5)
                self._set_effect('critical_luck_will', max_ / 5)
                
            self._set_effect(status, max_)

    @classmethod
    def _create_key_name(cls, english_name, root, rank):
        '''Enchant の ID を生成する'''
        
        root = 'p' if root.startswith('p') else 's'
        return '%s%s%s' % (root, rank, english_name.replace(' ', '').lower())

    @classmethod
    def get_by_id(cls, id_):
        '''
        存在しない場合は None
        '''
        return cls.get_by_key_name(id_)
    
    @classmethod
    def create_or_update(cls, english_name, root, rank,
                         names, effects_text, effects, equipment_text, equipment, source, season,
                         implemented = True
                         ):
        '''Enchant が存在しないなら作成 or 更新する'''
        
        key_name = cls._create_key_name(english_name, root, rank)

        def tx():
            a = cls.get_by_key_name(key_name)
            if not a:
                a = cls(key_name=key_name, english_name=english_name, root=root, rank=rank)
            a.names = names
            a.effects_text = effects_text
            a.effects = effects
            a.equipment_text = equipment_text
            a.equipment = equipment
            a.source = source
            a.season = season
            a.implemented = implemented
            a.update_computed()
            a.put()
            return a

        a = db.run_in_transaction(tx)
        return a

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

        q = datastore_helper.DatastoreHelper(EnchantClass)
        q.order_by_gae(True)

        # Filter を作成する
        # なるべく GAE によって処理したいものを最初に作成する(なるべく絞り込めるもの)

        if name:
            q.add_filter(datastore_helper.PrefixFilter(EnchantClass, 'names', name))

        # 効果用のフィルター作成
        if effects:
            effects = effects.split(u' ')
            effect_re = re.compile(ur'([-+])([a-zA-Z0-9_]+)')
            for e in effects:
                m = effect_re.match(e)
                value = 1 if m.group(1) == '+' else 2
                status = m.group(2)
                key = 'effect_%s' % status # 先頭に effect をつけるため、不正な値でも、最悪存在しないプロパティへのアクセスですむ
                q.add_filter(datastore_helper.Filter(EnchantClass, key, value))

        if root:
            q.add_filter(datastore_helper.Filter(EnchantClass, 'root', root))
            
        if rank:
            q.add_filter(datastore_helper.Filter(EnchantClass, 'rank', int(rank)))

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
            if equipment and not equipment.search(es_equipment):
                continue

            result.append(e)
            if limit and limit <= len(result):
                break

        return result

