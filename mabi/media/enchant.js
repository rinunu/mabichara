
mabi.Enchant = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.Enchant, mabi.Element);

// ----------------------------------------------------------------------
// static



// ----------------------------------------------------------------------
// ConcreteEnchant

/**
 * 指定した enchant の Effect を自身へコピーする。
 * このコピーした Effect は変更しても enchant へは影響しない。
 * コピー時、数値は最大値を使用する。
 */
mabi.ConcreteEnchant = function(enchant){
    mabi.Element.call(this, {name: enchant.name()});
    this.enchant_ = enchant;

    this.copyEffectsFrom(enchant);

    this.eachEffect(
	function(effect){
	    effect.min = effect.max;
	});
};

util.extend(mabi.ConcreteEnchant, mabi.Element);

