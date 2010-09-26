
mabi.EquipmentSetView = function(dom, model){
    this.$parent_ = dom;
    this.$table_ = $('table', this.$parent_);

    this.setModel(model);
};

mabi.EquipmentSetView.prototype.setModel = function(model){
    this.model_ = model;

    this.refresh();
};

mabi.EquipmentSetView.prototype.refresh = function(){
    var slots = mabi.EquipmentSetView.SLOTS;
    for(var i = 0; i < slots.length; i++){
	var slot = slots[i];
	if(slot.hasEnchant){
	    this.addRow(slot, 'equipment', 3);
	    this.addRow(slot, 'prefix');
	    this.addRow(slot, 'suffix');
	}else{
	    this.addRow(slot, '', 1);
	}
    }

    this.refreshValues();
};

// ----------------------------------------------------------------------
// private

mabi.EquipmentSetView.SUB_SLOTS = [
    {label: '装備', slot: 'equipment'},
    {label: 'Prefix', slot: 'prefix'},
    {label: 'Suffix', slot: 'suffix'}
];

mabi.EquipmentSetView.SLOTS = [
    {label: 'キャラクター', slot: 'character', hasEnchant: false},
    {label: 'タイトル', slot: 'title', hasEnchant: false},
    {label: '右手', slot: 'rightHand', hasEnchant: true},
    {label: '左手', slot: 'leftHand', hasEnchant: true},
    {label: '頭', slot: 'head', hasEnchant: true},
    {label: 'アクセサリー1', slot: 'accessory1', hasEnchant: true},
    {label: 'アクセサリー2', slot: 'accessory2', hasEnchant: true},
    {label: '体', slot: 'body', hasEnchant: true},
    {label: '手', slot: 'hand', hasEnchant: true},
    {label: '足', slot: 'foot', hasEnchant: true},
    {label: 'ローブ', slot: 'robe', hasEnchant: false}
];


/**
 * テーブルに1行追加する
 */
mabi.EquipmentSetView.prototype.addRow = function(slot, subSlotName, rowspan){
    var $tbody = $('tbody', this.$table_);
    var $tr = $('<tr>').addClass(slot.slot + ' ' + subSlotName);
    if(rowspan){
	$tr.append($('<td/>').text(slot.label).attr('rowspan', rowspan));
    }
    $tr.append($('<td class="name editable"/>').text('-'));
    $tr.append($('<td class="critical"/>').text('-'));
    $tr.append($('<td class=""/>').text('-'));
    $tbody.append($tr);
};

/**
 * テーブルの数値を更新する
 */
mabi.EquipmentSetView.prototype.refreshValues = function(){
    var $tbody = $('tbody', this.$table_);
    var slots = mabi.EquipmentSetView.SLOTS;
    for(var i = 0; i < slots.length; i++){
	var slot = slots[i];
	if(slot.hasEnchant){
	    this.refreshRow(slot, 'equipment');
	    this.refreshRow(slot, 'prefix');
	    this.refreshRow(slot, 'suffix');
	}else{
	}
    }
};

/**
 * テーブルの1行分の数値を更新する
 */
mabi.EquipmentSetView.prototype.refreshRow = function(slot, subSlotName){
    var child = this.model_.child(slot.slot);
    if(child && subSlotName){
	child = child.child(subSlotName);
    }

    var value = child ? child.name() : '-';
    var trClass = '.' + slot.slot + (subSlotName ? '.' + subSlotName : '');
    var $tr = $(trClass + ' .name', this.$table_);
    $tr.text(value);
    
};
