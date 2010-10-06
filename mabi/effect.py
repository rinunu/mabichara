# -*- coding: utf-8 -*-

class Effect:
    '''各種効果を表す
    '''

    def __init__(self, op=None, min=None, max=None, param=None, condition=''):
        if max == None: max = min

        self.op = op
        self.min = int(min)
        self.max = int(max)
        self.param = param
        self.condition = condition

    def __unicode__(self):
        '''文字列形式に変換する'''
        return u'%s,%s,%s,%s,%s' % (
            self.param, self.op, self.min, self.max, self.condition)


    def __eq__(self, other):
        a = (isinstance(other, Effect) and
             self.op == other.op and
             self.min == other.min and
             self.max == other.max and
             self.param == other.param and
             self.condition == other.condition)
        return a
            
    def __ne__(self, other):
        return not self.__eq__(other)
