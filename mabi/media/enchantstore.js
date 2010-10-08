/**
 * Enchant データの管理を行う
 */
mabi.EnchantStore = function(){
    mabi.Store.call(this, {resourceName: 'enchants'});
};

util.extend(mabi.EnchantStore, mabi.Store);

// ----------------------------------------------------------------------
// override

mabi.EnchantStore.prototype.createElement = function(dto){
    var e = new mabi.EnchantClass(
	{
	    id: dto.id,
	    name: dto.names[0],
	    effects: dto.effects,
	    rank: dto.rank,
	    type: dto.root == 'p' ? 'prefix' : 'suffix'
	});
    return e;
};

