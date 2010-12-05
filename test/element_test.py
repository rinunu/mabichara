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
        ''''''
        element = Element(name='test', effects=[Effect(param='str', min=1)])

        effects = element.effects
        assert_equal(1, len(effects))
        assert_equal(Effect(param='str', min=1), effects[0])
