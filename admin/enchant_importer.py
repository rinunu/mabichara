# -*- coding: utf-8 -*-

import re
import logging

from BeautifulSoup import BeautifulSoup

import mabi.master
import parse_helper

# ----------------------------------------------------------------------

def to_equipment(text):
    """Enchant.equipment_text を元に Enchant.equipment を設定する"""
    
    if not text: return '*'

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
        u'帽子と兜' : u'頭',
        u'帽子 兜' : u'頭',
        u'足装備' : u'足',
        u'靴' : u'足',
        u'靴と金属製のブーツ' : u'足',
        u'素材が木ではないガントレット' : u'ガントレット', # todo 当面はこれで
        u'簡易テーブルと鍋' : u'簡易テーブルと万能鍋',
        u'兜(帽子不可)' : u'兜',
        u'両手ナックル' : u'ナックル',
        u'鉄製の武器と防具' : u'材料が鉄の武器と防具',
        u'服？' : u'服',
        u'王政錬金術師のブーツ' : u'王政錬金術師ブーツ',
        }
    if text in map1: text = map1[text]        
    
    # 内部形式に変換する
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
        u'材料が鉄の武器と防具' : u'* & /鉄/', # 
        u'材料が木の武器と防具' : u'* & /木/ | /武器/弓/ショートボウ以外/', # TODO ショートボウ以外? 何にはれるのかよくわからない。。
        u'革素材の鎧' : u'/体/ & /革/',
        u'巨大料理道具' : u'/巨大料理道具/',
        u'料理用道具' : u'/右手/ & /料理用道具/ | /左手/ & /料理用道具/',
        u'スパイカーのシルバー装備のセット' : u'/スパイカーのシルバー装備のセット/',
        u'ダスティンシルバーナイトセット' : u'/ダスティンシルバーナイトセット/',
        u'ノルマンウォーリアセット' : u'/ノルマンウォーリアセット/',
        u'グレースプレートセット' : u'/グレースプレートセット/',
        
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


def split_effect(text):
    '''text を条件部と効果に分離する'''
    base_re = re.compile(ur'(.*?)(?:時|の場合|の時|場合|とき)[、\s]*')

    m = base_re.match(text)
    if not m:
        return None, text
    condition = m.group(1)
    effect = text[m.end():]
    return condition, effect

def parse_condition(text):
    '''Effect の条件の文字列表現を内部形式へ変換する
    rerun (条件の解析結果, 効果の解析前文字列)
    '''

    try:
        title_re = re.compile(ur'(.+)タイトル(?:をつけている|使用中|にしている)?')

        simples = [
            [re.compile(ur'エルフ又はエルフ支持中'), u'support_race = elf'],
            [re.compile(ur'ジャイアント(であるか|又は)ジャイアントを?支持中'), u'support_race = giant'],
            [re.compile(ur'デッドリー状態'), u'= deadly'],
            [re.compile(ur'ポーション中毒'), u'= potion_poisoned'],
            [re.compile(ur'ゴーレムを使役中'), u'= golem'],
            [re.compile(ur'防護壁を召還中'), u'= protective_wall'],
            [re.compile(ur'毒に侵された|毒状態'), u'= poisoned']]
        
        age_re = re.compile(ur'([\d]+)歳(以上|以下|)')
        etc_re = re.compile(ur'(.*?)(?:ランク)?[が\s]*([0-9A-F]+|練習)(以上|以下|)')

        condition, effect = split_effect(text)
        if not condition: return u'', effect

        for simple in simples:
            m = simple[0].match(condition)
            if m: return simple[1], effect

        m = title_re.match(condition)
        if m: 
            return u'title = ' + m.group(1), effect

        ops = {
            u'以上': '>=',
            u'以下': '<=',
            u'': '=',}

        m = age_re.match(condition)
        if m:
            return u' '.join([u'age', ops[m.group(2)], m.group(1)]), effect
    
        m = etc_re.match(condition)
        if m:
            name = m.group(1)
            map = {u'レベル': 'level', u'探検レベル': 'exploration_lv'}
            name = map.get(name)
            if name:
                return u' '.join([name, ops[m.group(3)], m.group(2)]), effect
            else: # todo スキル名のチェック
                return u' '.join([u'skill',
                                  m.group(1),
                                  ops[m.group(3)],
                                  unicode(to_rank(m.group(2)))]), effect

        raise Exception(u'todo' + effect + '-' + condition)
    except Exception, e:
        raise Exception(u'条件をパース出来ませんでした:' + text + u', ' + e.message)


ignore_re = re.compile(ur'^注：|.*にのみエンチャント可能') # 無視する記述
rank_regardless_re = re.compile(ur'ランクに関係なくエンチャント可能')
personalized_re = re.compile(ur'エンチャントアイテムが装備者専用になる|エンチャント装備を専用にする')

def to_effect(text):
    '''Effect の文字列表現を内部形式へ変換する
    '''

    text = text.replace(u'～', u'~')
    text = text.replace(u'〜', u'~')
    text = text.replace(u'、', u'')

    try:    
        if ignore_re.match(text):
            return None
    
        # ランクに関係なく
        m = rank_regardless_re.match(text)
        if m:
            return None
        
        # 専用
        m = personalized_re.match(text)
        if m: return None
    
        # 条件
        condition, effect = parse_condition(text)
    
        e = parse_helper.parse_effect(effect)
        e.condition = condition
        return unicode(e)
    except Exception, e:
        # raise
        raise Exception(u'パースできませんでした: "' + text + u'", ' + e.message)
    
def to_effects(text):
    '''複数の Effect の文字列表現を内部表現に変換する'''
    
    if not text: return text

    texts = text.split('\n')

    effects = []
    for s in texts:
        e = to_effect(s)
        if e:
            effects.append(e)
            
    return '\n'.join(effects)

rank_re = re.compile(u'([a-fA-F0-9]|練習)(?:ランク)?')

def to_rank(s):
    '''「A」「Aランク」のような文字列をランクを表す数値へ変換する'''
    m = rank_re.match(s)
    s = m.group(1)
    map = {
        u'A' : 10,
        u'B' : 11,
        u'C' : 12,
        u'D' : 13,
        u'E' : 14,
        u'F' : 15,
        u'練習' : 16,
        }
    rank = map.get(s)
    if rank:
        return rank
    else:
        return int(s)

# ----------------------------------------------------------------------

def get_names(tr):
    a = u''.join(tr.th(text = True))
    a = re.sub(ur'[◇◆]?\(.*', '', a)
    return a.split('/')

def get_equipment_text(tr):
    span = tr.th.find(style='color:Maroon')
    if span:
        return u''.join(span.findAll(text=True))
    else:
        return None

def get_source(tr, base_url):
    a = tr.th.a
    if a: return base_url + tr.th.a['href']
    else: base_url

def get_english_name(tr):
    english_name_re = re.compile(r'\((?:of )?(.*)\)')
    a = english_name_re.match(tr.th.find(text = english_name_re)).group(1)
    if not a: a = u'unknown'
    return a

def get_effects_text(tr):
    return u'\n'.join(tr.contents[1].findAll(text = True))

def is_capter(tag):
    capter_re = re.compile(u'^(.*)実装$')
    return tag.name == u'tr' and tag.find(text = capter_re)

def get_season_unimplemented(tr):
    span = tr.th.find(style='color:Red')
    return unicode(span.string)

def parse(url, html):
    """HTML を解析し、エンチャントデータとして返す"""
    
    soup = BeautifulSoup(html)
    
    result = []

    if re.search(u'prefix', unicode(soup.title)):
        root = u'p'
    else:
        root = u's'
    
    body = soup.find(id = u'body')
    ranks = body.findAll(lambda tag: tag.name == u'h2' and tag.find(text = rank_re))

    for rank_h in ranks:
        rank = to_rank(rank_h.contents[0])
        # 「C1実装」みたいなのを探す
        capters = rank_h.findNext(u'table').findAll(is_capter)
        for capter in capters:
            capter_name = unicode(capter.th.string)
            
            # 各ESを列挙する. 
            tr = capter.findNextSibling(u'tr')
            while tr:
                if len(tr) == 4: # ES は tr に td, th を4つ含んでいる
                    equipment_text = get_equipment_text(tr)
                    effects_text = get_effects_text(tr)
                    english_name = get_english_name(tr)

                    enchant = {
                        'english_name' : english_name,
                        'root' : root,
                        'rank' : rank,
                        'names' : get_names(tr),
                        'effects_text' : effects_text,
                        'effects' : to_effects(effects_text),
                        'equipment_text' : equipment_text,
                        'equipment' : to_equipment(equipment_text),
                        'source' : get_source(tr, url),
                        'season' : capter_name}

                    result.append(enchant)
                elif is_capter(tr):
                    break
                else: # ES の継続行
                    pass
                tr = tr.findNextSibling(u'tr')
    return result


# def parse_unimplemented(url, html):
#     """未実装ページの HTML を解析し、エンチャントデータとして返す"""
    
#     soup = BeautifulSoup(html)
    
#     result = []

#     rank_re = re.compile(u'([a-fA-F0-9]ランク)\((.*)\)')
    
#     body = soup.find(id = u'body')
#     ranks = body.findAll(lambda tag: tag.name == u'h3' and tag.find(text = rank_re))
#     for rank_h in ranks:
#         m = rank_re.match(rank_h.contents[0])
#         rank = to_rank(m.group(1))
#         root = 'p' if m.group(2).startswith('p') else 's'
        
#         table = rank_h.findNext(u'table').tbody
#         # 各ESを列挙する. 
#         for tr in table.findAll(u'tr'):
#             equipment_text = get_equipment_text(tr)
#             effects_text = get_effects_text(tr)
#             english_name = get_english_name(tr)
            
#             enchant = Enchant.create_or_update(
#                 english_name = english_name,
#                 root = root,
#                 rank = rank,
#                 names = get_names(tr),
#                 effects_text = effects_text,
#                 effects = to_effects(effects_text),
#                 equipment_text = equipment_text,
#                 equipment = to_equipment(equipment_text),
#                 source = url,
#                 season = get_season_unimplemented(tr),
#                 implemented = False)
#             result.append(enchant)
#     return result

