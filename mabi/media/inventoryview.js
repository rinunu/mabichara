
mabi.InventoryView = function(model){
    this.model_ = model;

    this.$element_ = $('.inventory');
    this.$element_.dialog(
	{
	    autoOpen: true,
	    width: 700,
	    height: 500,
	    buttons: {'アイテムを削除': function(){}, 
		      'アイテムを複製': function(){},
		      '新しいアイテムを追加': function(){}}
	});
    this.elementsView_ = new mabi.ElementsView($('table', this.$element_));

    this.elementsView_.addColumn(
	{
	    id: 'command',
	    label: '',
	    render: function($td, c){
		$td.empty().
		    append($('<input type="checkbox">')).
		    append($('<button/>').text('装備').button());
	    }
	});
    this.elementsView_.addColumn(mabi.ElementsView.COLUMNS.name);
    this.elementsView_.addColumn(mabi.ElementsView.COLUMNS.attack_max_ranged);
    this.elementsView_.addColumn(mabi.ElementsView.COLUMNS.critical_luck_will);
    // this.elementsView_.addColumn(mabi.ElementsView.COLUMNS.critical_attack_max_ranged);

    this.elementsView_.setModel(model);
};

// ----------------------------------------------------------------------
// private

// mabi.ElementsView2.prototype.addRow = function(element){

//     var $tbody = $('tbody', this.$table_);
//     var $tr = $('<tr>');
//     $('<td>')
// 	.append($('<input type="checkbox">'))
// 	.append($('<button/>').text('装備').button())
// 	.appendTo($tr);

//     this.createNameColumn(element).appendTo($tr);

//     $('<td>').appendTo($tr);
//     $('<td>').appendTo($tr);
//     $('<td>').appendTo($tr);
//     $tr.appendTo($tbody);
// };

