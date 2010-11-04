
/**
 * Condition のコレクション
 */
mabi.Conditions = function(){
    this.items_ = [];
};

mabi.Conditions.prototype.push = function(item){
    console.assert(item instanceof mabi.Condition);
    this.items_.push(item);
};

mabi.Conditions.prototype.each = function(fn){
    $.each(this.items_, fn);
};