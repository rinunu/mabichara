
mabi.EnchantView = function($element, type){
    this.$element_ = $element;
    this.type_ = type;

    ('select', this.$element_).change(
	util.bind(this, this.onSelect));
};

mabi.EnchantView.prototype.initialize = function(){
    mabi.enchants.load();
};

/**
 */
mabi.EnchantView.prototype.edit = function(equipment){
    this.equipment_ = equipment;
    mabi.enchants.load().success(
	util.bind(this, this.onListLoad));
};

// ----------------------------------------------------------------------
// event

/**
 * Enchant の変更時
 */
mabi.EnchantView.prototype.onSelect = function(event){
    var id = $(event.target).val();
    var enchant = mabi.enchants.find(id).create();
    this.equipment_.enchant(enchant);
};

mabi.EnchantView.prototype.onListLoad = function(){
    var list = [];
    var this_ = this;
    mabi.enchants.each(
	function(i, item){
	    if(item.type() == this_.type_){
		list.push(item);
	    }
	});

    list.sort();

    var $list = $('select.enchant', this.$element_);
    $list.empty();
    $.each(list, function(i, item){
	       $('<option/>').text(item.name()).val(item.id()).
		   appendTo($list);
	   });
};
