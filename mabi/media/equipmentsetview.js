
/**
 * 1行はスロット(部位)とサブスロット(武器・エンチャント)で特定される。
 * 
 * 
 * 実装について
 * 装備していない欄を空白で表示するため、 EquipmentSet を直接表示せず、
 * 独自の Element を使用する。
 */
mabi.EquipmentSetView = function($view){
    this.$table_ = $('table', $view);

    this.elementsView_ = new mabi.ElementsView(this.$table_);
    this.elementsView_.addColumn(mabi.ElementsView.COLUMNS.slot);
    this.elementsView_.addColumn(mabi.ElementsView.COLUMNS.name);
    this.elementsView_.addColumn(mabi.ElementsView.COLUMNS.attack_max_ranged);
    this.elementsView_.addColumn(mabi.ElementsView.COLUMNS.critical_luck_will);

    this.elementsView_.addElementType(mabi.Enchant);
    this.elementsView_.addElementType(mabi.NoEnchantedEquipment);
    this.elementsView_.addElementType(mabi.Title);
};

mabi.EquipmentSetView.prototype.setModel = function(model){
    this.model_ = model;
    this.elementsView_.setModel(model);

    // this.refresh();
};

mabi.EquipmentSetView.prototype.refresh = function(){
    this.refreshValues();
};

// ----------------------------------------------------------------------
// private


// ----------------------------------------------------------------------
