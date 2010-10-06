# -*- coding: utf-8 -*-

import re
import logging

from BeautifulSoup import BeautifulSoup

import mabi.master
import parse_helper
from admin.exceptions import ParseException

# 効果の解析をスキップするタイトル
no_effect_titles = [
    u'パラディン',
    u'ホワイトナイト',
    u'ホーリーナイト',
    u'チャンピオン',
    u'ダークナイト',
    u'ブラックナイト',
    u'カオスナイト',
    u'インフラブラック',
    u'[使用不可能]devCAT',
    u'[使用不可能]GM',

    # 「応急治療E獲得」など、想定していない効果があるため保留
    u'キアシールブレイカー',
    u'ラビシールブレイカー',
    u'マスシールブレイカー',
    u'アブネアシールブレイカー',
    ]

name_re = re.compile(ur'【.*】(.*)$')
def get_name(head):
    '''タイトルの名称を取得する'''
    s = parse_helper.get_string(head)
    m = name_re.match(s)
    s = m.group(1)
    return s

def get_effects(head):
    effects = []

    # かならず「減少/増加」効果がある前提で実装している
    node = head.findNext(lambda tag: tag.name == 'span'
                         and tag.find(text=re.compile(u'減少|増加')))
    if not node:
        logging.warning(u'効果が存在しません: ' + parse_helper.get_string(head));
        return effects

    for effect in node.parent.findAll('span'):
        effect = parse_helper.parse_effect(parse_helper.get_string(effect))
        if effect:
            effects.append(effect)
    return effects

def get_item(head):
    '''タイトル情報を取得する'''

    try:
        name = get_name(head)
        if not name:
            return None

        item = {'name': name}

        if name not in no_effect_titles:
            item['effects'] = get_effects(head)
        else:
            item['effects'] = []
        
        return item
    except ParseException, e:
        e = ParseException(parse_helper.get_string(head) + u' ' + e.message)
        # print e.message
        raise e

def parse(url, html):
    '''HTML を解析し、タイトルデータとして返す'''
    
    soup = BeautifulSoup(html)

    result = []

    body = soup.find(id = u'body')

    # 各アイテムの先頭
    heads = body.findAll(lambda tag: tag.name == u'h2' and tag.find(text = re.compile(u'^【')))

    for head in heads:
        item = get_item(head)
        if not item:
            continue

        result.append(item)

    return result

