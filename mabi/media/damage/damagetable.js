var mabi = mabi || {};

/**
 * ダメージ表を表示するビュー
 */
mabi.DamageTable = function($table, context){
    this.$table_ = $table;
    this.context_ = context;

    util.Event.bind(this.context_, this, {update: this.tableUpdate});
};

mabi.DamageTable.prototype.initialize = function(){
    var this_ = this;
    this.update();
};

// ----------------------------------------------------------------------
// private

/**
 * 表示を更新する
 */
mabi.DamageTable.prototype.update = function(){
    $('thead', this.$table_).empty();
    $('tbody', this.$table_).empty();

    this.appendHeader();

    var table = this.context_.table();
    for(var i = 0; i < table.getNumberOfRows(); i++){
	this.appendRow(table, i);
    }
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
    this.context_.eachColumn(function(i, v){
	$('<th class="damage"/>').text('todo').appendTo($tr);
    });
};

/**
 * table に 1行追加する
 */
mabi.DamageTable.prototype.appendRow = function(table, row){
    var this_ = this;
    var $tr = $('<tr />');
    $('<td />').append($('<input type="checkbox" />')).appendTo($tr);
    for(var i = 0; i < table.getNumberOfColumns(); i++){
	var $td = $('<td/>').appendTo($tr);
	var columnType = table.getColumnType(i);
	if(columnType == 'number') $td.addClass('damage');
	this_.renderCell(table, row, i, $td);
    }

    var $tbody = $('tbody', this.$table_);
    $tr.appendTo($tbody);
};

/**
 * 1セル描画する
 */
mabi.DamageTable.prototype.renderCell = function(table, row, colum, $td){
    $td.text(table.getValue(row, colum));
};


// ----------------------------------------------------------------------
// 

/**
 *
 */
mabi.DamageTable.prototype.tableUpdate = function(){
    this.update();
};
