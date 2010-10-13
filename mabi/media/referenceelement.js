
/**
 * 他の Element への参照を持つ Element
 * 
 * Element は親をひとつしか持てないため、複数の親の子供にする場合はこのオブジェクトを使用する
 * - id, parent 以外のプロパティは透過的に扱える。
 * - id, parent は base とは共有せず、独自の値を持つ。
 * - base の直接の子供の parent は本来の parent(つまり base) を返す
 * 
 * TODO イベントは未実装
 */
mabi.ReferenceElement = function(base){
    this.super_.constructor.call(this);
    this.base_ = base;
};

util.extend(mabi.ReferenceElement, mabi.Element);

mabi.ReferenceElement.prototype.base = function(enchant){
    return this.base_;
};

// 透過メソッドを作成する
(function(){
     $.each(['name', 'setName', 'child', 'eachChild', 
	     'addChild', 'removeChild', 'addEffect', 'eachEffect'], 
	    function(i, name){
		mabi.ReferenceElement.prototype[name] = function(){
		    return this.base_[name].apply(this.base_, arguments);
		};
	    });
})();

