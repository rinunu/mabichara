/**
 * Equipment の改造を編集する View
 * 
 * 編集結果はつど edit に渡された equipment に設定される
 */
mabi.UpgradeView = function($element){
    this.$element_ = $element;

    this.$element_.delegate('tbody.selectable', 'click', 
			    util.bind(this, this.onSelectUpgrade));
};

mabi.UpgradeView.prototype.initialize = function(){
};

/**
 * 編集を開始する
 */
mabi.UpgradeView.prototype.edit = function(equipment){
    this.equipment_ = equipment;
    // todo 読み込み中にする
    var cmd = mabi.equipments.loadDetail(equipment.base());
    cmd.success(util.bind(this, this.updateUpgrades));
};


// ----------------------------------------------------------------------
// event

/**
 * 改造選択時
 */
mabi.UpgradeView.prototype.onSelectUpgrade = function(event){
    // 改造を作成する
    var upgrade = this.element($(event.target)).create();
    console.log(upgrade);

    // 改造を追加する
    // アクティブな改造を次へ進める
};

// ----------------------------------------------------------------------
// private

/**
 * 改造表を更新する
 */
mabi.UpgradeView.prototype.updateUpgrades = function(){
    var $list = $('tbody', this.$element_);
    $list.empty();
    var this_ = this;
    $.each(this.equipment_.base().upgrades(), function(i, upgrade){
	       var $tr = $('<tr/>').appendTo($list);
	       $('<td class="ug"/>').text(upgrade.ug().join('~')).appendTo($tr);
	       $('<td class="name"/>').text(upgrade.name()).appendTo($tr);
	       $('<td class="proficiency"/>').text(upgrade.proficiency()).appendTo($tr);
	       this_.appendEffectHtml(upgrade, $('<td class="effects"/>').appendTo($tr));
	       $('<td class="cost"/>').text(upgrade.cost()).appendTo($tr);
	       $tr.data('element', upgrade);
	   });
};

/**
 * Effect の内容を人間用の文字列に変換する
 */
mabi.UpgradeView.prototype.appendEffectHtml = function(upgrade, $parent){
    $parent = $('<ul/>').appendTo($parent);
    upgrade.eachEffect(
	function(e){
	    $('<li/>').text(e.paramText() + e.op() + e.min()).
		addClass(e.plus() ? 'plus' : 'minus').
		appendTo($parent);
	});
};
