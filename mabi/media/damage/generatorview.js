
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
	    height: 700,
	    buttons: {"設定する": util.bind(this, this.apply)}
	});

    this.offensesView_ = new mabi.OffensesView($('#tabs1_offenses'));
};

mabi.GeneratorView.prototype.show = function(context){
    this.context_ = context;
    this.offensesView_.show(this.createOffenses());
    this.$element_.dialog('open');
};

// ----------------------------------------------------------------------
// private

/**
 * DamageData をもとに offenses を作成する
 */
mabi.GeneratorView.prototype.createOffenses = function(){
    var damageData = this.context_.damageData();
    console.assert(damageData instanceof mabi.OffenseDefenseDamageData);

    var offenses = new mabi.Collection;
    var map = []; // 重複チェック用
    $.each(damageData.offenses(), function(i, offense){
        offenses.push(offense);
    });
    return offenses;
};

/**
 * 設定を確定する
 */
mabi.GeneratorView.prototype.apply = function(){
    var damageData = this.context_.damageData();
    damageData.setOffenses(this.offensesView_.data());
    this.context_.update();
    this.$element_.dialog('close');
};

