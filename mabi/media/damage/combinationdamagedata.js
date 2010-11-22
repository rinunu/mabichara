
/**
 * character * mob * equipmentSet * expression の組み合わせからなる DamageData
 */
mabi.CombinationDamageData = function(){
    // {フィールドID: [フィールド値, ...]}
    this.data_ = {};
    var this_ = this;
    $.each(dam.fields, function(k, v){
	this_.data_[v.id] = [];
    });
};

util.extend(mabi.CombinationDamageData, mabi.DamageData);

/**
 * 
 */
mabi.CombinationDamageData.prototype.addExpression = function(data){
    this.addData(dam.fields.EXPRESSION, data);
};

/**
 * 
 */
mabi.CombinationDamageData.prototype.addBody = function(data){
    this.addData(dam.fields.BODY, data);
};

/**
 * 
 */
mabi.CombinationDamageData.prototype.addWeapons = function(data){
    this.addData(dam.fields.WEAPONS, data);
};

/**
 * 
 */
mabi.CombinationDamageData.prototype.addProtectors = function(data){
    this.addData(dam.fields.PROTECTORS, data);
};

/**
 * 
 */
mabi.CombinationDamageData.prototype.addMob = function(data){
    this.addData(dam.fields.MOB, data);
};

// ----------------------------------------------------------------------
// protected

mabi.CombinationDamageData.prototype.records = function(){
    var result = [];
    dam.combination([
	['body', this.data_[dam.fields.BODY.id]],
        ['weapons', this.data_[dam.fields.WEAPONS.id]],
	['protectors', this.data_[dam.fields.PROTECTORS.id]],
	['mob', this.data_[dam.fields.MOB.id]],
	['expression', this.data_[dam.fields.EXPRESSION.id]]], function(map){
	    result.push(new mabi.Condition({
		body: map['body'],
                weapons: map['weapons'],
                protectors: map['protectors'],
		mob: map['mob'],
		expression: map['expression']
	    }));
	});
    return result;
};

// ----------------------------------------------------------------------
// private

/**
 * 
 */
mabi.CombinationDamageData.prototype.addData = function(field, data){
    this.data_[field.id].push(data);
};

