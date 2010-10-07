# -*- coding: utf-8 -*-

import re

import mabi.master
from mabi.effect import Effect

class int_range:
    '''最大と最小を持つ int
    型の識別にのみ使用する
    '''
    pass

class float_range:
    '''最大と最小をもつ float
    型の識別にのみ使用する
    '''
    pass

def normalize(s):
    '''基本的なゆらぎを解消する
    (空白、英数字、記号)'''

    s = s.replace(u'～', u'~')
    s = s.replace(u'〜', u'~')

    return s

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
    '''「1~2」という文字列を解析する'''
    s = re.split(u'~', normalize(get_string(s)))
    return (to_int(s[0]), to_int(s[1]))

def to_float_range(s):
    '''「1~2%」という文字列を解析する'''
    s = re.split(u'~', normalize(get_string(s)))
    return (to_float(s[0]), to_float(s[1]))

def to_cost(s):
    s = get_string(s)
    a = re.sub(ur'[^\d-]', u'', s)
    if len(a) == 0: raise Exception, u'金額として扱えません:' + s
    return int(a)

def to_param_id(name):
    '''効果の日本語名から内部 ID へ変換する'''

    # ゆらぎ修正
    name = name.capitalize()

    id = mabi.master.param_name_id_map.get(name)
    if id:
        return id
    else: 
        # print '[' + name + u']'
        raise Exception, u'不明な効果です: ' + name

effect_re = re.compile(ur'(.+?)\s*([+-]*)\s*([\d~]+)[％%]?\s*(増加|減少|倍|)\s*$')
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
            op1 = m.group(2)
            num = m.group(3)
            op2 = m.group(4)

            if op1 == '+' or op2 == u'増加':
                op = u'+'
            elif op1 == '-' or op2 == u'減少':
                op = u'-'
            elif op2 == u'倍':
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

def topic_path(root):
    '''パンくずリストを解析し、アイテムの配列を返す'''
    topicpath = root.find(id = 'topicpath')
    items = [unicode(item.text).strip() for item in topicpath.findAll('a')]

    items.append(
        re.sub(ur'^ &gt; ', u'', topicpath.contents[-1]).strip())

    return items
