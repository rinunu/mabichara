/**
 * ダメージ計算のスペックを書く際に使用する
 * with(new mabi.DamageSpecHelper) して使う
 */

mabi.DamageSpecHelper = function(){
    this.character_ = null;
    this.body_ = null;
    this.expression_ = null;
    this.equipmentSet_ = null;
    this.mob_ = null;
};

util.extend(mabi.DamageSpecHelper, mabi.Builder);

// ダメージを計算する
mabi.DamageSpecHelper.prototype.damage = function(){
    var context = {
	character: this.character_,
        mob: this.mob_
    };
    return Math.floor(this.expression_.value(context));
};


