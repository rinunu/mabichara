
/**
 * オプション設定用ビュー
 */
mabi.OptionsView = function($element){
    this.$element_ = $element;
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 1000,
	    height: 700
	});
};

mabi.OptionsView.prototype.show = function(context){
    this.context_ = context;
    this.$element_.dialog('open');
};
