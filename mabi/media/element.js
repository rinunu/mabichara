
mabi.Element = function(options){
    options = options || {};
    this.name_ = options.name;

    // [{slot:, element:}, ...]
    this.children_ = [];
};

// ----------------------------------------------------------------------
// property

mabi.Element.prototype.name = function(name){
    return this.name_;
};

mabi.Element.prototype.setName = function(name){
    this.name_ = name;
};

/**
 * 子供を追加する
 * 
 * slot を指定した場合は、該当する slot を上書きする。 省略した場合は末尾に追加する。
 * 
 * @param slot 追加位置。 省略可能。
 */
mabi.Element.prototype.addChild = function(child, slot){
    // TODO 上書き処理
    this.children_.push({slot: slot, element: child});
};

/**
 * Effect を追加する
 */
mabi.Element.prototype.addEffect = function(effect){
};

/**
 * 指定した slot の子要素を取得する
 * 
 * 存在しない場合は null を返す。
 */
mabi.Element.prototype.child = function(slot){
    var i = this.indexOf(slot);
    if(i == -1){
	return null;
    }
    return this.children_[i].element;
};

// ----------------------------------------------------------------------
// private

/**
 */
mabi.Element.prototype.indexOf = function(slot){
    for(var i = 0; i < this.children_.length; i++){
	var child = this.children_[i];
	if(child.slot == slot){
	    return i;
	}
    }
    return -1;
};

// ----------------------------------------------------------------------
// 開発用

mabi.Element.find = function(name){
    for(var i = 0; i < this.elements.length; i++){
	var a = this.elements[i];
	if(a.name() == name){
	    return a;
	}
    }
    throw 'error';
};

