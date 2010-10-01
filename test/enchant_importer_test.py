#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

sys.path = ['./'] + sys.path

import unittest
from admin.enchant_importer import to_effect

class FooTest(unittest.TestCase):

    def test_basic(self):
        self.assertEqual(u'int,-,1,1,',
                         to_effect(u'Int 1減少'))

    def test_min_max(self):
        self.assertEqual(u'critical,+,4,7,',
                         to_effect(u'クリティカル4～7増加'))

    # ----------------------------------------------------------------------
    # 条件

    def test_skill(self):
        self.assertEqual(u'critical,+,4,7,skill アタック >= 9',
                         to_effect(u'アタック9以上の場合、クリティカル4～7増加'))
        self.assertEqual(u'int,-,1,1,skill アタック >= 9',
                         to_effect(u'アタック9以上の場合、Int 1減少'))
        self.assertEqual(u'attack_max,+,4,4,skill スマッシュ = 1',
                         to_effect(u'スマッシュ1の場合最大ダメージ4増加'))

    def test_skill_alphabet(self):
        self.assertEqual(u'int,-,1,1,skill アタック >= 10',
                         to_effect(u'アタックA以上の場合、Int 1減少'))
        self.assertEqual(u'int,-,1,1,skill アタック >= 11',
                         to_effect(u'アタックB以上の場合、Int 1減少'))
        self.assertEqual(u'int,-,1,1,skill アタック >= 12',
                         to_effect(u'アタックC以上の場合、Int 1減少'))
        self.assertEqual(u'int,-,1,1,skill アタック >= 13',
                         to_effect(u'アタックD以上の場合、Int 1減少'))
        self.assertEqual(u'int,-,1,1,skill アタック >= 14',
                         to_effect(u'アタックE以上の場合、Int 1減少'))
        self.assertEqual(u'int,-,1,1,skill アタック >= 15',
                         to_effect(u'アタックF以上の場合、Int 1減少'))
        self.assertEqual(u'int,-,1,1,skill アタック >= 16',
                         to_effect(u'アタック練習以上の場合、Int 1減少'))

    def test_title(self):
        self.assertEqual(u'balance,+,5,5,title = ファルコンセイジ',
                         to_effect(u'ファルコンセイジタイトルにしている時バランス5%増加'))
        self.assertEqual(u'str,+,30,30,title = ビーストロード',
                         to_effect(u'ビーストロードタイトルをつけているときStr 30増加'))
        self.assertEqual(u'attack_max,+,3,7,title = グラディエーター',
                         to_effect(u'グラディエータータイトルの時 最大ダメージ 3~7 増加'))

    def test_elf(self):
        self.assertEqual(u'stamina_max,+,6,6,support_race = elf',
                         to_effect(u'エルフ又はエルフ支持中の場合、最大スタミナ6増加'))
    def test_giant(self):
        self.assertEqual(u'defence,+,1,1,support_race = giant',
                         to_effect(u'ジャイアントであるか、ジャイアント支持中の時、防御1増加'))
        self.assertEqual(u'str,+,2,8,support_race = giant',
                         to_effect(u'ジャイアント又はジャイアント支持中の場合、Str 2~8増加'))
        self.assertEqual(u'str,+,20,20,support_race = giant',
                         to_effect(u'ジャイアントであるかジャイアント支持中の時、Str 20増加'))
        self.assertEqual(u'life_max,+,3,3,support_race = giant',
                         to_effect(u'ジャイアントであるかジャイアントを支持中の時最大生命力3増加'))

    def test_ignore(self):
        self.assertFalse(to_effect(u'注：他の修理費増加系と併用でも10倍のまま'))

    def test_deadly(self):
        self.assertEqual(u'dex,+,10,10,= deadly',
                         to_effect(u'デッドリー状態の場合、Dex 10増加'))

    def test_potion_poisoned(self):
        self.assertEqual(u'str,+,10,10,= potion_poisoned',
                         to_effect(u'ポーション中毒の場合、Str10増加'))

    def test_poisoned(self):
        self.assertEqual(u'int,+,10,10,= poisoned',
                         to_effect(u'毒に侵された場合、Int10増加'))
        self.assertEqual(u'will,+,5,5,= poisoned',
                         to_effect(u'毒状態の場合、Will 5 増加'))
   
    def test_golem(self):
        self.assertEqual(u'defence,+,3,3,= golem',
                         to_effect(u'ゴーレムを使役中の時防御3増加'))

    def test_protective_wall(self):
        self.assertEqual(u'protection,+,3,3,= protective_wall',
                         to_effect(u'防護壁を召還中の時保護3増加'))



 
    def test_space(self):
        # 末尾にスペース
        self.assertEqual(u'dex,+,8,8,',
                         to_effect(u'Dex 8増加 '))

    # todo attack=

    # ----------------------------------------------------------------------
    # todo

    def test_personalized(self):
        self.assertFalse(to_effect(u'エンチャントアイテムが装備者専用になる'))

    def test_rank_regardless(self):
        self.assertFalse(to_effect(u'ランクに関係なくエンチャント可能'))

    def test_repair_cost(self):
        self.assertEqual(u'repair_cost,+,8,8,',
                         to_effect(u'修理費8%増加'))
    def test_cp(self):
        self.assertEqual(u'cp,+,1,1,',
                         to_effect(u'ほんの少し弱そう(-100)'))

        

if __name__ == '__main__':
    unittest.main()
