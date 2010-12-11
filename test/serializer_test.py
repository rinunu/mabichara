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
    {"op": "+", "param": "str", "min": 1},
    {"op": "=", "param": "dex", "min": 3, "max": 5}
  ]
}
'''
        model = self.deserialize(src)
        assert_equal('test', model.name)
        assert_equal(Element, type(model))

        effects = model.effects
        assert_equal(2, len(effects))

    def test_children(self):
        src = '''
{
  "name":"parent",
  "type":"Element",
  "children": [
    {
      "slot":"slot0",
      "child": {"type":"Element", "name": "child0"}
    },
    {
      "slot":"slot1",
      "child": {"type":"Element", "name": "child1"}
    }
  ]
}
'''
        model = self.deserialize(src)
        assert_equal(Element, type(model))
        children = model.children
        assert_equal(2, len(children))

        child = children[0]
        assert_equal('slot0', child.slot)
        assert_equal('child0', child.name)

        child = children[1]
        assert_equal('slot1', child.slot)
        assert_equal('child1', child.name)

    def test_deserialize_equipment_set(self):
        src = '''
{
  "name":"test",
  "type":"EquipmentSet"
}
'''
        model = self.deserialize(src)
        assert_equal(EquipmentSet, type(model))
