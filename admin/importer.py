# -*- coding: utf-8 -*-

import logging
from google.appengine.ext import db

from admin.source import Source

import enchant_importer
import title_importer
from weapon_list_parser import WeaponListParser
from weapon_parser import WeaponParser

from mabi.enchant_class import EnchantClass
from mabi.title import Title
from mabi.effect import Effect
from mabi.equipment_class import EquipmentClass
from mabi.upgrade_class import UpgradeClass

from mabi.element import Element

class Importer:
    def setup(self):
        '''初期 Source を追加する'''

        # db.delete(Source.all(keys_only=True))
    
        self.add_source(name=u'suffix(英字)',
                   type=u'enchant',
                   url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fsuffix%28%C0%DC%C8%F8%29%2F%B1%D1')
    
        self.add_source(name=u'suffix(数字)',
                   type=u'enchant',
                   url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fsuffix%28%C0%DC%C8%F8%29%2F%BF%F4')
        
        self.add_source(name=u'prefix(英字)',
                   type=u'enchant',
                   url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fprefix%28%C0%DC%C6%AC%29%2F%B1%D1')
        
        self.add_source(name=u'prefx(数字)',
                   type=u'enchant',
                   url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2Fprefix%28%C0%DC%C6%AC%29%2F%BF%F4')
        
        # self.add_source(name=u'未実装ES',
        #            type=u'enchant_unimplemented',
        #            url=u'%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8%2F%CC%A4%BC%C2%C1%F5ES')
        
        self.add_source(name=u'タイトル1～20', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F1%A1%C120')
        self.add_source(name=u'タイトル21～40', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F21%A1%C140')
        self.add_source(name=u'タイトル41～60', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F41%A1%C160')
        self.add_source(name=u'タイトル61～80', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F61%A1%C180')
        self.add_source(name=u'タイトル81～100', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F81%A1%C1100')
        self.add_source(name=u'タイトルその他', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F%A4%BD%A4%CE%C2%BE')
        self.add_source(name=u'タイトルシールブレイカー', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F%A5%B7%A1%BC%A5%EB%A5%D6%A5%EC%A5%A4%A5%AB%A1%BC')
        self.add_source(name=u'タイトルスキルマスター', type='title', url=u'%A5%BF%A5%A4%A5%C8%A5%EB%2F%A5%B9%A5%AD%A5%EB%A5%DE%A5%B9%A5%BF%A1%BC')
        
        self.add_source(name=u'刀剣類', type=u'weapon_list', url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%C5%E1%B7%F5%CE%E0')
        self.add_source(name=u'遠距離',  type=u'weapon_list', url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%B1%F3%B5%F7%CE%A5')
        self.add_source(name=u'鈍器類',  type=u'weapon_list', url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%C6%DF%B4%EF%CE%E0')
        self.add_source(name=u'ナックル',  type=u'weapon_list', url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%A5%CA%A5%C3%A5%AF%A5%EB')
        self.add_source(name=u'ワンド',  type=u'weapon_list', url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%A5%EF%A5%F3%A5%C9')
        self.add_source(name=u'錬金術(武器)',  type=u'weapon_list', url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%CF%A3%B6%E2%BD%D1')
        self.add_source(name=u'採集用',  type=u'weapon_list', url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%BA%CE%BD%B8%CD%D1')
        self.add_source(name=u'楽器',  type=u'weapon_list', url=u'%B2%BB%B3%DA%2F%B3%DA%B4%EF')

    def delete_source_caches(self):
        '''Source のキャッシュを削除する'''
        for s in Source.all():
            s.delete_cache()
        
    def add_source(self, name, type, url):
        source = Source.create_or_update(
            name=name,
            type=type,
            url='http://mabinogi.wikiwiki.jp/index.php?' + url)
        source.put()

    def _put_enchants(self, enchants):
        result = []
        for enchant in enchants:
            model = EnchantClass.create_or_update(**enchant)
            result.append(model)
        return result

    def _put_titles(self, items):
        result = []
        for item in items:
            model = Title.create_or_update(
                name=item['name'],
                effects = [unicode(e) for e in item['effects']]
                )
            result.append(model)
        return result

    def _put_equipment_list(self, items):
        '''装備リストを解析した情報を保存する
        また、その装備を更新するための Source を追加する'''
        result = []
        for item in items:
            url = item.get('url')
            if not url:
                continue
            model = EquipmentClass.create_or_update(
                name=item['name'],
                source=url
                )
            result.append(model)

            source = Source(name=item['name'], type='weapon', url=url)
            source.put()
        return result

    def _put_upgrade(self, item, equipment):
        '''解析した改造情報を保存する'''
        model = UpgradeClass.create_or_update(
            name = item['name'],
            effects = [unicode(e) for e in item['effects']],
            equipment = equipment,
            proficiency = item['proficiency'],
            ug_min = item['ug'][0],
            ug_max = item['ug'][1],
            cost = item['cost'])
        return model

    def _put_equipment(self, item):
        '''装備を解析した情報を保存する'''

        effects = []
        effects.append(Effect(param='range', min=item['range']))
        effects.append(Effect(param='attack_min', min=item['attack'][0]))
        effects.append(Effect(param='attack_max', min=item['attack'][1]))
        effects.append(Effect(param='durability', min=item['durability']))
        effects.append(Effect(param='wound_min', min=item['wound'][0]))
        effects.append(Effect(param='wound_max', min=item['wound'][1]))
        effects.append(Effect(param='critical', min=item['critical']))
        effects.append(Effect(param='balance', min=item['balance']))
        effects = [unicode(e) for e in effects]

        model = EquipmentClass.create_or_update(
            name = item['name'],
            effects = effects,
            category = item['category'],
            ug = item['ug'],
            )
            
        upgrades = [self._put_upgrade(u, model) for u in item['upgrades']]

        return model

    def import_data(self, source):
        '''取り込み元の内容を取り込む'''

        # Source.type に関する情報
        types = {
            'enchant': {
                'parser': enchant_importer.parse,
                'saver': self._put_enchants,
                },
            'title': {
                'parser': title_importer.parse,
                'saver': self._put_titles,
                },
            'weapon_list': {
                'parser': WeaponListParser().parse,
                'saver': self._put_equipment_list,
                },
            'weapon': {
                'parser': WeaponParser().parse,
                'saver': self._put_equipment,
                },
            }
    
        source.load()
        source.put()
    
        type_info = types[source.type]
    
        result = type_info['parser'](source.url, source.content)
        result = type_info['saver'](result)
        return result
    
    
