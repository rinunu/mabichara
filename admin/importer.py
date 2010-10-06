# -*- coding: utf-8 -*-

from google.appengine.ext import db

from admin.source import Source

from mabi.enchant import Enchant
from mabi.title import Title
from mabi.weapon_class import WeaponClass
from mabi.weapon_upgrade import WeaponUpgrade
from mabi.weapon import Weapon

import enchant_importer
import title_importer
import weapon_importer

class Importer:
    def setup(self):
        '''初期設定/HTMLキャッシュのクリアを行う'''

        db.delete(Source.all())
    
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
        
        self.add_source(name=u'刀剣類',
                   type=u'equipments',
                   url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%C5%E1%B7%F5%CE%E0')
        self.add_source(name=u'遠距離',
                   type=u'equipments',
                   url=u'%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%B1%F3%B5%F7%CE%A5')
        
    def add_source(self, name, type, url):
        source = Source(name=name,
                        type=type,
                        url='http://mabinogi.wikiwiki.jp/index.php?' + url)
        source.put()

    def _put_enchants(self, enchants):
        result = []
        for enchant in enchants:
            model = Enchant.create_or_update(**enchant)
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
                }
            }
    
        source.load()
        source.put()
    
        type_info = types[source.type]
    
        result = type_info['parser'](source.url, source.content)
        result = type_info['saver'](result)
        return result
    
    
        # if source.type == u'enchant_unimplemented':
        #     result = enchant_importer.parse_unimplemented(source.url, source.content)
        #     context = {
        #         'result': result
        #         }
        #     for a in result: a.put()
        #     return direct_to_template(request, 'import_result.html', context)
        # elif source.type == u'weapon':
        #     weapon_class, upgrades = weapon_importer.import_data(source.url, source.content)
        #     context = {
        #         'weapon_class': weapon_class,
        #         'upgrades': upgrades,
        #         'weapons': Weapon.all().filter('weapon_class = ', weapon_class), # todo 条件足りない
        #         }
        #     return direct_to_template(request, 'import_result_weapons.html', context)
        # else:
        #     return map[source.type](source)
