mabi.Store = function(options){
    console.assert(options);
    this.elements_ = [];
    if(options.resourceName){
        this.url_ = '/' + options.resourceName;
    }else{
        this.url_ = options.url;
    }

    this.listLoaded_ = false;
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
    console.assert(this.listLoaded_);
    $.each(this.elements_, fn);
};

/**
 * ローカルに存在するなら取得する
 */
mabi.Store.prototype.has = function(options){
    if(options.name){
        var p = function(element){
            return element.name() == options.name;
        };
    }else{
        var id = options.id ? options.id() : options;
        var p = function(element){
            return element.id() == id;
        };
    }

    var result = null;
    $.each(this.elements_, function(i, element){
	if(p(element)){
	    result = element;
	    return false;
	}
	return true;
    });

    return result;
};

/**
 * ローカルに存在するものを取得する
 * 存在しない場合はエラーとなる
 */
mabi.Store.prototype.find = function(options){
    var result = this.has(options);
    if(!result) throw '存在しません' + options;
    return result;
};

mabi.Store.prototype.add = function(element){
    this.elements_.push(element);
};

/**
 * 一覧データを読み込む
 * 処理は非同期に行われる
 */
mabi.Store.prototype.load = function(){
    if(this.listLoaded_){
	return (new util.TimerCommand).execute();
    }

    var this_ =  this;
    var cmd = mabi.ajax.load(
	{
	    url: this.url_ + '.json',
	    data: {
		'max-results': 10000
	    },
	    success: function(json){
		for(var i = 0; i < json.entry.length; i++){
		    var dto = json.entry[i];
		    this_.create_or_update(dto);
		}
		this_.listLoaded_ = true;
	    }
	});
    return cmd;
};

mabi.Store.prototype.loadDetail = function(id){
    id = id.id ? id.id() : id;

    var e = this.has(id);
    if(e && (!e.loaded || e.loaded())){
	console.log('loadDetail キャッシュを使用します');
	return (new util.TimerCommand).execute();
    };

    var this_ = this;
    var cmd = mabi.ajax.load(
	{
	    url: this.url_ + '/' + id + '.json',
	    success: function(json){
		this_.create_or_update(json.entry[0]);
	    }
	});
    return cmd;
};

mabi.Store.prototype.save = function(item){
    var cmd = mabi.ajax.ajax({
        type: 'POST',
	url: this.url_ + '.json',
        contentType: 'json',
	data: this.serialize(item),
	success: function(json){
            console.log('save!');
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
    return dto;
};

/**
 * JSON で Element を更新する
 * 
 * 更新は起こりえない場合はオーバーライドする必要はない
 */
mabi.Store.prototype.updateElement = function(element, dto){
};

/**
 * item 保存時、サーバに送信する形に加工を行う
 */
mabi.Store.prototype.serialize = function(item){
    return item;
};

// ----------------------------------------------------------------------
// private

/**
 * 作成 or 更新したものを返す
 */
mabi.Store.prototype.create_or_update = function(dto){
    var e = this.has(dto.id);
    if(e){
	this.updateElement(e, dto);
    }else{
	e = this.createElement(dto);
	this.add(e);
    }
    return e;
};
    
