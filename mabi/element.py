# -*- coding: utf-8 -*-

import logging

from google.appengine.ext import db
from google.appengine.ext.db import polymodel

from mabi.effect import Effect

logger = logging.getLogger("Element")

class Element(polymodel.PolyModel):
    # 日本語名
    name = db.StringProperty(required = True)

    # 効果
    effects_ = db.StringListProperty(name = 'effects')

    # 未実装なら False
    implemented = db.BooleanProperty(default = True)

    # wiki URL
    source = db.StringProperty()

    updated_at = db.DateTimeProperty(auto_now = True)

    def __init__(self, parent=None, key_name=None, effects=[], **kwdargs):
        effects = [unicode(e) for e in effects]
        polymodel.PolyModel.__init__(
            self,
            parent,
            key_name,
            effects=effects,
            **kwdargs
            )

    @property
    def effects(self):
        """"""
        return [Effect(s) for s in self.effects_]

    @classmethod
    def create_or_update_impl(cls, name, parent, effects, **kwdargs):
        '''create_or_update の実装
        サブクラスにて create_or_update の挙動をカスタマイズする際に使用する
        '''

        effects = [unicode(e) for e in effects]

        def tx():
            q = cls.all()
            q.ancestor(parent)
            q.filter('name =', name)
            a = q.get()

            if not a:
                a = cls(name=name, 
                        parent=parent)
            a.effects_ = effects
            for key, value in kwdargs.iteritems():
                setattr(a, key, value)

            a.put()
            return a

        a = db.run_in_transaction(tx)
        return a

    @classmethod
    def create_or_update(cls, name, **kwdargs):
        '''存在しないなら作成 or 更新する
        parent を指定しなかった場合、クラス毎のエンティティグループになるように parent が設定される
        '''

        return cls.create_or_update_impl(
            name = name,
            parent = db.Key.from_path(cls.__name__, 'root'),
            **kwdargs)

