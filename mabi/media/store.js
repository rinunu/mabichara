/**
 * マスタデータの管理を行う
 */
mabi.Store = function(options){
    console.assert(options);
    this.elements_ = [];
    this.url_ = options.url;
};

/**
 * 初期化を行う
 */
mabi.Store.prototype.initialize = function(){
};

/**
 * 一覧を取得する
 */
mabi.Store.prototype.each = function(fn){
    $.each(this.elements_, fn);
};

/**
 * 
 */
mabi.Store.prototype.add = function(element){
    this.elements_.push(element);
};

/**
 * データを読み込む
 * 処理は非同期に行われる
 */
mabi.Store.prototype.load = function(){
    var this_ =  this;
    var cmd = mabi.ajax.load(
	{
	    url: this.url_,
	    data: {
		'max-results': 10000
	    },
	    success: function(json){
		for(var i = 0; i < json.entry.length; i++){
		    var o = this_.toEntity(json.entry[i]);
		    this_.add(o);
		}
	    }
	});
    return cmd;
};

// ----------------------------------------------------------------------
// protected

/**
 * JSON から本来のオブジェクトへ変換する
 */
mabi.Store.prototype.toEntity = function(json){
    return json;
};

