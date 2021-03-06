# -*- coding: utf-8 -*-

class Effect:
    '''各種効果を表す
    '''

    def __init__(self, text=None, op='+', min=None, max=None, param=None, condition=''):
        if text:
            a = text.split(',')
            self.op = a[1]
            self.param = a[0]
            self.min = int(a[2])
            self.max= int(a[3])
            if len(a) >= 5: 
                self.condition = a[4]
            else:
                self.condition = ''
        else:
            if max == None: max = min

            self.op = op
            self.param = param
            self.min = int(min)
            self.max = int(max)
            self.condition = condition

    def __unicode__(self):
        ''''''
        return u'%s,%s,%s,%s,%s' % (
            self.param, self.op, self.min, self.max, self.condition)

    def __repr__(self):
        ''''''
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

