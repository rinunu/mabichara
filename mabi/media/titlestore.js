/**
 * Title データの管理を行う
 */
mabi.TitleStore = function(){
    mabi.Store.call(this, {resourceName: 'titles'});
};

util.extend(mabi.TitleStore, mabi.Store);

// ----------------------------------------------------------------------
// override

mabi.TitleStore.prototype.createElement = function(dto){
    var e = new mabi.Title(
	{
	    id: dto.id,
	    name: dto.name,
	    effects: dto.effects
	});
    return e;
};

