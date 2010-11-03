
/**
 * ダメージを計算する条件
 * 
 * 以下の情報からなる
 * 1. Character
 * 2. SimpleWeapon
 * 3. SimpleTitle
 */
mabi.Condition = function(options){
    this.super_.constructor.call(this);

    this.character_ = options.character;
    this.weapon_ = options.weapon;
    this.title_ = options.title;

    this.addChild(this.character_);

    if(this.weapon_){
	this.addChild(this.weapon_);
    }
    if(this.title_){
	this.addChild(this.title_);
    }
};

util.extend(mabi.Condition, mabi.Element);

mabi.Condition.prototype.weapon = function(){
    return this.weapon_;
};