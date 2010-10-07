/**
 * Ajax 処理を行う
 */
mabi.Ajax = function(){
};

/**
 * サーバからデータを取得する
 * @param options {
 *   url,
 *   data,
 *   success: 成功時に実行する処理。 戻り値が Command のリスナに渡される
 * }
 */
mabi.Ajax.prototype.load = function(options){
    var this_ =  this;
    var cmd = new util.AsyncCommand(
	function(){
	    var ajaxOpt = {
		url: options.url,
		callbackParameter: 'callback',
		data: options.data,
		success: function(json){
		    var result = options.success(json);
		    cmd.onSuccess(result);
		},
		error: function(){alert('データの読み込みに失敗しました');}
	    };
	    $.jsonp(ajaxOpt);
	});
    cmd.execute();
    return cmd;
};

