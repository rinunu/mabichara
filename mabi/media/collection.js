
/**
 * アイテムのコレクション
 *
 * 配列に対して以下の利点がる
 * - 変化をイベントで通知する
 *
 * 通知イベント
 * - change: 内容が変化した際に通知する
 */
mabi.Collection = function(){
    this.items_ = [];
};

mabi.Collection.prototype.each = function(fn){
    $.each(this.items_, fn);
};

mabi.Collection.prototype.push = function(item){
    this.items_.push(item);
    $(this).trigger('change');
};

/**
 * 指定されたアイテムを削除する
 * @param items アイテムの配列
 */
mabi.Collection.prototype.remove = function(items){
    this.items_ = $.grep(this.items_, function(v){
        return $.inArray(v, items) == -1;
    });
    $(this).trigger('change');
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

/**
 * deprecated 存在しない場合はエラーとする
 * 
 * アイテムは以下の条件を満たす必要がある
 * - id メソッドを持ち、ID を返す
 * - name メソッドを持ち、名前を返す
 */
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

    if(!result) throw '存在しません: ' + options.name + ' ' + options.id;
    return result;
};



