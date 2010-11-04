var mabi = mabi || {};

/**
 * ダメージ表を表示するビュー
 */
mabi.DamageTable = function($table, conditions){
    this.$table_ = $table;
    this.conditions_ = conditions;
    this.columns_ = [];
};

mabi.DamageTable.prototype.initialize = function(){
    var this_ = this;

    this.appendHeader();

    $('<tbody />').appendTo(this.$table_);
    this.conditions_.each(function(i, v){
	       this_.appendRow(v);
	   });
};

/**
 * @param options {
 *   name: 名前,
 *   expression: Expression
 * }
 */
mabi.DamageTable.prototype.addColumn = function(options){
    this.columns_.push(options);
};

/**
 * table の ヘッダーを生成する
 */
mabi.DamageTable.prototype.appendHeader = function(){
    var $thead = $('<thead />').appendTo(this.$table_);

    var $tr = $('<tr />').appendTo($thead);
    $('<th />').attr('rowspan', 2).appendTo($tr);
    $('<th />').text('名前').attr('rowspan', 2).appendTo($tr);
    $('<th />').text('ダメージ').attr('colspan', this.columns_.length).appendTo($tr);

    $tr = $('<tr />').appendTo($thead);
    $.each(this.columns_, function(i, v){
	       $('<th />').text(v.name).appendTo($tr);
	   });

};

/**
 * table に 1行追加する
 */
mabi.DamageTable.prototype.appendRow = function(condition){
    var this_ = this;
    console.assert(condition instanceof mabi.Condition);
    var $tr = $('<tr />');
    $('<td />').append($('<button />').text('削除').button()).appendTo($tr);
    $('<td />').text(condition.name()).appendTo($tr);

    $.each(this.columns_, function(i, column){
	       var $td = $('<td />').appendTo($tr);
	       this_.renderCell(condition, column, $td);
	   });

    var $tbody = $('tbody', this.$table_);
    $tr.appendTo($tbody);
};

/**
 * 1セル描画する
 */
mabi.DamageTable.prototype.renderCell = function(row, colum, $td){
    var enemy = new mabi.Element(
	{
	    effects:[
		{param: 'protection', min: 0.3}
	    ]});

    var context = new mabi.Context({
				       condition: row, 
				       enemy: enemy
				   });
    var value = Math.floor(colum.expression.value(context));
    $td.text(value);
};


// ----------------------------------------------------------------------
// 設定

