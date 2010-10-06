# -*- coding: utf-8 -*-

import re
import logging
from BeautifulSoup import BeautifulSoup

import parse_helper
from exceptions import ParseException


race_re = re.compile(ur'\[(.*?)\]')

rank_re = re.compile(ur'[【](.*?)[】]')

class WeaponListParser:

    def parse_header(self, s):
        '''「【木工:6】[HE] コンポジットボウ」のような文字列をパースする
        '''

        m = race_re.search(s)
        if m:
            s = race_re.sub('', s)
        m = rank_re.search(s)
        if m:
            s = rank_re.sub('', s)
        name = s.strip()
        
        return name
    
    def parse_item(self, table):
        '''1アイテムパースする'''

        header_name = ['h2', 'h3', 'h4']

        #a = th.findNext('td').find('a')
        header = table.findPrevious(header_name)
        item = {}
        name = self.parse_header(parse_helper.get_string(header))
        item['name'] = name

        td = parse_helper.get_td(table, u'詳細ページ')
        if td:
            if not td.a:
                logging.warning(u'詳細ページがありません: ' + name)
            else:
                url = td.a['href']
                item['url'] = url

        return item

    def parse(self, url, html):
        '''装備一覧ページを解析し、武器情報を取得する
        '''

        result = []
        
        soup = BeautifulSoup(html)

        body = soup.find(id = u'body')
        
        for table in body.findAll('table'):
            item = self.parse_item(table)
            result.append(item)
        return result

def parse(url, html):
    return WeaponListParser().parse(url, html)