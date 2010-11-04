var mabi = mabi || {};

/**
 * ダメージ表を表示するビュー
 */
mabi.DamageTable = function($table, conditions){
    this.$table_ = $table;
    this.conditions_ = conditions;
    this.columns_ = [
	{name: 'IB'},
	{name: 'FB(1C)'},
	{name: 'FB(5C)'},
	{name: 'LB'},
	{name: 'IB+FB(1C)'},
	{name: 'IB+FB(5C)'},
	{name: 'IB+LB'},
	{name: 'FB+LB'},
	{name: 'アタック'},
	{name: 'レンジ'}
    ];

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
    console.assert(condition instanceof mabi.Condition);
    var $tr = $('<tr />');
    $('<td />').append($('<button />').text('削除').button()).appendTo($tr);
    $('<td />').text(condition.name()).appendTo($tr);

    $.each(this.columns_, function(i, v){
	       $('<td />').text('0').appendTo($tr);
	   });

    var $tbody = $('tbody', this.$table_);
    $tr.appendTo($tbody);
};

// ----------------------------------------------------------------------
// 設定

