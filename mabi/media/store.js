/**
 * マスタデータの管理を行う
 * 
 * データは以下のメソッドを持っていること
 * - id:
 * 
 * データ取得は以下の URL にて行えること
 * - 全件取得: /resourceName.json
 * - 詳細取得: /resourceName/id.json
 */
mabi.Store = function(options){
    console.assert(options);
    this.elements_ = [];
    this.resourceName_ = options.resourceName;
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
 * 一覧データを読み込む
 * 処理は非同期に行われる
 */
mabi.Store.prototype.load = function(){
    var this_ =  this;
    var cmd = mabi.ajax.load(
	{
	    url: '/' + this.resourceName_ + '.json',
	    data: {
		'max-results': 10000
	    },
	    success: function(json){
		for(var i = 0; i < json.entry.length; i++){
		    var dto = json.entry[i];
		    this_.create_or_update(dto);
		}
	    }
	});
    return cmd;
};

/**
 * 1 要素の詳細を読み込む
 */
mabi.Store.prototype.loadDetail = function(id){
    var this_ = this;
    id = id.id ? id.id() : id;
    var cmd = mabi.ajax.load(
	{
	    url: this.resourceName_ + '/' + id + '.json',
	    success: function(json){
		this_.create_or_update(json.entry[0]);
	    }
	});
    return cmd;
};

// ----------------------------------------------------------------------
// protected

/**
 * JSON から Element を作成する
 */
mabi.Store.prototype.createElement = function(dto){
    console.assert(false);
    return json;
};

/**
 * JSON で Element を更新する
 * 
 * 更新は起こりえない場合はオーバーライドする必要はない
 */
mabi.Store.prototype.updateElement = function(element, dto){
};

// ----------------------------------------------------------------------
// private

/**
 * 作成 or 更新したものを返す
 */
mabi.Store.prototype.create_or_update = function(dto){
    var e = this.find(dto.id)
    if(e){
	this.updateElement(e, dto);
    }else{
	e = this.createElement(dto)
	this.add(e);
    }
    return e;
};
    
/**
 * ローカルに存在するなら取得する
 */
mabi.Store.prototype.find = function(id){
    var result = null;
    $.each(this.elements_, function(i, element){
	       if(element.id() == id){
		   result = element;
		   return false;
	       }
	       return true;
	   })
    return result;
};
