
mabi.DamageDataStore = function(){
    mabi.Store.call(this, {resourceName: 'damages'});
};

util.extend(mabi.DamageDataStore, mabi.Store);


/**
 * 
 */
mabi.DamageDataStore.prototype.save = function(item){
    var this_ =  this;
    var cmd = mabi.ajax.ajax({
        type: 'POST',
	url: '/' + this.resourceName_ + '.json',
        contentType: 'json',
	data: item,
	success: function(json){
            console.log('save!');
	}
    });
    return cmd;
};
