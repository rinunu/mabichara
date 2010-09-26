
mabi.Equipment = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.Equipment, mabi.Element);

// ----------------------------------------------------------------------
// private

mabi.Equipment.elements = [];

// ----------------------------------------------------------------------

mabi.ConcreteEquipment = function(equipment, options){
    mabi.Element.call(this, options);
};

util.extend(mabi.ConcreteEquipment, mabi.Element);

// ----------------------------------------------------------------------
// 開発用

mabi.Equipment.find = mabi.Element.find;
