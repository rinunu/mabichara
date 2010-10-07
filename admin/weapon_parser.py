# -*- coding: utf-8 -*-

import re
import logging
from BeautifulSoup import BeautifulSoup

import parse_helper
from parse_helper import get_string
from parse_helper import parse_effect
from parse_helper import to_min_max
from parse_helper import to_float_range
from parse_helper import to_int
from parse_helper import to_float
from parse_helper import to_cost
from parse_helper import get_td

from exceptions import ParseException

class WeaponParser:
    def parse_effects(self, td):
        '''改造の効果をパースする'''
        result = []
        text = ' '.join(td.findAll(text=True))
        m = re.findall(ur'\S+\s*[+\-]\s*\d+', text)
        for s in m:
            effect = parse_effect(s)
            result.append(effect)
        return result

    def parse_basic_info(self, body, item):
        '''武器の基本情報を解析し、 item へ登録'''

        table = body.findAll('table')[0]
        item['category'] = get_string(get_td(table, u'分類'))
        item['range'] = to_int(get_td(table, u'射程'))
        item['attack'] = to_min_max(get_td(table, u'攻撃'))
        item['durability'] = to_int(get_td(table, u'耐久'))
        item['wound'] = to_min_max(get_td(table, u'負傷率'))
        item['critical'] = to_int(get_td(table, u'クリティカル'))
        item['balance'] = to_int(get_td(table, u'バランス'))
        item['ug'] = to_int(get_td(table, u'UG'))
    
    def parse_upgrades(self, table):
        '''改造情報を解析する'''

        result = []
        for tr in table.tbody('tr'):
            if len(tr) < 5: continue
            
            item = {}
            item['name'] = get_string(tr('td')[0])
            item['proficiency'] = to_int(tr('td')[1])
            item['ug'] = to_min_max(tr('td')[3])
            item['cost'] = to_cost(tr('td')[4])
            item['effects'] = self.parse_effects(tr('td')[2])
            result.append(item)
        return result

    def normalize_upgrade_name(self, name):
        '''改造名のゆらぎを解決する'''
        name = re.sub(ur'ぎ', ur'', name) # 剣研ぎ etc.
        name = re.sub(ur'刃', ur'刀', name)
        name = re.sub(ur'の', ur'', name)
        name = re.sub(ur'機', ur'器', name)
        return name
    
    def find_upgrade(self, upgrades, name):
        '''指定された名前の Upgrade を返す
    
        (1回余り)等、無効な名前の場合は None を返す
    
        不明な名前の場合は例外を投げる
    
        '''

        if re.match(ur'\([^)]*余り\)|-', name):
            return None
    
        name = self.normalize_upgrade_name(name)

        # WB のように略されているものは、比較しないようにする
        name = re.sub(ur'[A-Z]+', u'.*', name)
        
        name_re = re.compile(name)
        
        for upgrade in upgrades:
            if name_re.match(self.normalize_upgrade_name(upgrade['name'])):
                return upgrade

        # print name
        raise Exception, u'改造が見つかりません: ' + name

    def parse_upgrade_sequence(self, s, upgrades):
        '''「軽量化＞軽量化＞軽量化＞軽量化＞(1回余り)」のような文字列を解析する'''

        list = s.split(u'＞')
        list = [self.find_upgrade(upgrades, i) for i in list]
        list = [i for i in list if i]
        return list

    def parse_upgrade_sequences(self, body, upgrades):
        '''おすすめ改造を解析し、 Weapon として登録する
        '''

        try:
            seq_name_re = re.compile(ur'(.*式.*)')
    
            seqs = body.findAll(lambda tag: tag.name == u'h4' and
                                tag.find(text = seq_name_re))

            list = []
            for seq in seqs:
                name = get_string(seq)
                text = get_string(seq.findNext('p', 'quotation'))
                seq = self.parse_upgrade_sequence(text, upgrades)
                list.append({'name': name, 'upgrades': seq})

            return list
        except Exception, e:
            raise ParseException(u'改造式の解析に失敗しました, %s' % e.message)
    
    def parse(self, url, html):
        """HTML を解析し、保存する
    
            
        """

        try:
        
            soup = BeautifulSoup(html)
            body = soup.find(id = 'body')

            item = {}

            topic_path = parse_helper.topic_path(soup)
            name = topic_path[-1]
            item['name'] = name
        
            self.parse_basic_info(body, item)

            upgrades = self.parse_upgrades(body.findAll('table')[1])
            item['upgrades'] = upgrades
            item['jewel_upgrades'] = self.parse_upgrades(body.findAll('table')[2])
            item['upgrade_sequences'] = self.parse_upgrade_sequences(body, upgrades)
        except Exception, e:
            raise ParseException(u'解析に失敗しました: %s, %s' % (name, e.message))

        return item
    
