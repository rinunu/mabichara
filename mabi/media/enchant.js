
mabi.EnchantClass = function(options){
    console.assert(options.rank);
    console.assert($.inArray(['prefix', 'suffix'], options.type) != -1);
    mabi.Element.call(this, options);
    this.rank_ = options.rank;
    this.type_ = options.type;
};

util.extend(mabi.EnchantClass, mabi.Element);

/**
 * 本エンチャントを実体化した Element を作成する
 */
mabi.EnchantClass.prototype.create = function(){
    return new mabi.Enchant(this);
};

mabi.EnchantClass.prototype.type = function(){
    return this.type_;
};

// ----------------------------------------------------------------------
// Enchant

/**
 * 指定した enchant の Effect を自身へコピーする。
 * このコピーした Effect は変更しても enchant へは影響しない。
 * コピー時、数値は最大値を使用する。
 */
mabi.Enchant = function(base){
    mabi.Element.call(this, {name: base.name()});
    this.base_ = base;

    this.copyEffectsFrom(base);

    this.eachEffect(
	function(effect){
	    effect.min = effect.max;
	});
};

util.extend(mabi.Enchant, mabi.Element);

(function(){
     // いくつかの移譲メソッドを作成する
     $.each(['type'], function(i, name){
		mabi.Enchant.prototype[name] = function(){
		    return this.base_[name]();
		};
	    });
})();



