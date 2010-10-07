
mabi.EnchantClass = function(options){
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
mabi.Enchant = function(enchant){
    mabi.Element.call(this, {name: enchant.name()});
    this.enchant_ = enchant;

    this.copyEffectsFrom(enchant);

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
		    return this.enchant_[name]();
		};
	    });
})();



