# -*- coding: utf-8 -*-

import re
import logging
import __builtin__

class Filter(object):
    def __init__(self, model_class, name, value):
        self.name = name
        self.value = value
        self.property = getattr(model_class, name)
        
    def db_filter(self, query):
        query.filter(self.name, self.value)

    def match(self, entity):
        return self.property.__get__(entity, type(entity)) == self.value
    
class PrefixFilter(object):
    
    '''前方一致を行うフィルター'''
    
    def __init__(self, model_class, name, value):
        self.name = name
        self.value = unicode(value)
        
    def db_filter(self, query):
        logging.info(self.name + self.value + u"\ufffd")
        query.filter(self.name + ' >= ', self.value)
        query.filter(self.name + ' < ', self.value + u"\ufffd")

    def match(self, entity):
        raise Exception, u'未実装'

class DatastoreHelper(object):
    '''
    フィルター処理や並べかえをプログラムで行うことの出来る datastore ラッパー
    '''
    
    def __init__(self, model_type):
        self.model_type = model_type
        self.filters = []
        self._order = None
        self._order_by_gae = True

    def add_filter(self, filter):
        self.filters.append(filter)

    def order(self, order):
        self._order = order

    def order_by_gae(self, by_gae):
        self._order_by_gae = by_gae

    def all(self):
        q = self.model_type.all()

        if len(self.filters) >= 1:
            f = self.filters.pop(0)
            f.db_filter(q)

        if self._order:
            if self._order_by_gae:
                q.order(self._order)
            else:
                q = self._sorted(q, self._order)

        # 手動フィルター
        if len(self.filters) >= 1:
            for e in q:
                ok = True
                for f in self.filters:
                    if not f.match(e):
                        ok = False
                        break
                if not ok:
                    continue
            
        return q

    def _sorted(self, query, order):
        '''プログラムでデータをソートする'''

        if not order: return

        m = re.match(r'(-?)([a-zA-Z_0-9]+)', order)
        desc = m.group(1) == '-'
        prop_name = m.group(2)

        prop = getattr(self.model_type, prop_name)

        if desc:
            return __builtin__.sorted(query, key=lambda x: prop.__get__(x, self.model_type), reverse=True)
        else:
            return __builtin__.sorted(query, key=lambda x: prop.__get__(x, self.model_type))
