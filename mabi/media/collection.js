
/**
 * アイテムのコレクション
 *
 * 配列に対して以下の利点がる
 * - 変化をイベントで通知する
 * 
 * アイテムは以下の条件を満たす必要がある
 * - name メソッドを持ち、名前を返す
 */
mabi.Collection = function(){
    this.items_ = [];
};

mabi.Collection.prototype.each = function(fn){
    $.each(this.items_, fn);
};

mabi.Collection.prototype.push = function(item){
    this.items_.push(item);
};

// ----------------------------------------------------------------------
// 

/**
 * deprecated 指定した名前のアイテムを取得する
 * 存在しなければエラー
 */
mabi.Collection.prototype.get = function(name){
    var result;
    $.each(this.items_, function(i, v){
	       if(v.name() == name){
		   result = v;
		   return false;
	       }
	       return true;
	   });
    if(!result){
	throw 'エラー: Collection.get: ' + name;
    }
    return result;
};

mabi.Collection.prototype.find = function(options){
    if(options.name){
        var p = function(item){
            return item.name() == options.name;
        };
    }else{
        var id = options.id ? options.id() : options;
        var p = function(item){
            return item.id() == id;
        };
    }

    var result = null;
    $.each(this.items_, function(i, item){
	if(p(item)){
	    result = item;
	    return false;
	}
	return true;
    });

    return result;
};



