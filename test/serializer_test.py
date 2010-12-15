# -*- coding: utf-8 -*-

import sys
import unittest
from nose.tools import *

from mabi import serializer
from mabi.element import Element
from mabi.effect import Effect
from mabi.equipment_set import EquipmentSet

class SerializerTest(unittest.TestCase):
    def setUp(self):
        pass

    def deserialize(self, src):
        return serializer.deserialize(src)

    def test_deserialize_element(self):
        '''Element のデシリアライズ

        ID が指定された場合の挙動は未実装'''

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

    def test_serialize_element(self):
        '''Element のシリアライズ'''

        model = Element(name='name0', effects=[
                Effect(op='+', param='str', min=1),
                Effect(op='=', param='dex', min=3, max=5)
                ])
        model.save()
        actual = serializer.serialize(model)

        json = {
            'id': unicode(model.key()),
            'name': 'name0',
            'type': 'Element',
            'effects': [
                {'op': '+', 'param': 'str', 'min': 1, 'max': 1},
                {'op': '=', 'param': 'dex', 'min': 3, 'max': 5}
                ]
            }
        
        assert_equal(actual, json)

    def test_deserialize_children(self):
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

    def test_serialize_children(self):
        model = Element(name='parent')
        model.children.append(Element(name='child0', slot='slot0'))
        model.children.append(Element(name='child1', slot='slot1'))
        model.save()

        json = {
            "id": unicode(model.key()),
            "name":"parent",
            "type":"Element",
            "children": [
                {
                    "slot":"slot0",
                    "child": {
                        "id": unicode(model.children[0].key()),
                        "type":"Element", "name": "child0"
                        }
                    },
                {
                    "slot":"slot1",
                    "child": {
                        "id": unicode(model.children[1].key()),
                        "type":"Element", "name": "child1"
                        }
                    }
                ]
            }

        actual = serializer.serialize(model)
        assert_equal(json, actual)

    def test_deserialize_equipment_set(self):
        src = '''
{
  "name":"test",
  "type":"EquipmentSet"
}
'''
        model = self.deserialize(src)
        assert_equal(EquipmentSet, type(model))
