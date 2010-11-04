
/**
 * ヘルプ画面
 */
mabi.Help = function($element){
    this.$element_ = $element;
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 800,
	    height: 500
	});
};

mabi.Help.prototype.show = function(){
    this.$element_.dialog('open');
};

