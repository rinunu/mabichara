# -*- coding: utf-8 -*-

import re
import logging
from BeautifulSoup import BeautifulSoup
from mabi.weapon_class import WeaponClass
from mabi.weapon_upgrade import WeaponUpgrade
from mabi.weapon import Weapon

from source import Source
import parse_helper

property_name_map = {
    u'最小ダメージ' :  u'最小攻撃力',
    u'最大耐久度' :  u'最大耐久',
    
    }

def set_details(upgrade, td):
    upgrade.details_text = ''
    for span in td('span'):
        name, value = parse_helper.parse_effect(span.string)
        name = property_name_map.get(name, name)
        if name == u'バランス':
            upgrade.balance = value
        elif name == u'最大攻撃力':
            upgrade.attack_max = value
        elif name == u'最小攻撃力':
            upgrade.attack_min = value
        elif name == u'クリティカル':
            upgrade.critical = value
        elif name == u'最大耐久':
            upgrade.durability = value
        elif name == u'スプラッシュ打撃距離増加':
            pass
        elif name == u'スプラッシュ打撃ダメージ増加':
            pass
        else:
            raise Exception, u'不明な効果:' + name

def set_details(upgrade, td):
    upgrade.details_text = ''
    text = ' '.join(td.findAll(text=True))

    m = re.findall(ur'\S+\s*[+\-]\s*\d+', text)
    
    for s in m:
        name, value = parse_helper.parse_effect(s)
        name = property_name_map.get(name, name)
        if name == u'バランス':
            upgrade.balance = value
        elif name == u'最大攻撃力':
            upgrade.attack_max = value
        elif name == u'最小攻撃力':
            upgrade.attack_min = value
        elif name == u'クリティカル':
            upgrade.critical = value
        elif name == u'最大耐久':
            upgrade.durability = value
        elif name == u'スプラッシュ打撃距離増加':
            pass
        elif name == u'スプラッシュ打撃ダメージ増加':
            pass
        else:
            raise Exception, u'不明な効果:' + name

def set_weapon_info(weapon, table):
    weapon.attack_min, weapon.attack_max = parse_helper.to_min_max(parse_helper.get_td(table, u'攻撃'))
    weapon.critical = parse_helper.to_int(parse_helper.get_td(table, u'クリティカル'))
    weapon.balance = parse_helper.to_int(parse_helper.get_td(table, u'バランス'))
    weapon.durability = parse_helper.to_int(parse_helper.get_td(table, u'耐久'))
    weapon.ug = parse_helper.to_int(parse_helper.get_td(table, u'UG'))

def parse_upgrade(weapon, table, ug_base=0):
    result = []
    for tr in table.tbody('tr'):
        if len(tr) < 5: continue
        
        name = parse_helper.get_string(tr('td')[0])
        upgrade = WeaponUpgrade.get_or_create(weapon, name)
        
        upgrade.proficiency = parse_helper.to_int(tr('td')[1].string)
        upgrade.ug_min, upgrade.ug_max = parse_helper.to_min_max(tr('td')[3].string)
        upgrade.ug_min += ug_base
        upgrade.ug_max += ug_base

        upgrade.cost = parse_helper.to_cost(unicode(tr('td')[4].contents[0]))

        set_details(upgrade, tr('td')[2])
        
        result.append(upgrade)
    return result

def find_upgrade(upgrades, name):
    '''指定された名前の WeaponUpgrade を返す

    (1回余り)等、無効な名前の場合は None を返す

    不明な名前の場合は例外を投げる

    '''

    # 名前の正規化
    name = re.sub(ur'剣研(\d)', ur'剣研ぎ\1', name)
    name = re.sub(ur'刃磨き', ur'刀磨き', name)

    if re.match(ur'\([^)]*余り\)', name):
        return None
    
    for upgrade in upgrades:
        if upgrade.name == name:
            return upgrade

    raise Exception, u'改造が見つかりません: ' + name

def _make_sequences(name, sequence, weapon_class, upgrades):
    '''
    改造の組み合わせを作成し、保存する

    Arguments:
        name -- 改造の名称。
        sequence -- これまでの改造過程(upgrade のシーケンス)
    '''

    times = len(sequence) # 今回の改造回数
    
    for u in upgrades:
        if u.ug_min <= times <= u.ug_max:
            seq2 = sequence + [u]
            Weapon.create_or_update(weapon_class, seq2, name)
            
            _make_sequences(name, seq2, weapon_class, upgrades)

def parse_upgrade_sequences(soup, weapon_class, upgrades):
    '''おすすめ改造を解析し、 Weapon として登録する

    TODO Wiki のおすすめには宝石改造が入っていないため、宝石改造をしたバリエーションも追加する

    '''

    seq_name_re = re.compile(ur'(.*式.*)')

    seqs = soup.findAll(lambda tag: tag.name == u'h4' and tag.find(text = seq_name_re))

    for seq in seqs:
        name = parse_helper.get_string(seq)
        text = parse_helper.get_string(seq.findNext('p', 'quotation')) # ex: 軽量化＞軽量化＞軽量化＞軽量化＞(1回余り)
        list = text.split(u'＞')
        list = [find_upgrade(upgrades, i) for i in list]
        list = [i for i in list if i]

        Weapon.create_or_update(weapon_class, list, name)
        if weapon_class.ug == len(list):
            _make_sequences(name + u'(宝石)', list, weapon_class, upgrades)

def import_data(url, html):
    """HTML を解析し、保存する

    呼び出し元は WeaponClass 保存前に weapon_class.upgrades = upgrades とする必要がある

    Return:
        (WeaponClass, [WeaponUpgrade, ...])

        
    """
    
    soup = BeautifulSoup(html)
    
    topicpath = soup.find(id = u'topicpath')
    weapon_name = re.sub(ur'^ &gt; ', u'', topicpath.contents[-1]).strip()
    
    main_table = soup.find(id = 'body').findAll('table')[0]
    upgrade_table = soup.find(id = 'body').findAll('table')[1]
    jewell_upgrade_table = soup.find(id = 'body').findAll('table')[2]

    weapon_class = WeaponClass.get_by_name(weapon_name) or WeaponClass.create(weapon_name)

    set_weapon_info(weapon_class, main_table)
    upgrades = parse_upgrade(weapon_class, upgrade_table)
    upgrades += parse_upgrade(weapon_class, jewell_upgrade_table, 5)

    # 登録
    for a in upgrades:
        a.put()
    weapon_class.upgrades = upgrades
    weapon_class.put()

    parse_upgrade_sequences(soup, weapon_class, upgrades)

    return (weapon_class, upgrades)
