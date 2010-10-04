
/**
 * 1行はスロット(部位)とサブスロット(武器・エンチャント)で特定される。
 * 
 */
mabi.EquipmentSetView = function(dom){
    this.$parent_ = dom;
    this.$table_ = $('table', this.$parent_);

    // 表示する列(部位以外)
    this.columns_ = [
	mabi.EquipmentSetView.COLUMNS[0],
	mabi.EquipmentSetView.COLUMNS[1],
	mabi.EquipmentSetView.COLUMNS[2]];

    this.createTable();
};

mabi.EquipmentSetView.prototype.setModel = function(model){
    this.model_ = model;

    this.refresh();
};

mabi.EquipmentSetView.prototype.refresh = function(){
    this.refreshValues();
};

// ----------------------------------------------------------------------
// private

(function(){
     var SUB_SLOTS = [
	 {label: '装備', slot: 'equipment'},
	 {label: 'Prefix', slot: 'prefix'},
	 {label: 'Suffix', slot: 'suffix'}
     ];
     
     mabi.EquipmentSetView.SLOTS = [
	 {label: 'タイトル', slot: 'title'},
	 {label: '右手', slot: 'right_hand', subSlots: SUB_SLOTS},
	 {label: '左手', slot: 'left_hand', subSlots: SUB_SLOTS},
	 {label: '頭', slot: 'head', subSlots: SUB_SLOTS},
	 {label: 'アクセサリー1', slot: 'accessory1', subSlots: SUB_SLOTS},
	 {label: 'アクセサリー2', slot: 'accessory2', subSlots: SUB_SLOTS},
	 {label: '体', slot: 'body', subSlots: SUB_SLOTS},
	 {label: '手', slot: 'hand', subSlots: SUB_SLOTS},
	 {label: '足', slot: 'foot', subSlots: SUB_SLOTS},
	 {label: 'ローブ', slot: 'robe'}
     ];
})();

/**
 * 表示できる列の情報
 */
mabi.EquipmentSetView.COLUMNS = [
    {
	name: 'name',
	label: '名前', 
	value: function(c){
	    return c.name();
	}
    },
    {
	name: 'critical_luck_will',
	label: 'クリ',
	value: function(c){
	    return c.param('critical') + c.param('will') / 10.0 + c.param('luck') / 5.0;
	}
    },
    {
	name: 'attack_max_melee',
	label: '最大(近接)', 
	value: function(c){
	    return c.param('attack_max') + c.param('str') / 2.5;
	}
    },
    {
	name: 'attack_max_ranged',
	label: '最大(弓)'
    }
];

// ----------------------------------------------------------------------

/**
 * テーブルを作成する
 */
mabi.EquipmentSetView.prototype.createTable = function(){
    var slots = mabi.EquipmentSetView.SLOTS;
    for(var i = 0; i < slots.length; i++){
	var slot = slots[i];
	if(slot.subSlots){
	    this.addRow(slot, slot.subSlots[0], slot.subSlots.length);
	    for(var j = 1; j < slot.subSlots.length; j++){
		this.addRow(slot, slot.subSlots[j]);
	    }
	}else{
	    this.addRow(slot, '', 1);
	}
    }
};

/**
 * テーブルに1行追加する
 */
mabi.EquipmentSetView.prototype.addRow = function(slot, subSlot, rowspan){
    var $tbody = $('tbody', this.$table_);
    var $tr = $('<tr>').addClass(slot.slot + ' ' + subSlot.slot);
    if(rowspan){
	$tr.append($('<td/>').text(slot.label).attr('rowspan', rowspan));
    }
    for(var i = 0; i < this.columns_.length; i++){
	var column = this.columns_[i];
	$tr.append($('<td/>').addClass(column.name).text('-'));
    }
    $('.name', $tr).addClass('editable');
    
    $tbody.append($tr);
};

/**
 * テーブル全体の数値を更新する
 */
mabi.EquipmentSetView.prototype.refreshValues = function(){
    var $tbody = $('tbody', this.$table_);
    var slots = mabi.EquipmentSetView.SLOTS;
    for(var i = 0; i < slots.length; i++){
	var slot = slots[i];
	if(slot.subSlots){
	    for(var j = 0; j < slot.subSlots.length; j++){
		this.refreshRow(slot, slot.subSlots[j]);
	    }
	}else{
	}
    }
};

/**
 * テーブルの1行分の数値を更新する
 */
mabi.EquipmentSetView.prototype.refreshRow = function(slot, subSlot){
    // this.refreshNameCell(slot, subSlot);
    for(var i = 0; i < this.columns_.length; i++){
	var column = this.columns_[i];
	this.refreshCell(slot, subSlot, column);
    }
};

/**
 * テーブルの指定した名前セルの値を更新する
 */
mabi.EquipmentSetView.prototype.refreshNameCell = function(slot, subSlot){
    var element = this.element(slot, subSlot);
    var value = element ? element.name() : '-';
    this.td(slot, subSlot, 'name').text(value);
};

/**
 * テーブルの指定した数値セルの値を更新する
 */
mabi.EquipmentSetView.prototype.refreshCell = function(slot, subSlot, column){
    var element = this.element(slot, subSlot);
    var value = '-';
    if(element){
	var c = new mabi.ContextualElement(element, null, this.model_);
	value = column.value(c);
    }

    this.td(slot, subSlot, column.name).text(value);
};

/**
 * 特定のセル(td)を取得する
 */
mabi.EquipmentSetView.prototype.td = function(slot, subSlot, columnName){
    var trClass = '.' + slot.slot + (subSlot.slot ? '.' + subSlot.slot : '');
    return $(trClass + ' .' + columnName, this.$table_);
};

/**
 * モデルから指定した Slot の Element を取得する
 * 
 * 存在しない場合は null を返す
 */
mabi.EquipmentSetView.prototype.element = function(slot, subSlot){
    var element = this.model_.child(slot.slot);
    if(element && subSlot){
	element = element.child(subSlot.slot);
    }
    return element;
};
