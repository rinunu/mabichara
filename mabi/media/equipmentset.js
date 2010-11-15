
mabi.EquipmentSet = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.EquipmentSet, mabi.Element);
mabi.Element.accessors(mabi.EquipmentSet, [
    'head', 'body', 'accessory0', 'accessory1',
    'hand', 'leftHand', 'rightHand', 'foot', 'robe', 'title']);

/**
 * 
 */
mabi.EquipmentSet.prototype.setWeapon = function(){
    
};

/**
 * 武器 のみを含む Element を取得する
 */
mabi.EquipmentSet.prototype.weapons = function(){
    var result = new mabi.Element();
    $.each([this.leftHand(), this.rightHand()], function(i, v){
        if(v && v.is('weapon')) result.addChild(v);
    });
    return result;
};

