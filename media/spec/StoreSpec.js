with(AjaxSpecHelper){
    describe('Store', function(){
        // サーバに存在するデータの管理を行う
        // 
        // アイテムは以下のメソッドを持っていること
        // - id: アイテムを識別する
        // - loaded: オプション
        // 
        // データ取得は以下の URL にて行えること
        // - 全件取得: /resourceName.json
        // - 詳細取得: /resourceName/id.json

        var store;
        beforeEach(function(){
            AjaxSpecHelper.initialize();
            store = new mabi.Store({resourceName: 'resources'});
        });

        describe('サーバから一覧を読み込む', function(){
            it('初回読み込みはサーバから読み込む', function(){
            });

            it('2回目以降はキャッシュを使用する', function(){
                
            });
        });

        describe('1件取得する', function(){
            var item0;
            beforeEach(function(){
                item0 = item('item0');
            });

            it('ローカルに存在しない場合、サーバから取得する', function(){
                setResponse({entry: [item0]});
                
                waitsForTask(store.loadDetail('item0'));

                runs(function(){
                    expect(requests[0].url).toMatch('/resources/item0.json$');
                    expect(requests.length).toEqual(1);
                    expect(store.find('item0')).toBe(item0);
                });
            });

            it('ローカルに存在する場合、キャッシュを使用する', function(){
                store.add(item0);
                
                waitsForTask(store.loadDetail('item0'));

                runs(function(){
                    expect(ajaxRequests.length).toEqual(0);
                    expect(store.find('item0')).toBe(item0);
                });
            });

            xit('ローカルに存在するが詳細を読み込んでいない場合、サーバから取得する', function(){
            });

            xit('取得した DTO は適切なオブジェクトに加工される');
        });

        describe('ローカルにある前提で取得する(利用側の簡易化のため)', function(){
            
        });

        // ----------------------------------------------------------------------
        // ヘルパー

        function item(id){
            return {
                id: function(){return id;}
            };
        }
        
    });
}