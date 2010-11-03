/**
 * 各種計算式を定義する
 */

/**
 * 魔法攻撃ダメージ計算式
 * 
 * @param skill 攻撃に使用する SimpleSkill
 * @param charge 攻撃時のチャージ数
 */
mabi.MagicExpression = function(skill, charge){
    console.assert(skill instanceof mabi.SimpleSkill);

    this.super_.constructor.call(
	this, 
	function(c){
	    var condition = c.condition();
	    var enemy = c.enemy();
	    var magicAttack = 0.05 * condition.param('int');
	    var weapon = condition.weapon();

	    var typeMasteryBonus = 0; // 属性マスタリボーナス
	    var wandBonuses = {ice: 10, fire: 5, lightning: 7};
	    var wandBonus = 0;
	    $.each(['ice', 'fire', 'lightning'], function(i, v){
		       if(skill.is(v)){
			   typeMasteryBonus = condition.param(v + '_magic_damage');
			   if(skill.is('bolt') && weapon.is(v)){
			       wandBonus = wandBonuses[v];
			   }
		       }
		   });
	    var boltMasteryBonus = 0; // ボルトマスタリボーナス
	    if(skill.is('bolt')){
		boltMasteryBonus = condition.param('bolt_magic_damage');
	    }
	    var chargeBonus = skill.is('charge_bonus') ? charge : 1;
	    var fullChargeBonus = chargeBonus == 5 ? 1.3 : 1;

	    // todo 特殊ボーナス(ヘボナ・スタッフ)
	    var a = 1 + magicAttack / 100 + typeMasteryBonus + boltMasteryBonus;
	    var b = 1 + condition.param('weapon_magic_damage') + condition.param('magic_damage');

	    // todo ダメージエンチャントボーナス
	    var enchantBonus = 0;

	    // todo クリティカルボーナス
	    var criticalBouns = 0;

	    // 特別改造魔法ダメージボーナス
	    var specialUpgradeBonus = condition.param('s_upgrade');

	    var damage = ((skill.param('damage_max') * fullChargeBonus + wandBonus) * chargeBonus + enchantBonus);
	    damage *= (1 + criticalBouns);
	    damage *= (1 - enemy.param('protection'));
	    damage += specialUpgradeBonus;
	    damage *= a * b * 1.1;
	    
	    return damage;
	});
};
util.extend(mabi.MagicExpression, mabi.Expression);

// ----------------------------------------------------------------------

/**
 * ボルト魔法の合体攻撃ダメージ計算式
 * 
 * @param skill0 攻撃に使用する SimpleSkill
 * @param skill1 攻撃に使用する SimpleSkill
 * @param charge 攻撃時のチャージ数
 */
mabi.FusedBoltMagicDamage = function(skill0, skill1, charge){
    console.assert(skill0 instanceof mabi.SimpleSkill);
    console.assert(skill1 instanceof mabi.SimpleSkill);

    var expressions = [new mabi.MagicExpression(skill0, charge),
			new mabi.MagicExpression(skill1, charge)];

    this.super_.constructor.call(
	this, 
	function(c){
	    var condition = c.condition();
	    var enemy = c.enemy();

	    var damage = 0;
	    $.each(expressions, function(i, v){damage += v.value(c);});
	    damage *= 1 + condition.param('fused_bolt_magic_damage');
	    return damage;
	});
};

util.extend(mabi.FusedBoltMagicDamage, mabi.Expression);
