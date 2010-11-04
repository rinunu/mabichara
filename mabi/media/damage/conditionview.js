
/**
 * Condition を編集するためのビュー
 */
mabi.ConditionView = function($element){
    this.$element_ = $element;

    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 800,
	    height: 500
	});
};

mabi.ConditionView.prototype.show = function(){
    this.$element_.dialog('open');
};

