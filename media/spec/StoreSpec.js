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
        var items;
        var request;
        beforeEach(function(){
            AjaxSpecHelper.initialize();
            items = [item('item0'), item('item1')];
            store = new mabi.Store({resourceName: 'resources'});
        });

        xdescribe('each にて、アイテムを走査できる', function(){
        });

        xdescribe('get にてアイテムを1件取得できる', function(){
        });
        
        xdescribe('length にてアイテムの件数を取得できる', function(){
        });

        describe('load にてサーバから一覧を読み込む', function(){
            beforeEach(function(){
                setResponse({entry: items});
                waitsForTask(store.load());
            });

            it('初回読み込みはサーバから読み込む', function(){
                runs(function(){
                    expect(requests.length).toEqual(1);
                    expect(requests[0].url).toMatch('resources.json$');
                    expect(store.find('item0')).toBe(items[0]);
                    expect(store.find('item1')).toBe(items[1]);
                });
            });

            it('2回目以降はキャッシュを使用する', function(){
                waitsForTask(store.load());
                runs(function(){
                    expect(requests.length).toEqual(1);
                });
            });

            xit('読み込まれるデータは詳細を含まない概要の一覧である', function(){
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
                    expect(requests[0].url).toMatch(/\/resources\/item0.json$/);
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

        describe('save にて1件追加する', function(){
            beforeEach(function(){
                waitsForTask(store.save(items[0]));
                request = mostRecentAjaxRequest();
                request.response({
                    status: 200,
                    responseText: ''
                });
            });

            it('サーバにデータが POST される', function(){
                runs(function(){
                    expect(ajaxRequests.length).toEqual(1);
                    expect(request.method).toEqual('POST');
                    expect(request.url).toMatch(/\/resources.json$/);
                    // expect(mabi.ajax.ajax.argsForCall[0][0].data).toEqual({
                    //     mobs: []
                    // });
                    console.log('request', request);
                });
            });

            it('id が正規のものに置き換わる', function(){
                
            });
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