/**
 * Ajax を使用したスペックを書く際に使用する
 *
 * 使用法
 * 1. with(AjaxSpecHelper) する
 * 2. beforeEach にて AjaxSpecHelper.initialize() する
 */

var AjaxSpecHelper = {
    requests: [],
    responses: []
};

/**
 * task の完了を待つ
 */
AjaxSpecHelper.waitsForTask = function(task){
    var complete = false;
    task.success(function(){complete = true;});
    
    waitsFor(function(){
        return complete;
    }, '処理が完了しませんでした');
};

/**
 * レスポンスを設定する
 */
AjaxSpecHelper.setResponse = function(response){
    this.responses[0] = response;
};

AjaxSpecHelper.initialize = function(){
    var this_ = this;
    this.responses = [];
    this.requests = [];
    spyOn(jQuery, 'jsonp').andCallFake(function(options){
        this_.requests.push(options);
        setTimeout(function(){
            options.success(this_.responses[0]);
        }, 10);
    });

    spyOn(mabi.ajax, 'ajax').andCallThrough();
};

