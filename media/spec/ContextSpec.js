describe('Context', function() {
    //  アプリの文脈を表す
    //  
    //  ビューの表示は Context を元に行う。
    //  Context を共有するビューは同じデータを表示することとなる。

    var context;
    beforeEach(function() {
        context = new mabi.Context;
    });

    it('update で change イベントが発生する', function(){
        var event = false;
        $(context).bind('change', function(){
            event = true;
        });
        context.update();
        expect(event).toBeTruthy();
    });
});
