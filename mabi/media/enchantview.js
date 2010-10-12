
mabi.EnchantView = function($element, type){
    this.$element_ = $element;
    this.type_ = type;
};

mabi.EnchantView.prototype.initialize = function(){
    mabi.enchants.load();
};

/**
 * todo prefix? suffix?
 */
mabi.EnchantView.prototype.edit = function(){
    mabi.enchants.load().success(
	util.bind(this, this.onListLoad));
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
