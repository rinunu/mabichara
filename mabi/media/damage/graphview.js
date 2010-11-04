
/**
 * グラフを表示するビュー
 */
mabi.GraphView = function($element){
    this.$element_ = $element;
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 800,
	    height: 500
	});
};

mabi.GraphView.prototype.show = function(){
    this.$element_.dialog('open');    
};