
mabi.OptionsView = function(){
    this.$element_ = $('.options_view');
    this.$element_.dialog(
	{
	    autoOpen: false,
	    buttons: {"OK": function() {}}
	});

    $("#check1").button();
    $("#check2").button();
};