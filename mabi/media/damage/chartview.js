
/**
 * グラフを表示するビュー
 */
mabi.ChartView = function($element){
    this.$element_ = $element;
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 1000,
	    height: 600
	});
};

/**
 * ビューを表示する
 */
mabi.ChartView.prototype.show = function(context){
    this.context_ = context;
    this.$element_.dialog('open');
    this.updateChart();
};

/**
 * チャートの表示を更新する
 */
mabi.ChartView.prototype.updateChart = function(){
    var data = this.createDataTable();

    if(!this.chart_){
	this.chart_ = new google.visualization.LineChart($('div.chart')[0]);
	// this.chart_ = new google.visualization.ColumnChart($('div.chart')[0]);
    }
    this.chart_.draw(data, {
			 // width: 900,
			 height: 500,
			 fontSize: 9
		     });
};

/**
 * DataTable を生成する
 */
mabi.ChartView.prototype.createDataTable = function(){
    return this.context_.damageData().table();
};