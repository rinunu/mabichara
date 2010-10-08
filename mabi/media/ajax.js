/**
 * Ajax 処理を行う
 */
mabi.Ajax = function(){
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

