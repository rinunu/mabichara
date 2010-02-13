# -*- coding: utf-8 -*-

import re
import logging

from BeautifulSoup import BeautifulSoup
from mabi.enchant import Enchant

import parse_helper

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
    ranks = body.findAll(lambda tag: tag.name == u'h2' and tag.find(text = parse_helper.rank_re))

    for rank_h in ranks:
        rank = parse_helper.to_rank(rank_h.contents[0])
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

                    enchant = Enchant.create_or_update(
                        english_name = english_name,
                        root = root,
                        rank = rank,
                        names = get_names(tr),
                        effects_text = effects_text,
                        effects = parse_helper.to_effects(effects_text),
                        equipment_text = equipment_text,
                        equipment = parse_helper.to_equipment(equipment_text),
                        source = get_source(tr, url),
                        season = capter_name)
                    result.append(enchant)
                elif is_capter(tr):
                    break
                else: # ES の継続行
                    pass
                tr = tr.findNextSibling(u'tr')
    return result


def parse_unimplemented(url, html):
    """未実装ページの HTML を解析し、エンチャントデータとして返す"""
    
    soup = BeautifulSoup(html)
    
    result = []

    rank_re = re.compile(u'([a-fA-F0-9]ランク)\((.*)\)')
    
    body = soup.find(id = u'body')
    ranks = body.findAll(lambda tag: tag.name == u'h3' and tag.find(text = rank_re))
    for rank_h in ranks:
        m = rank_re.match(rank_h.contents[0])
        rank = parse_helper.to_rank(m.group(1))
        root = 'p' if m.group(2).startswith('p') else 's'
        
        table = rank_h.findNext(u'table').tbody
        # 各ESを列挙する. 
        for tr in table.findAll(u'tr'):
            equipment_text = get_equipment_text(tr)
            effects_text = get_effects_text(tr)
            english_name = get_english_name(tr)
            
            enchant = Enchant.create_or_update(
                english_name = english_name,
                root = root,
                rank = rank,
                names = get_names(tr),
                effects_text = effects_text,
                effects = parse_helper.to_effects(effects_text),
                equipment_text = equipment_text,
                equipment = parse_helper.to_equipment(equipment_text),
                source = url,
                season = get_season_unimplemented(tr),
                implemented = False)
            result.append(enchant)
    return result

