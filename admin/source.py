# -*- coding: utf-8 -*-

import urllib2
from datetime import datetime

from google.appengine.ext import db
from BeautifulSoup import BeautifulSoup

class Source(db.Model):
    
    """データの取り込み元を表す
    """

    name = db.StringProperty()
    type = db.StringProperty()
    
    url = db.StringProperty(required=True)
    content = db.TextProperty()

    date = db.DateTimeProperty()
    size = db.IntegerProperty()

    

    def load(self):
        '''ページデータを取得する

        すでに取得している場合はキャッシュを使用する
        '''
        
        if not self.content:
            try:
                result = urllib2.urlopen(self.url)
                content = result.read()
                # todo 現在は決めうち. BeautifulSoup で変換できない文字を処理する方法がわからないため
                content = unicode(content, "euc-jp", "replace")
                soup = BeautifulSoup(content)
                # enc = soup.originalEncoding
                self.content = db.Text(content)
                self.size = len(self.content)
                self.date = datetime.now()
            except urllib2.URLError, e:
                raise
