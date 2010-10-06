#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

sys.path = ['./'] + sys.path

import unittest
from mabi.effect import Effect
from admin.parse_helper import parse_effect

class EffectTest(unittest.TestCase):

    def test_whole(self):
        '''全体的なパース処理'''
        self.assertEqual(Effect(param='magic',op='+',min=5), 
                         parse_effect(u'魔法ダメージ+5%増加'))

 
if __name__ == '__main__':
    unittest.main()
