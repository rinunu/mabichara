/**
 * Equipment データの管理を行う
 */
mabi.EquipmentStore = function(){
    mabi.Store.call(this, {url: '/equipments.json'});
};

util.extend(mabi.EquipmentStore, mabi.Store);

// ----------------------------------------------------------------------
// override

mabi.EquipmentStore.prototype.toEntity = function(json){
    var es = new mabi.EquipmentClass(
	{
	    name: json.name,
	    effects: json.effects,
	    ug: json.ug
	});
    return es;
};
