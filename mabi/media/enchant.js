
mabi.Enchant = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.Enchant, mabi.Element);

// ----------------------------------------------------------------------
// private

mabi.Enchant.elements = [];

// ----------------------------------------------------------------------

mabi.ConcreteEnchant = function(enchant){
    mabi.Element.call(this, {name: enchant.name()});
    this.enchant_ = enchant;
};

util.extend(mabi.ConcreteEnchant, mabi.Element);

// ----------------------------------------------------------------------
// 開発用

mabi.Enchant.find = mabi.Element.find;
