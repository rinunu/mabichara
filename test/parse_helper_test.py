#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

sys.path = ['./'] + sys.path

import unittest
from mabi.effect import Effect
from admin.parse_helper import to_param_id
from admin.parse_helper import parse_effect

class ParseHelperTest(unittest.TestCase):

    def test_to_param_id(self):
        '''to_param_id'''

        self.assertEqual('life_max', to_param_id(u'生命力'))
        self.assertEqual('life_max', to_param_id(u'最大生命力'))
 
    def test_parse_effect(self):
        '''to_param_id'''

        # 改造
        self.assertEqual(Effect(param='critical', op='+', min=6), 
                         parse_effect(u'クリティカル+6'))
        self.assertEqual(Effect(param='attack_min', op='-', min=1), 
                         parse_effect(u'最小攻撃力-1'))
 
if __name__ == '__main__':
    unittest.main()
