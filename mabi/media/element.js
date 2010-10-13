/**
 * event
 * - addChild
 * - addEffect
 * - update
 */
mabi.Element = function(options){
    options = options || {};


    this.id_ = options.id || mabi.Element.nextId_--;

    // [{slot:, element:}, ...]
    this.children_ = [];

    this.effects_ = [];

    this.name_ = options.name || '';

    this.parent_ = null;

    var effects = options.effects || [];
    for(var i = 0; i < effects.length; i++){
	this.addEffect(new mabi.Effect(effects[i]));
    }
};

// ----------------------------------------------------------------------
// 基本 property
// 本オブジェクトの挙動を変更する場合、これらの property を override すること。

mabi.Element.prototype.id = function(){
    return this.id_;
};

mabi.Element.prototype.name = function(){
    return this.name_;
};

mabi.Element.prototype.setName = function(name){
    this.name_ = name;
};

mabi.Element.prototype.parent = function(){
    return this.parent_;
};

/**
 * 複数の親を持つことは出来ない
 */
mabi.Element.prototype.setParent = function(parent){
    console.assert(!this.parent_);
    this.parent_ = parent;
};

/**
 * 指定した slot or index の子要素を取得する
 * 
 * 存在しない場合は null を返す。
 */
mabi.Element.prototype.child = function(slotOrIndex){
    var i;
    if(typeof slotOrIndex == 'number'){
	i = slotOrIndex;
    }else{
	i = this.indexOf(slotOrIndex);
    }
    if(i == -1){
	return null;
    }
    return this.children_[i].element;
};

/**
 * この Element のもつ子供を列挙する
 */
mabi.Element.prototype.eachChild = function(fn){
    $.each(this.children_, function(i, v){
	return fn(v.element, v.slot);
    });
};

/**
 * 子供を追加する
 * 
 * slot を指定した場合は、該当する slot を上書きする。 省略した場合は末尾に追加する。
 * 
 * @param slot 追加位置。 省略可能。
 */
mabi.Element.prototype.addChild = function(child, slot){
    if(slot){
	var old = this.child(slot);
	if(old){
	    this.removeChild(old);
	}
    }

    this.children_.push({slot: slot, element: child});
    child.setParent(this);
    util.Event.trigger(this, 'addChild', [{element: child, slot: slot}]);
};

/**
 * 子供を削除する
 */
mabi.Element.prototype.removeChild = function(child){
    var i = this.indexOf(child);
    console.assert(i != -1);
    var node = this.children_[i];
    this.children_.splice(i, 1);
    util.Event.trigger(this, 'removeChild', [{element: node.element, slot: node.slot}]);
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
	this.children_[i].element.eachEffect(fn);
    }

    for(i = 0; i < this.effects_.length; i++){
	fn(this.effects_[i]);
    }
};

// mabi.Element.prototype.children = function(){
//     return this.children_;
// };

// ----------------------------------------------------------------------

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
		if(effect.op() == '-'){
		    result -= effect.min();
		}else{
		    result += effect.min();
		}
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
 * ローカルで振る ID
 * ローカルでは負の ID を割り当てる。
 */
mabi.Element.nextId_ = -1;

/**
 * 指定した slot or child のインデックスを取得する
 */
mabi.Element.prototype.indexOf = function(slot_or_child){
    if(slot_or_child instanceof mabi.Element){
	var condChild = slot_or_child;
    }else{
	var condSlot = slot_or_child;
    }

    var result = -1;
    var i = 0;
    this.eachChild(function(child, slot){
		       if(slot == condSlot || child == condChild){
			   result = i;
			   return false;
		       }
		       i++;
		       return true;
		   });
    return result;
};

