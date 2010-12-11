# -*- coding: utf-8 -*-

import sys
import unittest
from nose.tools import *

from mabi.element import Element
from mabi.effect import Effect

class ElementTest(unittest.TestCase):
    def setUp(self):
        pass

    def test_effect(self):
        '''effect の追加'''
        element = Element(name='test', effects=[Effect(param='str', min=1)])

        effects = element.effects
        assert_equal(1, len(effects))
        assert_equal(Effect(param='str', min=1), effects[0])

    def test_save(self):
        element = Element(name='parent')
        element.save()
        assert_true(element.is_saved())

    def test_save_children(self):
        '''children の保存(parent 未保存時)'''

        element = Element(name='parent')

        children = [Element(name='child0'),
                    Element(name='child1')]
        element.children.append(children[0])
        element.children.append(children[1])
        element.save()
        element = Element.get(element.key())

        assert_equal(2, len(element.children))
        assert_equal('child0', element.children[0].name)
        assert_equal('child1', element.children[1].name)