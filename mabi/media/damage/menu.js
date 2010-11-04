
mabi.Menu = function($element){
    this.$element_ = $element;
    $('.help', this.$element_).click(
	function(){
	    dam.help.show();
	});
};
