mabi.Condition = function(options){
    var this_ = this;
    $.each(mabi.Condition.NAMES, function(i, name){
        this_[name + '_'] = options[name];
    });

    
    var equipmentSet = new mabi.EquipmentSet;
    equipmentSet.addChild(this.weapons_.clone());
    equipmentSet.addChild(this.protectors_.clone());
    
    this.character_ =  new mabi.Character;
    this.character_.setBody(this.body_);
    this.character_.setEquipmentSet(equipmentSet);
};

mabi.Condition.NAMES = ['weapons', 'protectors', 'body', 'expression', 'mob'];

/**
 * ダメージを計算する
 */
mabi.Condition.prototype.value = function(){
    var c = {
	character: this.character_,
	mob: this.mob_
    };
    return this.expression_.value(c);
};

// getter を生成する
(function(){
    $.each(mabi.Condition.NAMES, function(i, name){
	mabi.Condition.prototype[name] = function(){
	    return this[name + '_'];
	};
    });
})();
