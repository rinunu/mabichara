# -*- coding: utf-8 -*-

import re

rank_re = re.compile(u'([a-fA-F0-9])ランク')

def get_string(tag, separator=''):
    '''タグの文字列を取得する'''
    return separator.join(tag.findAll(text=True))

def to_equipment(text):
    """Enchant.equipment_text を元に Enchant.equipment を設定する"""
    
    if not text: return text

    text = re.compile(u'[\s　]*のみ').sub('', text)

    # 正規化する
    map1 = {
        u'金属製のブーツ' : u'金属製ブーツ',
        u'金属ブーツ' : u'金属製ブーツ',
        u'手 足 アクセサリ' : u'手 足 アクセ',
        u'長距離武器' : u'遠隔武器',
        u'遠距離武器' : u'遠隔武器',
        u'弓' : u'遠隔武器',
        u'帽子、兜' : u'頭',
        u'帽子 兜' : u'頭',
        u'足装備' : u'足',
        u'靴' : u'足',
        u'靴と金属製のブーツ' : u'足',
        u'簡易テーブルと鍋' : u'簡易テーブルと万能鍋',
        u'兜(帽子不可)' : u'兜',
        u'両手ナックル' : u'ナックル',
        u'鉄製の武器と防具' : u'材料が鉄の武器と防具',
        u'服？' : u'服',
        }
    if text in map1: text = map1[text]        
    
    # 
    map = {
        u'服 鎧' : u'/体/',
        u'服(魔法衣装除く)' : u'/体/服/',
        u'重鎧' : u'/体/重鎧/',
        u'軽鎧' : u'/体/軽鎧/',
        u'魔法衣装' : u'/体/魔法衣装/',
        u'服' : u'/体/服/ | /体/魔法衣装/',
        u'鎧' : u'/体/軽鎧/ | /体/重鎧/',

        u'頭' : u'/頭/',
        u'帽子(兜不可)' : u'/頭/帽子/', # todo カテゴリはたぶん。。
        u'兜' : u'/頭/兜/', # todo カテゴリはたぶん。。
        
        u'手' : u'/手/',
        u'ガントレット' : u'/手/ガントレット/ | /手/魔法グローブ/', # カテゴリ はたぶん
        u'手袋' : u'/手/グローブ/ | /手/ブレスレット', # todo 合ってるかな

        u'足' : u'/足/',
        
        u'アクセサリ' : u'/アクセサリ/',
        
        u'両手武器' : u'/両手武器/',
        u'盾' : u'/左手/盾/',
        
        # 組み合わせ
        u'服 鎧 足' : u'/体/ | /足/',
        u'服 鎧 頭' : u'/体/ | /頭/',
        u'服 鎧 頭 アクセ' : u'/体/ | /頭/ | /アクセサリ/',
        u'服 鎧 盾' : u'/体/ | /左手/盾/' ,
        
        u'手 足' : u'/手/ | /足/',
        u'手 足 アクセ' : u'/手/ | /足/ | /アクセサリ/',
        u'足 頭 盾' : u'/足/ | /頭/ | /左手/盾/',
        u'盾 頭' : u'/左手/盾/ | /頭/',

        # 具体的
        u'管楽器や弦楽器' : u'/右手/道具/弦楽器/楽器/ | /両手武器/道具/管楽器/楽器/',
        u'遠隔武器' : u'/右手/武器/クロスボウ/ | /右手/武器/弓/', # 弓は各種弓の総称? 本来は /bow...
        u'ワンド' : u'/右手/武器/ワンド/',
        u'シリンダー' : u'/右手/武器/シリンダー/', # todo 親カテゴリはたぶん
        u'ナックル' : u'/両手武器/武器/ナックル/',
        u'金属製ブーツ' : u'/足/金属ブーツ/ | /足/魔法金属ブーツ/', # todo カテゴリはたぶん
        u'両手斧' : u'/両手武器/武器/斧/',
        u'近接武器' : u'/右手/武器/刀剣/ | /右手/武器/斧/ | /右手/武器/鈍器/ | /両手武器/武器/刀剣/ | /両手武器/武器/ナックル/ | /両手武器/武器/斧/ | /両手武器/武器/鈍器/',
        u'小型斧' : u'/右手/武器/斧/',

        u'武器と楽器' : u'/武器/ | /楽器/', # todo たぶん
        u'斧と鈍器' : u'/右手/武器/斧/ | /右手/武器/鈍器/ | /両手武器/武器/斧/ | /両手武器/武器/鈍器/', # todo たぶん

        # ピンポイント
        u'武器' : u'/武器/',
        u'材料が鉄の武器と防具' : u'/鉄/',
        u'巨大料理道具' : u'/巨大料理道具/',
        u'料理用道具' : u'/右手/ & /料理用道具/ | /左手/ & /料理用道具/',
        u'スパイカーのシルバー装備のセット' : u'/スパイカーのシルバー装備のセット/',
        u'ダスティンシルバーナイトセット' : u'/ダスティンシルバーナイトセット/',
        u'ノルマンウォーリアセット' : u'/ノルマンウォーリアセット/',
        u'グレースプレートセット' : u'/グレースプレートセット/',
        u'材料が木の武器と防具' : u'/木/ | /武器/弓/ショートボウ以外/', # TODO ショートボウ以外?
        u'革素材の鎧' : u'/体/ & /革/',
        
        # さらに具体的
        # todo カテゴリはたぶん
        u'巨大生地用麺棒' : u'/巨大料理道具/巨大生地用麺棒/',
        u'巨大クッキングナイフ　巨大おたま' : u'/巨大料理道具/巨大クッキングナイフ/ | /巨大料理道具/巨大おたま/',
        u'簡易テーブルと万能鍋' : u'/左手/盾/料理用道具/簡易テーブル/ | /左手/盾/料理用道具/万能鍋/', # todo 親カテゴリはたぶん
        u'料理人帽子' : u'/頭/帽子/コックの帽子/', # todo 親カテゴリはたぶん
        u'クロスボウ' : u'/右手/武器/クロスボウ/',
        u'王政錬金術師ブーツ' :  u'/足/王政錬金術師ブーツ', # todo 親カテゴリはたぶん
        u'王政錬金術師制服' :  u'/体/服/王政錬金術師制服', # todo 親カテゴリはたぶん
        }

    if text in map:
        return map[text]
    else:
        raise Exception, u'不明な装備: ' + text

def to_effect(text):
    igrone_rank_re = re.compile(ur'ランクに関係なくエンチャント可能')
    personal_rank_re = re.compile(ur'エンチャントアイテムが装備者専用になる')
    pass_re = re.compile(ur'^注：')
    cond_re = re.compile(ur'(?:([^(]+)(?:場合|の時)[の、\s]*)(.+)') # カッコ書きの中のものに引っかからないように
    title_re = re.compile(ur'(?:(.+)(?:にしている時|をつけているとき)、)(.+)')
    effect_re = re.compile(ur'([^\s\d]+)\s*([\d~〜]+)[％%]?\s*(増加|減少|倍|)')
    cp_re = re.compile(ur'((?:ほんの)?(:?少し)?(?:弱|強)そう)\((?:戦闘力)?(.*)\)')

    if pass_re.match(text):
        return None

    m = cond_re.match(text)
    if m:
        effect = m.group(2)
    else:
        m = title_re.match(text)
        if m:
            effect = m.group(2)
        else:
            effect = text
            
    # 強そう弱そう系
    m = cp_re.match(effect)
    if m:
        target = u'戦闘力'
        op = u'+'
        min = u'todo'
        max = u'todo'
    else:
        effect = re.sub(ur'\([^)]*\)$', u'', effect) # 文末の補足を削除

        # ランクに関係なく
        m = igrone_rank_re.match(effect)
        if m:
            return None # todo
        else:
            # 専用
            m = personal_rank_re.match(effect)
            if m:
                return None # todo
            else:
                # 増加・減少系の効果解析
                m = effect_re.match(effect)
                if m:
                    target = m.group(1)
                    
                    if m.group(3) == u'増加' or m.group(3) == u'':
                        op = u'+'
                    elif m.group(3) == u'減少':
                        op = u'-'
                    elif m.group(3) == u'倍':
                        op = u'*'
                    else:
                        raise Exception, u'パースエラー:' + effect
                    
                    values = re.split(u'[~〜]', m.group(2))
                    min = values[0]
                    if len(values) == 2:
                        max = values[1]
                    else:
                        max = values[0]
                else:
                    raise Exception, u'パースエラー:' + effect

    map = {
        u'スタミナ' : u'最大スタミナ',
        u'生命力' : u'最大スタミナ',
        u'マナ' : u'最大マナ',
        u'修理費用' : u'修理費',
        u'バランス' : u'ダメージバランス',

        u'水属性錬金術ダメージ' : u'水属性の錬金術ダメージ',
        u'風属性錬金術ダメージ' : u'風属性の錬金術ダメージ',
        u'火属性錬金術ダメージ' : u'火属性の錬金術ダメージ',
        }
    if target in map: target = map[target]

    if target in (
        u'最大生命力',
        u'最大スタミナ',
        u'最大マナ',

        u'Str',
        u'Dex',
        u'Will',
        u'Luck',
        u'Int',
        
        u'最大ダメージ',
        u'最小ダメージ',
        u'クリティカル',
        
        u'保護',
        u'防御',
        
        u'ダメージバランス',

        u'最大負傷率',
        u'最小負傷率',

        u'戦闘力',
        u'修理費',

        u'消費マナ減少',
        u'毒免疫',
        u'爆発抵抗',

        u'結晶製作成功率',
        u'分解成功率',
        u'合成成功率',
        u'風属性の錬金術ダメージ',
        u'水属性の錬金術ダメージ',
        u'火属性の錬金術ダメージ',
        ):
        return u'%s %s %s %s' % (target, op, min, max)
    else:
        raise Exception, u'効果不明: ' + target
    
def to_effects(text):
    """Enchant.effects_text を元に Enchant.effects を返す"""
    
    if not text: return text

    texts = text.split('\n')

    effects = []
    for s in texts:
        e = to_effect(s)
        if e:
            effects.append(e)
            
    return '\n'.join(effects)

def to_rank(s):
    '''「Aランク」のような文字列をランクを表す数値へ変換する'''
    m = rank_re.match(s)
    s = m.group(1).upper()
    map = {
        'A' : 10,
        'B' : 11,
        'C' : 12,
        'D' : 13,
        'E' : 14,
        'F' : 15
        }
    rank = map.get(s)
    if rank:
        return rank
    else:
        return int(s)


def to_float(s):
    """〜%という文字を float に変換する"""
    return float(re.sub(r'[\s%]', '', s)) / 100

def to_int(s):
    return int(re.sub(ur'[^\d-]', u'', s))

def to_min_max(s):
    s = re.split(u'[~〜]', s)
    return (int(s[0]), int(s[1]))

def to_cost(s):
    a = re.sub(ur'[^\d-]', u'', s)
    if len(a) == 0: raise Exception, u'金額として扱えません:' + s
    return int(a)

def parse_effect(s):
    '''攻撃力+10 のような文字列を解析する

    return ('攻撃力', 10)
    '''

    m = re.match(ur'(\S+)\s*([+\-])\s*(\d+)', s)
    if not m:
        raise Exception, u'パースエラー'

    name = m.group(1)
    value = int(m.group(3))
    if m.group(2) == '-': value = -value
    return (name, value)
