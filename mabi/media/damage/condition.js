
/**
 * ダメージを計算する条件
 * 
 * Character と EquipmentSet からなる。
 */
mabi.Condition = function(character){
    this.super_.constructor.call(this);

    this.character_ = character;
    this.addChild(character);
};

util.extend(mabi.Condition, mabi.Element);

