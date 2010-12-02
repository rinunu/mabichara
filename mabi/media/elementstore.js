mabi.ElementStore = function(options){
    mabi.Store.call(this, options);
};

util.extend(mabi.ElementStore, mabi.Store);

// ----------------------------------------------------------------------
// override

mabi.ElementStore.prototype.serialize = function(item){
    return new mabi.Serializer().serialize(item);
};
