mabi.Title = function(base){
    mabi.InstanceElement.call(this, base);

    if(base){
        this.copyEffectsFrom(base);
    }
};

util.extend(mabi.Title, mabi.InstanceElement);

// ----------------------------------------------------------------------

mabi.TitleClass = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.TitleClass, mabi.Element);

mabi.TitleClass.prototype.create = function(){
    return new mabi.Title(this);
};
