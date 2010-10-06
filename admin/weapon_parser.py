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
        item['wound'] = to_float_range(get_td(table, u'負傷率'))
        item['critical'] = to_float(get_td(table, u'クリティカル'))
        item['balance'] = to_float(get_td(table, u'バランス'))
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
    
    def find_upgrade(upgrades, name):
        '''指定された名前の WeaponUpgrade を返す
    
        (1回余り)等、無効な名前の場合は None を返す
    
        不明な名前の場合は例外を投げる
    
        '''
    
        # 名前の正規化
        name = re.sub(ur'剣研(\d)', ur'剣研ぎ\1', name)
        name = re.sub(ur'刃磨き', ur'刀磨き', name)
    
        if re.match(ur'\([^)]*余り\)', name):
            return None
        
        for upgrade in upgrades:
            if upgrade.name == name:
                return upgrade
    
        raise Exception, u'改造が見つかりません: ' + name

    def parse_upgrade_sequences(soup, weapon_class, upgrades):
        '''おすすめ改造を解析し、 Weapon として登録する
    
        TODO Wiki のおすすめには宝石改造が入っていないため、宝石改造をしたバリエーションも追加する
    
        '''
    
        seq_name_re = re.compile(ur'(.*式.*)')
    
        seqs = soup.findAll(lambda tag: tag.name == u'h4' and tag.find(text = seq_name_re))
    
        for seq in seqs:
            name = parse_helper.get_string(seq)
            text = parse_helper.get_string(seq.findNext('p', 'quotation')) # ex: 軽量化＞軽量化＞軽量化＞軽量化＞(1回余り)
            list = text.split(u'＞')
            list = [find_upgrade(upgrades, i) for i in list]
            list = [i for i in list if i]
    
            Weapon.create_or_update(weapon_class, list, name)
            if weapon_class.ug == len(list):
                _make_sequences(name + u'(宝石)', list, weapon_class, upgrades)
    
    def parse(self, url, html):
        """HTML を解析し、保存する
    
            
        """
        
        soup = BeautifulSoup(html)
        body = soup.find(id = 'body')

        item = {}

        topic_path = parse_helper.topic_path(soup)
        item['name'] = topic_path[-1]
        
        self.parse_basic_info(body, item)

        item['upgrades'] = self.parse_upgrades(body.findAll('table')[1])
        item['jewel_upgrades'] = self.parse_upgrades(body.findAll('table')[2])

        return item
    
