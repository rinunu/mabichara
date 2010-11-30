var mabi = mabi || {};

/**
 * ダメージ表を表示するビュー
 */
mabi.DamageTable = function($table, context){
    this.$table_ = $table;
    this.context_ = context;

    $(this.context_).bind('change', util.bind(this, this.tableUpdate));
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
    console.log('update');
    $('thead', this.$table_).empty();
    $('tbody', this.$table_).empty();

    this.appendHeader();

    var table = this.context_.damageData().table();
    for(var i = 0; i < table.getNumberOfRows(); i++){
	this.appendRow(table, i);
    }

    console.log('updated');
};


/**
 * table の ヘッダーを生成する
 */
mabi.DamageTable.prototype.appendHeader = function(){
    var $thead = $('thead', this.$table_);
    var damageData = this.context_.damageData();

    var columnFields = damageData.columnFields();
    var rowFields = damageData.rowFields();

    var $trs = [];

    // 1行目の tr
    var $tr = $('<tr />').appendTo($thead);
    $.each(rowFields, function(i, v){
	$('<th />').text('').attr('rowspan', columnFields.length).appendTo($tr);
    });
    $trs.push($tr);

    // 2行目以降 tr
    $.each(columnFields, function(i, v){
	$trs.push($('<tr />').appendTo($thead));
    });
    
    var table = damageData.table();
    for(i = 1; i < table.getNumberOfColumns(); i++){
	$.each(table.getColumnProperty(i, 'idFields'), function(i, field){
    	    $('<th class="damage"/>').text(field.name()).appendTo($trs[i]);
    	});
    }
};

/**
 * table に 1行追加する
 */
mabi.DamageTable.prototype.appendRow = function(table, row){
    var this_ = this;
    var $tr = $('<tr />');
    
    $.each(table.getRowProperty(row, 'idFields'), function(i, v){
	var $td = $('<td/>').text(v.name()).appendTo($tr);
    });

    for(var i = 1; i < table.getNumberOfColumns(); i++){
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
