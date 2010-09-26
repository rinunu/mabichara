
mabi.EnchantView = function(){
    this.$element_ = $('.enchant_view');
    this.$element_.dialog(
	{
	    autoOpen: false,
	    buttons: {"OK": function() {}}
	});
};