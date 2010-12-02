
/**
 * Array のラッパー
 */
util.ArrayList = function(source){
    this.array_ = source;
};

util.ArrayList.prototype.each = function(fn){
    $.each(this.array_, fn);
};

util.ArrayList.prototype.get = function(i){
    return this.array_[i];
};

util.ArrayList.prototype.indexOf = function(item){
    return this.array_.indexOf(item);
};

util.ArrayList.prototype.length = function(){
    return this.array_.length;
};

// ----------------------------------------------------------------------

/**
 * 読み取り専用の List
 */
util.ReadOnlyList = function(list){
    this.list_ = list;
};

// 委譲メソッドを作成する
(function(){
    $.each(['each', 'length', 'get', 'indexOf'],
	   function(i, name){
	       util.ReadOnlyList.prototype[name] = function(){
		   return this.list_[name].apply(this.list_, arguments);
	       };
	   });
})();

