
mabi.Menu = function($element){
    this.$element_ = $element;
    $(':button', this.$element_).button();

    $('.help', this.$element_).click(
	function(){
	    dam.help.show();
	});

    $('.generator', this.$element_).click(
	function(){
	    dam.generatorView.show();
	});

    $('.graph', this.$element_).click(
	function(){
	    dam.graphView.show();
	});
};
