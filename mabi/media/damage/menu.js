
mabi.Menu = function($element){
    this.$element_ = $element;

    $('.help', this.$element_).click(
	function(){
	    dam.help.show();
	});

    $('.generator', this.$element_).click(
	function(){
	    dam.generatorView.show(dam.context);
	});

    $('.chart', this.$element_).click(
	function(){
	    dam.chartView.show(dam.context);
	});

    $('.options', this.$element_).click(
	function(){
	    dam.optionsView.show(dam.context);
	});
};
