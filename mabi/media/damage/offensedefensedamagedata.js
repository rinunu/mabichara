mabi.OffenseDefenseDamageData = function(){
    this.offenses_ = [];
    this.defenses_ = [];
};

/**
 * 
 */
mabi.OffenseDefenseDamageData.prototype.offenses = function(){
   return this.offenses_; 
};

/**
 * 
 */
mabi.OffenseDefenseDamageData.prototype.setOffenses = function(value){
   this.offenses_ = value;
};

/**
 * 
 */
mabi.OffenseDefenseDamageData.prototype.defenses = function(){
   return this.defenses_; 
};

/**
 * 
 */
mabi.OffenseDefenseDamageData.prototype.setDefenses = function(value){
   this.defenses_ = value;
};

// ----------------------------------------------------------------------
// override

mabi.OffenseDefenseDamageData.prototype.records = function(){
    var result = [];
    dam.combination([
	['offense', this.offenses_],
        ['defense', this.defenses_]
    ], function(map){
        var offense = map['offense'];
        var defense = map['defense'];
	result.push(new mabi.Condition({
	    body: offense.body,
            weapons: offense.weapons,
            protectors: offense.protectors,
	    expression: offense.expression,
            mob: defense.mob
	}));
    });
    return result;
};

