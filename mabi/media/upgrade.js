

mabi.UpgradeClass = function(options){
    mabi.Element.call(this, options);
    this.ug_ = options.ug;
    this.cost_ = options.cost;
    this.proficiency_ = options.proficiency;
};

util.extend(mabi.UpgradeClass, mabi.Element);

/**
 * 本改造を実体化した改造を作成する
 */
mabi.UpgradeClass.prototype.create = function(){
    return new mabi.Upgrade(this);
};

mabi.UpgradeClass.prototype.ug = function(){
    return this.ug_;
};

mabi.UpgradeClass.prototype.cost = function(){
    return this.cost_;
};

mabi.UpgradeClass.prototype.proficiency = function(){
    return this.proficiency_;
};

// ----------------------------------------------------------------------
// Upgrade

mabi.Upgrade = function(base){
    mabi.InstanceElement.call(this, base);

    if(base){
        this.copyEffectsFrom(base);
    }
};

util.extend(mabi.Upgrade, mabi.InstanceElement);

(function(){
     // いくつかの移譲メソッドを作成する
     $.each(['ug', 'proficiency', 'cost'], function(i, name){
		mabi.Upgrade.prototype[name] = function(){
		    return this.base()[name]();
		};
	    });
})();

