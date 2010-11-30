with(AjaxSpecHelper){
    describe('DamageDataStore', function(){
        // DamageData の管理を行う。
        //
        // 特記
        // DamageData を保存後、読み込んだ場合、完全に同じ形にはならない。
        // それとも、同じ形にすべき？ マスタデータの持ち方によってはいけるはず。
        
        // マスターが変わるのは困る。 他人のマスターを使用できるため。
        // なので 1. マスターを不変にするか、 2. DamageData 内にコピーを作ってしまうか。
        // サーバ的にはどっちもあんまり変わらないので、シンプルな 1 がいいかな。
        
        // 

        var store;
        var data;
        var request;
        beforeEach(function(){
            AjaxSpecHelper.initialize();
            store = new mabi.DamageDataStore;
            data = new mabi.DamageData;
        });

        // 作成中
        describe('サーバへ追加できる', function(){
            xit('表示設定');
            
            xit('', function(){
                // data
                waitsForTask(store.save(data));
                request = mostRecentAjaxRequest();
                request.response({
                    status: 200,
                    responseText: ''
                });

                runs(function(){
                    expect(mabi.ajax.ajax.argsForCall[0][0].data).toEqual({
                        bodies: [],
                        body: [],
                        weapons: [],
                        protectors: [],
                        titles: [],
                        
                        expression: [],

                        mobs: [],
                        // 組み合わせ
                    });
                    expect(request.method).toEqual('POST');
                    expect(request.url).toEqual('/damages.json');
                });
            });
        });
        
        describe('サーバから1件取得できる', function(){
            // store.loadDetail();
        });

        describe('サーバ送信時のデータ変換', function(){
            // data を設定
        });


        // ----------------------------------------------------------------------

    });
}