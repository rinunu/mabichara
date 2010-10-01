# -*- coding: utf-8 -*-

import re

def normalize(text):
    '''基本的なゆらぎを解消する
    (空白、英数字、記号)'''
    return text # todo
    

def get_string(tag, separator=''):
    '''タグの文字列を取得する

    tag が文字列の場合はそのまま返す

    先頭と末尾の空白は削除する

    '''

    if isinstance(tag, basestring):
        return tag
    else:
        return separator.join(tag.findAll(text=True)).strip()

def get_td(table, name):
    '''指定された TH の次にでてくる TD を返す'''
    
    return table(text=name)[0].findNext('td')
    

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

# def parse_effect(s):
#     '''攻撃力+10 のような文字列を解析する

#     return ('攻撃力', 10)
#     '''

#     m = re.match(ur'(\S+)\s*([+\-])\s*(\d+)', s)
#     if not m:
#         raise Exception, u'パースエラー'

#     name = m.group(1)
#     value = int(m.group(3))
#     if m.group(2) == '-': value = -value
#     return (name, value)
