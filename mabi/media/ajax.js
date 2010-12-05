/**
 * Ajax 処理を行う
 */
mabi.Ajax = function(){
};

/**
 * @param options {
 *   type: method,
 *   url,
 *   data,
 *   contentType: JSON で送信する場合は 'json'、それ以外の時は指定しない
 *   success: 成功時に実行する処理。 戻り値が Command のリスナに渡される
 * }
 */
mabi.Ajax.prototype.ajax = function(options){
    var this_ =  this;
    var url = options.url;
    if(options.contentType == 'json'){
        var data = {json: $.toJSON(options.data)};
    }else{
        var data = options.data;
    }
    var cmd = new util.AsyncCommand(function(){
	var ajaxOpt = {
            type: options.type,
	    url: url,
	    data: data,
	    success: function(json){
		var result = options.success(json);
		cmd.onSuccess(result);
	    },
	    error: function(){alert('データの読み込みに失敗しました');}
	};
	$.ajax(ajaxOpt);
    }, {
	id: options.id
    });

    cmd.execute();
    return cmd;
};

/**
 * サーバからデータを取得する
 * 
 * 同じ URL へのリクエストは同時に実行することは出来ない。
 * 同時に実行しようとした場合、すでに実行中の Command を返す
 * 
 * @param options {
 *   url,
 *   data,
 *   success: 成功時に実行する処理。 戻り値が Command のリスナに渡される
 * }
 */
mabi.Ajax.prototype.load = function(options){
    var this_ =  this;
    var url = 'http://4.latest.mabichara.appspot.com/' + options.url;
    var cmd = util.Command.find(url);
    if(cmd){
	return cmd;
    }
    cmd = new util.AsyncCommand(
	function(){
	    var ajaxOpt = {
		url: url,
		callbackParameter: 'callback',
		data: options.data,
		success: function(json){
		    var result = options.success(json);
		    cmd.onSuccess(result);
		},
		error: function(){alert('データの読み込みに失敗しました');}
	    };
	    $.jsonp(ajaxOpt);
	},
    {
	id: url
    });

    cmd.execute();
    return cmd;
};

