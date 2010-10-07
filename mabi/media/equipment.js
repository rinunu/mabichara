
mabi.EquipmentClass = function(options){
    mabi.Element.call(this, options);
    this.ug_ = options.ug;
};

util.extend(mabi.EquipmentClass, mabi.Element);

/**
 * 本装備を実体化した装備を作成する
 */
mabi.EquipmentClass.prototype.create = function(){
    var noEnchantedEquipment = new mabi.NoEnchantedEquipment();
    noEnchantedEquipment.addChild(this, 'equipment');

    var equipment = new mabi.Equipment();
    equipment.addChild(noEnchantedEquipment, 'equipment');
    return equipment;
};

// ----------------------------------------------------------------------
// NoEnchantedEquipment

mabi.NoEnchantedEquipment = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.NoEnchantedEquipment, mabi.Element);

mabi.NoEnchantedEquipment.prototype.name = function(){
    return this.child('equipment').name();
};

// ----------------------------------------------------------------------
// Equipment

mabi.Equipment = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.Equipment, mabi.Element);

/**
 * エンチャントを追加する
 */
mabi.Equipment.prototype.enchant = function(enchant){
    console.assert(enchant instanceof mabi.Enchant);
    this.addChild(enchant, enchant.type());
};

