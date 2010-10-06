#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

sys.path = ['./'] + sys.path

import unittest
from admin import title_importer
from mabi.effect import Effect

from BeautifulSoup import BeautifulSoup

class TitleImporterTest(unittest.TestCase):

    def node(self, text):
        return BeautifulSoup(text)

    def parse_one(self, text):
        return title_importer.get_item(self.node(text).h2)

    def test_whole(self):
        '''全体的なパース処理'''

        f = open('test/title.html')
        try:
            result = title_importer.parse('url', f.read())
            self.assertEqual(11, len(result))

            title = result[0]
            self.assertEqual(u'結晶収集家', title['name'])
            self.assertEqual(5, len(title['effects']))
            self.assertEqual(Effect(param='int',op='+',min=20,max=20), title['effects'][0])

            title = result[10]
            self.assertEqual(u'手がすべった', title['name'])
            self.assertEqual(3, len(title['effects']))

            pass
        finally:
            f.close()

    def test_one(self):
        '''1タイトルの解析'''

        src = '''<h2>【8】結晶収集家  <a></a> <a></a></h2>
<p>説明<br>
<span class="wikicolor" style="color:blue">Int 20増加</span><br>
<span class="wikicolor" style="color:red">Str 10減少</span><br></p>
<ul class="list1"><li>Hint<br>
錬金術結晶をたくさん集めてタルティーンの誰かに持っていけばいいことが起こるかもしれない。</li>
</ul>
<span class="wikicolor" style="color:red">Will 10減少</span>
'''

        title = self.parse_one(src)
        self.assertEqual(u'結晶収集家', title['name'])

        effects = title['effects']
        self.assertEqual(2, len(effects))
        self.assertEqual(Effect(param='int',op='+',min=20), effects[0])
        self.assertEqual(Effect(param='str',op='-',min=10), effects[1])

    def test_one_p(self):
        '''説明の<p>がとじている場合'''
   
        src = '''<h2>【20】手がすべった  <a></a> <a><img /></a></h2>
<p>この能力をどのように活用するかはあなた次第？</p>
<p><span class="wikicolor" style="color:blue">保護 5増加</span><br />
<span class="wikicolor" style="color:red">Luck 20減少</span></p>'''

        title = self.parse_one(src)
        self.assertEqual(u'手がすべった', title['name'])

        effects = title['effects']
        self.assertEqual(2, len(effects))
        self.assertEqual(Effect(param='protection',op='+',min=5), effects[0])
        self.assertEqual(Effect(param='luck',op='-',min=20), effects[1])

    def test_one_giant(self):
        '''変な注釈がある場合'''

        src = '''<h2>【88】炎の矢  <a></a> <a><img></a></h2>
<p>炎の矢は弓使いのロマン！<br>
炎の矢の達人に与えられる名誉あるタイトル。<br>
<span class="wikicolor" style="color:Red">＊ジャイアント種族は弓が装備できないため、取得不可。</span></p>
<p><span class="wikicolor" style="color:Red">Str 5減少</span><br>
<span class="wikicolor" style="color:Blue">最大スタミナ 5増加</span></p>'''

        title = self.parse_one(src)
        self.assertEqual(u'炎の矢', title['name'])

        effects = title['effects']
        self.assertEqual(2, len(effects))
        self.assertEqual(Effect(param='str',op='-',min=5), effects[0])
        self.assertEqual(Effect(param='stamina_max',op='+',min=5), effects[1])
 
    def test_one_special(self):
        '''特殊な効果'''

        src = '''<h2>【???】王政錬金術師  <a></a> <a><img></a></h2>
<p>自他共に公認するエリン最高のエリート錬金術師集団を象徴する証。</p>
<p><span class="wikicolor" style="color:Blue">結晶制作成功率1%増加</span><br>
<span class="wikicolor" style="color:Blue">合成成功率1%増加</span><br>
<span class="wikicolor" style="color:Blue">分解成功率1%増加</span><br>
<span class="wikicolor" style="color:Blue">水属性の錬金ダメージ15増加</span><br>
<span class="wikicolor" style="color:Blue">火属性の錬金ダメージ5増加</span></p>'''

        title = self.parse_one(src)
        self.assertEqual(u'王政錬金術師', title['name'])

        effects = title['effects']
        self.assertEqual(5, len(effects))
        self.assertEqual(Effect(param='crystal_making',op='+',min=1), effects[0])
        self.assertEqual(Effect(param='synthesis',op='+',min=1), effects[1])
        self.assertEqual(Effect(param='dissolution',op='+',min=1), effects[2])
        self.assertEqual(Effect(param='alchemy_water',op='+',min=15), effects[3])
        self.assertEqual(Effect(param='alchemy_fire',op='+',min=5), effects[4])
 
if __name__ == '__main__':
    unittest.main()
