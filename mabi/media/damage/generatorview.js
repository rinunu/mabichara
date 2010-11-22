
/**
 * ダメージデータ設定用のビュー
 *
 * データは offenses と defenses からなる。
 * defenses は body, 防具(equipmentSet), 武器(equipment), expression からなる。
 * それぞれ OffensesView, MobsView にて設定を行う。
 */
mabi.GeneratorView = function($element){
    this.$element_ = $element;
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 900,
	    height: 750,
	    buttons: {
                '全て削除': util.bind(this, this.reset),
                '決定': util.bind(this, this.apply)}
	});

    this.offensesView_ = new mabi.OffensesView($('#tabs1_offenses'));
    this.defensesView_ = new mabi.DefensesView($('#tabs1_defenses'));
};

mabi.GeneratorView.prototype.show = function(context){
    this.context_ = context;
    this.offensesView_.show(context.damageData().offenses());
    this.defensesView_.show(context.damageData().defenses());
    this.$element_.dialog('open');
};

// ----------------------------------------------------------------------
// private

/**
 * 設定を確定する
 */
mabi.GeneratorView.prototype.apply = function(){
    var damageData = this.context_.damageData();
    damageData.setOffenses(this.offensesView_.data());
    damageData.setDefenses(this.defensesView_.data());
    
    this.context_.update();
    this.$element_.dialog('close');
};

/**
 * 全て削除
 */
mabi.GeneratorView.prototype.reset = function(){
    var damageData = this.context_.damageData();

    this.offensesView_.show([]);
    this.defensesView_.show([]);
};

