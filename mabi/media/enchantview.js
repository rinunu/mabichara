
mabi.EnchantView = function(){
    this.$element_ = $('.enchant_view');
    this.$element_.dialog(
	{
	    autoOpen: false,
	    buttons: {"OK": function() {}}
	});
};


mabi.EnchantView.prototype.edit = function(element){
    this.$element_.dialog('open');
};
