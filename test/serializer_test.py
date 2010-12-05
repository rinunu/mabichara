# -*- coding: utf-8 -*-

import sys
import unittest
from nose.tools import *

from mabi import serializer
from mabi.element import Element
from mabi.equipment_set import EquipmentSet

class SerializerTest(unittest.TestCase):
    def setUp(self):
        pass

    def deserialize(self, src):
        return serializer.deserialize(src)

    def test_deserialize_element(self):
        src = '''
{
  "name": "test",
  "type": "Element",
  "effects": [
    {"op": "+", "param": "str", "min": 5}
  ]
}
'''
        model = self.deserialize(src)
        assert_equal('test', model.name)
        assert_equal(Element, type(model))

    def test_deserialize_equipment_set(self):
        src = '''
{
  "name":"test",
  "type":"EquipmentSet"
}
'''
        model = self.deserialize(src)
        assert_equal(EquipmentSet, type(model))
