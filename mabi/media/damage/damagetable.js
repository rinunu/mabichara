var mabi = mabi || {};

/**
 * ダメージ表を表示するビュー
 */
mabi.DamageTable = function($table, context){
    this.$table_ = $table;
    this.context_ = context;
};

mabi.DamageTable.prototype.initialize = function(){
    var this_ = this;

    this.appendHeader();

    this.context_.conditions().each(
	function(i, v){
	    this_.appendRow(v);
	});
};

/**
 * table の ヘッダーを生成する
 */
mabi.DamageTable.prototype.appendHeader = function(){
    var $thead = $('thead', this.$table_);

    var columns = this.context_.columns();

    var $tr = $('<tr />').appendTo($thead);
    $('<th />').attr('rowspan', 2).appendTo($tr);
    $('<th />').text('キャラクター').attr('rowspan', 2).appendTo($tr);
    $('<th />').text('ダメージ').attr('colspan', columns.length).appendTo($tr);

    $tr = $('<tr />').appendTo($thead);
    $.each(columns, function(i, v){
	       $('<th class="damage"/>').text(v.name).appendTo($tr);
	   });

};

/**
 * table に 1行追加する
 */
mabi.DamageTable.prototype.appendRow = function(condition){
    var this_ = this;
    var columns = this.context_.columns();
    console.assert(condition instanceof mabi.Condition);
    var $tr = $('<tr />');
    $('<td />').append($('<input type="checkbox" />')).appendTo($tr);
    $('<td />').text(condition.name()).appendTo($tr);

    $.each(columns, function(i, column){
	       var $td = $('<td class="damage" />').appendTo($tr);
	       this_.renderCell(condition, column, $td);
	   });

    var $tbody = $('tbody', this.$table_);
    $tr.appendTo($tbody);
};

/**
 * 1セル描画する
 */
mabi.DamageTable.prototype.renderCell = function(row, colum, $td){
    var context = {
	condition: row, 
	mob: this.context_.mob()
    };
    var value = Math.floor(colum.expression.value(context));
    $td.text(value);
};


// ----------------------------------------------------------------------
// 設定

