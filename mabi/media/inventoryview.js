
mabi.InventoryView = function(){
    this.$element_ = $('.inventory');
    this.$element_.dialog(
	{
	    autoOpen: true,
	    buttons: {"OK": function() {}}
	});

    this.$table_ = $('table', this.$element_);

    var data = [
	[[['リッチ'], ['クロコダイル'], ['クレイモア(1級 100式)']]],
	[[['原理'], ['軽鎧', true]],
	 [['クリティカルヒットマスター']],
	 [['軽い'], ['ユリ'], ['アクセサリー', true]]],

	[[['暗黒(14)'], ['軽鎧', true]]],
	[[['ユリ'], ['アクセサリー', true]]]
    ];

    for(var i = 0; i < data.length; i++){
	var row = data[i];
	this.addRow(row);
    }
};

// ----------------------------------------------------------------------

mabi.InventoryView.prototype.addRow = function(element){

    var $tbody = $('tbody', this.$table_);
    var $tr = $('<tr>');
    $('<td>')
	.append($('<input type="checkbox">'))
	.append($('<button/>').text('装備').button())
	.appendTo($tr);

    this.createNameColumn(element).appendTo($tr);

    $('<td>').appendTo($tr);
    $('<td>').appendTo($tr);
    $('<td>').appendTo($tr);
    $tr.appendTo($tbody);
};

mabi.InventoryView.prototype.createNameColumn = function(element){
    var $td = $('<td class="editable"/>');
    for(var i = 0; i < element.length; i++){
	var row = element[i];
	var $row = $('<div/>').appendTo($td);
	for(var j = 0; j < row.length; j++){
	    var column = row[j];
	    var $column = $('<span/>').addClass('element').text(column[0]);
	    if(column[1]){
		$column.addClass('virtual');
	    }
	    $column.appendTo($row);
	}
    }
    return $td;
};