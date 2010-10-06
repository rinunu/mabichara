# -*- coding: utf-8 -*-

# 各種名称の辞書

# param_id > param_name 変換マップ
param_id_name_map = {
    u'life_max': [u'最大生命力',
                  u'生命力'],
    u'stamina_max': [u'最大スタミナ', u'スタミナ'],
    u'mana_max': [u'最大マナ', u'マナ'],
    
    u'str': [u'Str'],
    u'dex': [u'Dex'],
    u'will': [u'Will'],
    u'luck': [u'Luck'],
    u'int': [u'Int'],
    
    u'attack_max': [u'最大ダメージ', u'最大攻撃力'],
    u'attack_min': [u'最小ダメージ', u'最小攻撃力'],
    u'critical': [u'クリティカル'],
    
    u'protection': [u'保護'],
    u'defence': [u'防御'],
    
    u'balance': [u'バランス', u'ダメージバランス'],
    
    u'wound_max': [u'最大負傷率'],
    u'wound_min': [u'最小負傷率'],
    
    u'cp': [u'戦闘力'],
    u'repair_cost': [u'修理費', u'修理費用'],
    
    u'mana_consumption': [u'消費マナ減少'],
    u'poison_resistance': [u'毒免疫'],
    u'explosion_resistance': [u'爆発抵抗'],
    
    u'crystal_making': [u'結晶製作成功率', u'結晶制作成功率'],
    u'dissolution': [u'分解成功率'],
    u'synthesis': [u'合成成功率'],
    
    u'alchemy_wind': [u'風属性錬金術ダメージ', 
                      u'風属性の錬金術ダメージ'],
    u'alchemy_water': [u'水属性錬金術ダメージ',
                       u'水属性の錬金術ダメージ',
                       u'水属性の錬金ダメージ'],
    u'alchemy_fire': [u'火属性錬金術ダメージ',
                      u'火属性の錬金術ダメージ',
                      u'火属性の錬金ダメージ'],

    u'magic': [u'魔法ダメージ'],

    # 改造
    u'durability': [u'最大耐久', u'最大耐久度'],
    u'splash_range': [u'スプラッシュ打撃距離'],
    u'splash_damage': [u'スプラッシュ打撃ダメージ'],
    u'splash_range': [u'攻撃距離', u'攻撃射程'],
}

param_name_id_map = {}
for key, names in param_id_name_map.iteritems():
    for name in names:
        param_name_id_map[name] = key
    
