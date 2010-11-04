
/**
 * グラフを表示するビュー
 */
mabi.GraphView = function($element){
    this.$element_ = $element;
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 1000,
	    height: 700
	});
};

/**
 * ビューを表示する
 */
mabi.GraphView.prototype.show = function(context){
    this.context_ = context;
    this.$element_.dialog('open');
    this.updateChart();
};

/**
 * チャートの表示を更新する
 */
mabi.GraphView.prototype.updateChart = function(){
    var data = this.createDataTable();

    if(!this.chart_){
	this.chart_ = new google.visualization.LineChart($('div.chart')[0]);
    }
    this.chart_.draw(data, {
			 width: 1000,
			 height: 600,
			 fontSize: 9
		     });
};

/**
 * DataTable を生成する
 */
mabi.GraphView.prototype.createDataTable = function(){
    var mob = this.context_.mob();
    var conditions = this.context_.conditions();
    var columns = this.context_.columns();

    // 横軸が Condition
    // 縦軸が ダメージ
    // 各ラインが攻撃種別

    var data = new google.visualization.DataTable();
    data.addColumn('string', '');
    // 各 2カラム目以降、それぞれのカラムが 1ラインになる
    $.each(columns, function(i, column){
	       data.addColumn('number', column.name);
	   });
    
    data.addRows(conditions.length());
    conditions.each(
	function(row, condition){
	    data.setValue(row, 0, condition.name());
	    $.each(columns, function(i, column){
		       var c = {
			   condition: condition,
			   mob: mob
		       };
		       var value = Math.floor(column.expression.value(c));
		       data.setValue(row, i + 1, value);
		   });
	});
    return data;
};