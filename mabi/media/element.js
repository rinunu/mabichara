
mabi.Element = function(options){
    options = options || {};

    // [{slot:, element:}, ...]
    this.children_ = [];

    this.effects_ = [];

    this.name_ = options.name;

    var effects = options.effects || [];
    for(var i = 0; i < effects.length; i++){
	this.addEffect(new mabi.Effect(effects[i]));
    }
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
    this.effects_.push(effect);
};

/**
 * この Element のもつ Effect を列挙する
 */
mabi.Element.prototype.eachEffect = function(fn){
    var i;
    for(i = 0; i < this.children_.length; i++){
	this.children_[i].eachEffect(fn);
    }

    for(i = 0; i < this.effects_.length; i++){
	fn(this.effects_[i]);
    }
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

/**
 * 指定したパラメータの値を取得する
 * 
 * 値は Character や EquipmentSet によって変化するため、それらも引数で指定する。
 */
mabi.Element.prototype.param = function(param, character, equipmentSet){
    var result = 0;
    this.eachEffect(
	function(effect){
	    if(effect.param() == param){
		result += effect.min();
	    }
	});
    return result;
};

// ----------------------------------------------------------------------

/**
 * source から Effect をコピーする
 */
mabi.Element.prototype.copyEffectsFrom = function(source){
    var this_ = this;
    source.eachEffect(
	function(effect){
	    this_.addEffect(effect);
	});
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

