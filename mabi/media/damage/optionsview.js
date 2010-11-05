
/**
 * オプション設定用ビュー
 */
mabi.OptionsView = function($element){
    this.$element_ = $element;
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 500,
	    height: 500
	});
};

mabi.OptionsView.prototype.show = function(context){
    this.context_ = context;
    this.$element_.dialog('open');
};
