
mabi.Equipment = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.Equipment, mabi.Element);

// ----------------------------------------------------------------------
// private

mabi.Equipment.elements = [];

// ----------------------------------------------------------------------
// ConcreteEquipment

mabi.ConcreteEquipment = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.ConcreteEquipment, mabi.Element);

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
// 開発用

mabi.Equipment.find = mabi.Element.find;
