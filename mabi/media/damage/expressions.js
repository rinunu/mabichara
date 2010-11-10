/**
 * 各種計算式を定義する
 */

/**
 * 基本的な魔法攻撃ダメージ計算式
 * 
 * @param skill 攻撃に使用する SkillClass
 * @param charge 攻撃時のチャージ数
 * @param options {
 *   critical: 
 * }
 */
mabi.MagicDamage = function(skill, options){
    console.assert(skill instanceof mabi.Skill);
    options = options || {};

    this.super_.constructor.call(
	this, 
	function(c){
	    var character = c.character;
	    var mob = c.mob;
	    var weapon = character.equipmentSet().rightHand();
	    console.assert(character instanceof mabi.Character);

	    var magicAttack = 0.05 * character.param('int');
	    var typeMasteryBonus = 0; // 属性マスタリボーナス
	    var wandBonuses = {ice: 10, fire: 5, lightning: 7};
	    var wandBonus = 0;
	    $.each(['ice', 'fire', 'lightning'], function(i, v){
		       if(skill.is(v)){
			   typeMasteryBonus = character.param(v + '_magic_damage');
			   if(skill.is('bolt') && weapon && weapon.is(v)){
			       wandBonus = wandBonuses[v];
			   }
		       }
		   });
	    var boltMasteryBonus = 0; // ボルトマスタリボーナス
	    if(skill.is('bolt')){
		boltMasteryBonus = character.param('bolt_magic_damage');
	    }
	    var chargeBonus = skill.is('charge_bonus') ? options.charge : 1;
	    var fullChargeBonus = chargeBonus == 5 ? 1.3 : 1;

	    var a = 1 + magicAttack / 100 + typeMasteryBonus + boltMasteryBonus;
	    var b = 1 + character.param('weapon_magic_damage') + character.param('magic_damage');

	    // todo ダメージエンチャントボーナス
	    var enchantBonus = 0;
	    var criticalBouns = options.critical ? 1.5 : 0;

	    // 特別改造魔法ダメージボーナス
	    var specialUpgradeBonus = character.param('s_upgrade');

	    var baseDamageMax = character.body().skill(skill).param('damage_max');

	    var damage = ((baseDamageMax * fullChargeBonus + wandBonus) * chargeBonus + enchantBonus);
	    damage *= (1 + criticalBouns);
	    damage *= (1 - mob.param('protection'));
	    damage += specialUpgradeBonus;
	    damage *= a * b * 1.1;
	    
	    return damage;
	},
	options.name
    );
};
util.extend(mabi.MagicDamage, mabi.Expression);



// ----------------------------------------------------------------------

/**
 * サンダー型魔法のダメージ計算式
 * @param skill サンダー SkillClass
 * @param options {
 *   charge: 攻撃時のチャージ数
 *   critical: 
 * }
 */
mabi.ThunderDamage = function(skill, options){
    console.assert(skill instanceof mabi.SkillClass);
    // 最後の落雷はダメージが2倍(1~4チャージでは1.5倍)

    var one = new mabi.MagicDamage(skill, {
	charge: 1,
	critical: options.critical});
    var charge = options.charge;
    this.super_.constructor.call(
	this, 
	function(c){
	    var total = 0;
	    for(var i = 0; i < charge; i++){
		var damage = one.value(c);
		if(i == 4){
		    damage *= 2;
		}else if(i == charge - 1){
		    damage *= 1.5;
		}
		total += damage;
	    }
	    return total;
	},
	options.name
    );
};

util.extend(mabi.ThunderDamage, mabi.Expression);

// ----------------------------------------------------------------------

/**
 * ボルト魔法の合体攻撃ダメージ計算式
 * 
 * @param skill0 攻撃に使用する SkillClass
 * @param skill1 攻撃に使用する SkillClass
 * @param charge 攻撃時のチャージ数
 */
mabi.FusedBoltMagicDamage = function(skill0, skill1, options){
    console.assert(skill0 instanceof mabi.SkillClass);
    console.assert(skill1 instanceof mabi.SkillClass);

    var expressions = [new mabi.MagicDamage(skill0, options),
		       new mabi.MagicDamage(skill1, options)];

    this.super_.constructor.call(
	this,
	function(c){
	    var character = c.character;
	    var mob = c.mob;

	    var damage = 0;
	    $.each(expressions, function(i, v){damage += v.value(c);});
	    damage *= 1 + character.param('fused_bolt_magic_damage');
	    return damage;
	},
	options.name
    );
};

util.extend(mabi.FusedBoltMagicDamage, mabi.Expression);
