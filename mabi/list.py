# -*- coding: utf-8 -*-

import logging

from google.appengine.ext import db

class List(db.Model):
    '''Element のリスト
    '''
    # 日本語名
    name = db.StringProperty(required = True)

    items = db.ListProperty(db.Key)

    updated_at = db.DateTimeProperty(auto_now = True)

    @classmethod
    def create_or_update(cls, name):
        '''存在しないなら作成 or 更新する
        '''

        parent = db.Key.from_path(cls.__name__, 'root')

        def tx():
            q = cls.all()
            q.ancestor(parent)
            q.filter('name =', name)
            a = q.get()

            if not a:
                a = cls(name=name, 
                        parent=parent)
            a.name = name

            a.put()
            return a

        a = db.run_in_transaction(tx)
        return a

