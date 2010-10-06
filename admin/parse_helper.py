# -*- coding: utf-8 -*-

import re

import mabi.master
from mabi.effect import Effect

def normalize(text):
    '''基本的なゆらぎを解消する
    (空白、英数字、記号)'''
    return text # todo
    

def get_string(tag, separator=''):
    '''タグの子供のテキストを取得する

    tag が文字列の場合はそのまま返す

    先頭と末尾の空白は削除する

    '''

    if isinstance(tag, basestring):
        return tag
    else:
        return separator.join(tag.findAll(text=True)).strip()

def get_td(table, name):
    '''指定された TH に対応する TD を返す'''

    th = table.find(text=name)
    if not th:
        return None
    return th.findNext('td')

def to_float(s):
    """〜%という文字を float に変換する"""
    return float(re.sub(r'[\s%]', '', get_string(s))) / 100

def to_int(s):
    return int(re.sub(ur'[^\d-]', u'', get_string(s)))
        

def to_min_max(s):
    s = re.split(u'[~〜]', get_string(s))
    return (int(s[0]), int(s[1]))

def to_cost(s):
    a = re.sub(ur'[^\d-]', u'', s)
    if len(a) == 0: raise Exception, u'金額として扱えません:' + s
    return int(a)

def to_param_id(name):
    '''効果の日本語名から内部 ID へ変換する'''

    # ゆらぎ修正
    name = name.capitalize()
    map = {
        u'生命力' : u'最大生命力',
        u'スタミナ' : u'最大スタミナ',
        u'マナ' : u'最大マナ',

        u'ダメージバランス' : u'バランス',

        u'修理費用' : u'修理費',
        u'結晶制作成功率' : u'結晶製作成功率',

        u'風属性の錬金術ダメージ' : u'風属性錬金術ダメージ',
        u'水属性の錬金術ダメージ' : u'水属性錬金術ダメージ',
        u'火属性の錬金術ダメージ' : u'火属性錬金術ダメージ',

        u'水属性の錬金ダメージ' : u'水属性錬金術ダメージ',
        u'火属性の錬金ダメージ' : u'火属性錬金術ダメージ',
        }
    name = map.get(name, name)

    id = mabi.master.param_name_id_map.get(name)
    if id:
        return id
    else: 
        # print name
        raise Exception, u'不明な効果です: ' + name

effect_re = re.compile(ur'(.+?)[\s+-]*([\d~]+)[％%]?\s*(増加|減少|倍|)\s*$')
cp_re = re.compile(ur'((?:ほんの)?(:?少し)?(?:弱|強)そう)\((?:戦闘力)?(.*)\)')
def parse_effect(s):
    '''攻撃力+10 のような文字列を解析する

    return mabi.Effect
    '''

    # 強そう弱そう系
    m = cp_re.match(s)
    if m:
        param = u'cp'
        op = u'+'
        min = u'1' # todo
        max = u'1' # todo
    else:
        # s = re.sub(ur'\([^)]*\)$', u'', s) # 文末の補足を削除

        # 増加・減少系の効果解析
        m = effect_re.match(s)
        if m:
            param = to_param_id(m.group(1))
            num = m.group(2)
            op = m.group(3)

            if op == u'増加' or op == u'':
                op = u'+'
            elif m.group(3) == u'減少':
                op = u'-'
            elif m.group(3) == u'倍':
                op = u'*'
            else:
                raise Exception(u'')
            
            values = re.split(u'[~]', num)
            min = values[0]
            if len(values) == 2:
                max = values[1]
            else:
                max = values[0]
        else:
            raise Exception(u'Effect をパースできませんでした:' + s)

    return Effect(param=param, op=op, min=min, max=max)

