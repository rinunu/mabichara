#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

sys.path = ['./'] + sys.path

import unittest
from admin.weapon_list_parser import parse
from mabi.effect import Effect

class WeaponListImporterTest(unittest.TestCase):

    def test_whole(self):
        '''全体的なパース処理'''

        f = open('test/rangeds.html')
        try:
            result = parse('url', f.read())
            size = 18 + 1 + 1 + 3 + 5 + 1 + 4 + 4 + 6 + 4
            self.assertEqual(size, len(result))

            item = result[0]
            self.assertEqual(u'ショートボウ', item['name'])
            self.assertEqual(u'http://mabinogi.wikiwiki.jp/index.php?%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%B1%F3%B5%F7%CE%A5%2F%A5%B7%A5%E7%A1%BC%A5%C8%A5%DC%A5%A6', 
                             item['url'])

            item = result[len(result) - 1]
            self.assertEqual(u'ロングジャベリン(50本)', item['name'])
            self.assertFalse(item.get('url'))
        finally:
            f.close()
 
if __name__ == '__main__':
    unittest.main()
