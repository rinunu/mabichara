/**
 * Enchant データの管理を行う
 */
mabi.EnchantStore = function(){
    mabi.Store.call(this, {url: '/enchants.json'});
};

util.extend(mabi.EnchantStore, mabi.Store);

// ----------------------------------------------------------------------
// override

mabi.EnchantStore.prototype.toEntity = function(json){
    var es = new mabi.EnchantClass(
	{
	    name: json.names[0],
	    effects: json.effects,
	    rank: json.rank,
	    type: json.root == 'p' ? 'prefix' : 'suffix'
	});
    return es;
};

