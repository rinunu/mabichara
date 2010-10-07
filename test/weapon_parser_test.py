#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

sys.path = ['./'] + sys.path

import unittest
from admin.weapon_parser import WeaponParser


from BeautifulSoup import BeautifulSoup
from mabi.effect import Effect

class WeaponParserTest(unittest.TestCase):
    def node(self, text):
        return BeautifulSoup(text)

    def parse_effects(self, s):
        return WeaponParser().parse_effects(self.node(s))

    def parse_upgrade_sequence(self, s, upgrades):
        return WeaponParser().parse_upgrade_sequence(s, upgrades)

    def parse(self, file_name):
        f = open('test/%s.html' % file_name)
        try:
            item = WeaponParser().parse('url', f.read())
        finally:
            f.close()
        return item

    def test_whole(self):
        '''全体的なパース処理'''

        item = self.parse('wingbow')

        self.assertEqual(u'ウィングボウ', item['name'])
        self.assertEqual(u'弓', item['category'])
        self.assertEqual(2000, item['range'])
        self.assertEqual((2, 18), item['attack'])
        self.assertEqual(15, item['durability'])
        self.assertEqual((0, 50), item['wound'])
        self.assertEqual(24, item['critical'])
        self.assertEqual(40, item['balance'])
        self.assertEqual(5, item['ug'])

        self.assertEqual(11, len(item['upgrades']))

        # 最初の改造
        self.assertEqual(
            {'name': u'チップ強化1',
             'proficiency': 17,
             'effects': [Effect(param='critical', op='+', min=6),
                         Effect(param='attack_min', op='-', min=1)],
             'ug': (0, 2),
             'cost': 900
             }, item['upgrades'][0])

        # 最後の改造
        self.assertEqual(
            {'name': u'アランウェン式ウィングボウ強化',
             'proficiency': 75,
             'effects': [Effect(param='attack_min', op='+', min=4),
                         Effect(param='attack_max', op='+', min=5),
                         Effect(param='balance', op='-', min=10),
                         Effect(param='wound_max', op='-', min=20)],
             'ug': (4, 4),
             'cost': 19000
             }, item['upgrades'][-1])

        self.assertEqual(1, len(item['jewel_upgrades']))
        
        # 最初の改造
        self.assertEqual(
            {'name': u'宝石共通改造(弓)',
             'proficiency': 100,
             'effects': [Effect(param='durability', op='+', min=2)],
             'ug': (0, 0),
             'cost': 25000,
             }, item['jewel_upgrades'][0])

        # おすすめ改造式
        self.assertEqual(2, len(item['upgrade_sequences']))
        ugs = item['upgrades']

        seq = item['upgrade_sequences'][0]
        self.assertEqual(
            {'name': u'105式 クリティカル特化型',
             'upgrades': [ugs[0], ugs[1], ugs[2], ugs[2], ugs[2]]},
            seq)

    def test_parse_effects_basic(self):
        '''効果の基本フォーマット'''

        src = '''<td><span>クリティカル+6</span>
<span>最小攻撃力-1</span></td>'''

        self.assertEqual(
            [Effect(param='critical', op='+', min=6),
             Effect(param='attack_min', op='-', min=1)],
            self.parse_effects(src))
                
    def test_parse_effects_2(self):
        '''増加効果が連続する場合'''

        src = '''<td><span>最小攻撃力+1 クリティカル+1</span>
<span>バランス-2</span></td>'''

        self.assertEqual(
            [Effect(param='attack_min', op='+', min=1),
             Effect(param='critical', op='+', min=1),
             Effect(param='balance', op='-', min=2)],
            self.parse_effects(src))
                
    def test_parse_upgrade_sequence_wb(self):
        '''略されている改造名'''
        upgrades = [{'name': u'ネリス式ウィングボウ強化'}]

        self.assertEqual(
            [upgrades[0]],
            self.parse_upgrade_sequence(
                u'ネリス式WB強化', upgrades))

    def test_parse_upgrade_sequence_wb(self):
        '''未完成の改造式'''
        upgrades = [{'name': u'メレス式改造'}]

        self.assertEqual(
            [upgrades[0]],
            self.parse_upgrade_sequence(
                u'メレス式改造＞(1回余り)', upgrades))

        self.assertEqual(
            [upgrades[0]],
            self.parse_upgrade_sequence(
                u'メレス式改造＞-', upgrades))

if __name__ == '__main__':
    unittest.main()
