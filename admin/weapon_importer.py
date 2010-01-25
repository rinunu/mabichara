# -*- coding: utf-8 -*-

import re
import logging
from BeautifulSoup import BeautifulSoup
from mabi.weapon_class import WeaponClass
from mabi.weapon_upgrade import WeaponUpgrade
from mabi.weapon import Weapon

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
    weapon.critical = parse_helper.to_int(table(text=u'クリティカル')[0].next.string)
    weapon.balance = parse_helper.to_int(table(text=u'バランス')[0].next.string)
    weapon.attack_min, weapon.attack_max = parse_helper.to_min_max(table(text=u'攻撃')[0].next.string)
    weapon.durability = parse_helper.to_int(table(text=u'耐久')[0].next.string)

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

def parse(url, html):
    """HTML を解析し、 WeaponClass として返す

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

    weapon = WeaponClass.get_by_name(weapon_name)
    if not weapon: weapon = WeaponClass.create(weapon_name)

    set_weapon_info(weapon, main_table)
    upgrades = parse_upgrade(weapon, upgrade_table)
    upgrades += parse_upgrade(weapon, jewell_upgrade_table, 5)

    return (weapon, upgrades)

def _make_sequences(weapon_class, upgrades, times, upgrade_max, process):
    '''

    Arguments:
        times -- 今回の改造が何回目なのか(0-)
        process -- これまでの改造過程(upgrade のシーケンス)
    '''

    if upgrade_max != -1 and upgrade_max < times:
        return None
    
    if len(process) >= 1:
        weapon = Weapon.get_or_insert(weapon_class, process)
                
    for u in upgrades:
        if u.ug_min <= times <= u.ug_max:
            sub = _make_sequences(weapon_class, upgrades, times + 1, upgrade_max, process + [u])    

def update_sequences(weapon_class, process, upgrade_max):
    '''指定された武器のすべての改造の組み合わせを作成する

    Arguments:
        weapon -- 保存済みでなければならない
        process -- 今回組み合わせを作成する改造過程(WeaponUpgrade のシーケンス)
        upgrade_max -- 最大改造回数. -1 で無制限
        一度に大量の組み合わせを作成できず、複数回に分けるために使用する
    '''

    upgrades = weapon_class.upgrades

    _make_sequences(weapon_class, upgrades, len(process), upgrade_max, process)

    return 

def import_data(url, html):
    weapon_class, upgrades = parse(url, html)
    for a in upgrades:
        a.put()
    weapon_class.upgrades = upgrades
    weapon_class.put()
    
    return weapon_class, upgrades

