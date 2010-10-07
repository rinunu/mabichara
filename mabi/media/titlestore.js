/**
 * Title データの管理を行う
 */
mabi.TitleStore = function(){
    mabi.Store.call(this, {url: '/titles.json'});
};

util.extend(mabi.TitleStore, mabi.Store);

// ----------------------------------------------------------------------
// override

mabi.TitleStore.prototype.toEntity = function(json){
    var es = new mabi.Title(
	{
	    name: json.name,
	    effects: json.effects
	});
    return es;
};

