
/**
 * 他の Element への参照を持つ Element
 * 
 * Element は親をひとつしか持てないため、複数の親の子供にする場合はこのオブジェクトを使用する
 * - id, parent, slot 以外のプロパティは透過的に扱える。
 * - id, parent, slot は base とは共有せず、独自の値を持つ。
 * - base の直接の子供の parent は本来の parent(つまり base) を返す
 * 
 * TODO イベントは未実装
 */
mabi.ReferenceElement = function(base){
    mabi.Element.call(this);
    this.base_ = base;

    this.addSharedProperties(['base_']);
};

util.extend(mabi.ReferenceElement, mabi.Element);

mabi.ReferenceElement.prototype.base = function(enchant){
    return this.base_;
};

// 透過メソッドを作成する
(function(){
     $.each(['name', 'setName', 'child', 'childrenLength', 'eachChild', 
	     'addChild', 'removeChild', 'addEffect', 'eachEffect'], 
	    function(i, name){
		mabi.ReferenceElement.prototype[name] = function(){
		    return this.base_[name].apply(this.base_, arguments);
		};
	    });
})();

