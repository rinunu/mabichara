
mabi.EquipmentSet = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.EquipmentSet, mabi.Element);

/**
 * 
 */
mabi.EquipmentSet.prototype.setWeapon = function(){
    
};

mabi.Element.accessors(mabi.EquipmentSet, [
    'head', 'body', 'accessory0', 'accessory1',
    'hand', 'leftHand', 'rightHand', 'foot', 'robe', 'title']);
