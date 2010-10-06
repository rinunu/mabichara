# -*- coding: utf-8 -*-

from google.appengine.ext import db
from google.appengine.ext.db import polymodel

class Element(polymodel.PolyModel):
    # 日本語名
    name = db.StringProperty(required = True)

    # 効果
    effects = db.StringListProperty()

    # 未実装なら False
    implemented = db.BooleanProperty(default = True)

    # wiki URL
    source = db.StringProperty()

    updated_at = db.DateTimeProperty(auto_now = True)

    @classmethod
    def create_or_update(cls, name, effects = [], source=None, implemented=True):
        '''存在しないなら作成 or 更新する'''

        ancestor = db.Key.from_path(cls.__name__, 'root')
        
        def tx():
            q = cls.all()
            q.ancestor(ancestor)
            q.filter('name =', name)
            a = q.get()

            if not a:
                a = cls(name=name, 
                        effects=effects, 
                        implemented=implemented,
                        source = source,
                        parent=ancestor)
            a.name = name
            a.effects = effects
            a.implemented = implemented
            a.source = source
            a.put()
            return a

        a = db.run_in_transaction(tx)
        return a
