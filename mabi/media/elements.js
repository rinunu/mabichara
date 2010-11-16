
/**
 * アイテムのコレクション
 * 
 * アイテムは以下の条件を満たす必要がある
 * - name メソッドを持ち、名前を返す
 */
mabi.Elements = function(){
    this.items_ = [];
};

mabi.Elements.prototype.each = function(fn){
    $.each(this.items_, fn);
};

mabi.Elements.prototype.push = function(item){
    this.items_.push(item);
};

/**
 * 指定した名前の Element を取得する
 * 存在しなければエラー
 */
mabi.Elements.prototype.get = function(name){
    var result;
    $.each(this.items_, function(i, v){
	       if(v.name() == name){
		   result = v;
		   return false;
	       }
	       return true;
	   });
    if(!result){
	throw 'エラー: Elements.get: ' + name;
    }
    return result;
};

mabi.Elements.prototype.find = function(options){
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
    $.each(this.items_, function(i, element){
	if(p(element)){
	    result = element;
	    return false;
	}
	return true;
    });

    return result;
};



