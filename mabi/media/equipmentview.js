
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
};

mabi.EquipmentView.prototype.initialize = function(){
    mabi.equipments.load();

    this.prefixView_ = new mabi.EnchantView($('.prefix', this.$element_), 'prefix');
    this.suffixView_ = new mabi.EnchantView($('.suffix', this.$element_), 'suffix');

    this.prefixView_.initialize();
    this.suffixView_.initialize();
};

mabi.EquipmentView.prototype.edit = function(element){
    this.$element_.dialog('open');

    // todo clone する
    // this.element_ = element;
    console.log(element);
    this.onChangeEquipment(element ? element.base() : element);
    
    mabi.equipments.load().
	success(util.bind(this, this.onLoadList));
    this.prefixView_.edit();
    this.suffixView_.edit();
};

// ----------------------------------------------------------------------
// event

/**
 * 編集する武器の変更時
 */
mabi.EquipmentView.prototype.onChangeEquipment = function(equipmentBase){
    if(equipmentBase){
	this.equipment_ = equipmentBase.create();
	util.Event.bind(this.equipment_, this, {addChild: util.bind(this, this.onUpdateElement)});
	this.onUpdateElement();

	// todo 読み込み中にする
	var cmd = mabi.equipments.loadDetail(equipmentBase);
	cmd.success(util.bind(this, this.updateUpgrades));
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
 * 改造表を更新する
 */
mabi.EquipmentView.prototype.updateUpgrades = function(){
    var $list = $('table.upgrades tbody', this.$element_);
    $list.empty();
    var this_ = this;
    $.each(this.equipment_.base().upgrades(), function(i, upgrade){
	       var $tr = $('<tr/>').appendTo($list);
	       $('<td class="ug"/>').text(upgrade.ug().join('~')).appendTo($tr);
	       $('<td class="name"/>').text(upgrade.name()).appendTo($tr);
	       $('<td class="proficiency"/>').text(upgrade.proficiency()).appendTo($tr);
	       this_.appendEffectHtml(upgrade, $('<td class="effects"/>').appendTo($tr));
	       $('<td class="cost"/>').text(upgrade.cost()).appendTo($tr);
	   });
};

/**
 * Effect の内容を人間用の文字列に変換する
 */
mabi.EquipmentView.prototype.appendEffectHtml = function(upgrade, $parent){
    $parent = $('<ul/>').appendTo($parent);
    upgrade.eachEffect(
	function(e){
	    $('<li/>').text(e.paramText() + e.op() + e.min()).
		addClass(e.plus() ? 'plus' : 'minus').
		appendTo($parent);
	});
};

// ----------------------------------------------------------------------
// 

