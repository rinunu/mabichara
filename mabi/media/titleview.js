
mabi.TitleView = function(){
    this.$element_ = $('.title_view');
    this.$element_.dialog(
	{
	    autoOpen: false,
	    buttons: {"OK": function() {}}
	});
};


mabi.TitleView.prototype.edit = function(element){
    this.$element_.dialog('open');
};
