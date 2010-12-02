with(AjaxSpecHelper){
    describe('ElementStore', function(){
        // Element の保存と読み込みを行う Store

        var store;
        var item;
        var request;
        beforeEach(function(){
            AjaxSpecHelper.initialize();
            store = new mabi.ElementStore({url: '/lists/weapons'});
        });

        describe('save にて1件追加する', function(){
            beforeEach(function(){
                item = new mabi.Element({
                    name: 'name0'
                });
                
                waitsForTask(store.save(item));
                request = mostRecentAjaxRequest();
                request.response({
                    status: 200,
                    responseText: ''
                });
            });

            it('サーバにデータが POST される', function(){
                runs(function(){
                    expect(mabi.ajax.ajax.argsForCall[0][0].data).toEqual({
                        type: 'Element',
                        name: 'name0'
                    });
                });
            });
        });

        // ----------------------------------------------------------------------
        // ヘルパー

    });
}