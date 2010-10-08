/**
 * Equipment データの管理を行う
 */
mabi.EquipmentStore = function(){
    mabi.Store.call(this, {resourceName: 'equipments'});
};

util.extend(mabi.EquipmentStore, mabi.Store);

// ----------------------------------------------------------------------
// override

mabi.EquipmentStore.prototype.createElement = function(dto){
    var e = new mabi.EquipmentClass(
	{
	    id: dto.id,
	    name: dto.name,
	    effects: dto.effects,
	    ug: dto.ug
	});
    return e;
};

mabi.EquipmentStore.prototype.updateElement = function(e, dto){
    // 性能が変化することはない。 更新時は情報が増えるのみ。

    var upgrades = [];
    $.each(dto.upgrades, function(i, v){
	       upgrades.push(new mabi.UpgradeClass(v))
	   });

    e.set({upgrades: upgrades});
};
