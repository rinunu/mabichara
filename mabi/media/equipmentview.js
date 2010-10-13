
/**
 * 個別装備の編集を行うビュー
 */
mabi.EquipmentView = function(){
    this.$element_ = $('.equipment_view');
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 1000,
	    height: 600,
	    buttons: {"OK": function() {}}
	});

    // 編集中の装備
    this.equipment_ = null;

    var this_ = this;
    $('select.equipment', this.$element_).change(
	function(){
	    var id = $(this).val();
	    var equipmentClass = mabi.equipments.find(id);
	    this_.onChangeEquipment(equipmentClass);
	});

    // 性能表
    this.specView_ = new mabi.ElementsView($('table.equipment', this.$element_));
    this.specView_.addColumn({id: 'type', label: '種別', value: 
			      function(c){
				  return c.element().slot();}});
    this.specView_.addColumn(mabi.ElementsView.COLUMNS.name);
    this.specView_.addColumn(mabi.ElementsView.COLUMNS.attack_max_ranged);
    this.specView_.addColumn(mabi.ElementsView.COLUMNS.critical_luck_will);
    this.specView_.addElementType(mabi.ReferenceElement); // EquipmentClass
    this.specView_.addElementType(mabi.Upgrade);
    this.specView_.addElementType(mabi.Enchant);

    this.upgradeView_ = new mabi.UpgradeView($('table.upgrades', this.$element_));
};

mabi.EquipmentView.prototype.initialize = function(){
    mabi.equipments.load();

    this.prefixView_ = new mabi.EnchantView($('.prefix', this.$element_), 'prefix');
    this.suffixView_ = new mabi.EnchantView($('.suffix', this.$element_), 'suffix');

    this.prefixView_.initialize();
    this.suffixView_.initialize();
    this.upgradeView_.initialize();
};

mabi.EquipmentView.prototype.edit = function(element){
    this.$element_.dialog('open');

    // todo clone する
    // this.element_ = element;
    this.equipment_ = new mabi.Equipment();
    // this.onChangeEquipment(element);
    
    mabi.equipments.load().
	success(util.bind(this, this.onLoadList));
    this.prefixView_.edit(this.equipment_);
    this.suffixView_.edit(this.equipment_);
};

// ----------------------------------------------------------------------
// event

/**
 * 編集する武器の変更時
 */
mabi.EquipmentView.prototype.onChangeEquipment = function(equipmentBase){
    if(equipmentBase){
	this.equipment_.setBase(equipmentBase);
	this.upgradeView_.edit(this.equipment_);
	this.specView_.setModel(this.equipment_);
    }
};

/**
 * 装備情報の変更時
 */
mabi.EquipmentView.prototype.onUpdateElement = function(){
    
};

/**
 * 武器リストデータの読み込み完了
 */
mabi.EquipmentView.prototype.onLoadList = function(){
    var $list = $('select.equipment', this.$element_);
    $list.empty();

    mabi.equipments.each(
	function(i, equipment){
	    $('<option/>').text(equipment.name()).val(equipment.id()).
		appendTo($list);
	});
};

// ----------------------------------------------------------------------
// private

/**
 * DOM 要素に紐づいた Element を取得する
 */
mabi.EquipmentView.prototype.element = function(child){
    var $dom = $(child).closest('tr');
    console.assert($dom.length != 0);
    return $dom.data('element');
};



