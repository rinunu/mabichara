/**
 * 各種計算式を定義する
 */

// ----------------------------------------------------------------------
// ファクトリー

mabi.damages = {
    /**
     * 近接アタック1打の最大ダメージ
     * @param options {
     *   weapon: 攻撃を行う武器。
     *   右手、もしくは左手に持っている武器を指定する。
     * }
     */
    attack: function(options){
	options = $.extend({}, options);

	return new mabi.Expression(function(c){
            options = $.extend(options, c);
	    return mabi.expressions.meleeDamage(null, options);
	}, options.name);
    },

    /**
     * スキルを使用したダメージを計算する
     */
    skill: function(skill, options){
        options = $.extend({}, options);
        
        return new mabi.Expression(function(c){
            options = $.extend(options, c);
	    return mabi.expressions.skillDamage(skill, options);
	}, options.name);
    },

    /**
     * 基本的な魔法攻撃ダメージ計算式
     * 
     * @param skill 攻撃に使用する SkillClass
     * @param charge 攻撃時のチャージ
     * }
     */
    magic: function(skill, options){
        if(skill.name() == 'サンダー'){
            return new mabi.Expression(function(c){
                options = $.extend(options, c);
	        return mabi.expressions.thunderDamage(skill, options);
	    }, options.name);
        }else{
	    return new mabi.Expression(function(c){
                options = $.extend(options, c);
	        return mabi.expressions.magicDamage(skill, options);
	    }, options.name);
        }
    },


    /**
     * ボルト魔法の合体攻撃ダメージ計算式
     * 
     * @param skill0 攻撃に使用する SkillClass
     * @param skill1 攻撃に使用する SkillClass
     * @param charge 攻撃時のチャージ数
     */
    fusedBolt: function(skill0, skill1, options){
        return new mabi.Expression(function(c){
            options = $.extend(options, c);
	    return mabi.expressions.fusedBoltDamage(skill0, skill1, options);
	}, options.name);
    }
};

// ----------------------------------------------------------------------

/**
 * 各種ダメージを計算するための関数群
 */
mabi.expressions = {
    /**
     * str から最大ダメージを求める
     *
     * Str 増加値から最大ダメージを求める用途には使用できない(-10 しているため)
     */
    strToDamageMax : function(str){
	return (str - 10) / 2.5;
    },
    
    /**
     * 基本的なダメージの計算を行う
     */
    basicDamage: function(options){
	var damageMax = options.damageMax;
	var mob = options.mob;
	var critical = options.critical ? 2.5 : 1;
	var defense = mob.defense();
	var protection = mob.protection();
	return (damageMax * critical - defense) * (1 - protection);
    },

    /**
     * 本体の最大ダメージ値を取得する
     * 以下のものは除外する
     * - str/dex による最大ダメージ上昇
     * - 武器/武器エンチャントの攻撃
     */
    damageMax: function(character){
        var equipmentSet = character.equipmentSet();
        var result = 0;
        equipmentSet.eachChild(function(e){
            if(e.is('rightHand') || e.is('twoHand')){
                return;
            }
            result += e.damageMax(character);
        });
        return result;
    },

    /**
     * スキルのダメージ倍率を取得する
     */
    skillMultiplier: function(skill, character){
        console.assert(skill instanceof mabi.SkillClass);
        skill = character.body().skill(skill);
        console.assert(skill);

        var result = skill.param('damage');

        var rightHand = character.equipmentSet().rightHand();
        if(rightHand && rightHand.is('twoHand') && rightHand.is('weapon')){
            result *= 1.2;
        }

        return result;
    },

    /**
     * スキル1発のダメージを計算する
     */
    skillDamage: function(skill, options){
        console.log(skill instanceof mabi.SkillClass);
        if(skill.is('melee')){
            return this.meleeDamage(skill, options);
        }else if(skill.is('magic')){
            return this.magicDamage(skill, options);
        }
        throw 'error';
    },

    /**
     * 近接スキル1発のダメージを計算する
     * @param skill 未指定の場合はアタックダメージを計算する
     */
    meleeDamage: function(skill, options){
	var character = options.character;
        if(skill){
	    var damageMax =
	        this.strToDamageMax(character.str()) +
                this.damageMax(character);

            $.each([character.equipmentSet().rightHand(),
                   character.equipmentSet().leftHand()], function(i, v){
                       if(v && (v.is('twoHand') || v.is('rightHand'))){
                           damageMax += v.damageMax(character);
                       }
                   });

            damageMax *= this.skillMultiplier(skill, character);
        }else{
            var weapon = options.weapon || character.equipmentSet().rightHand();
            var damageMax =
                weapon.damageMax(character) +
	        this.strToDamageMax(character.str()) +
                this.damageMax(character);
        }

	return this.basicDamage($.extend({
	    damageMax: damageMax
	}, options));
    },

    rangedDamage: function(){
    },

    /**
     * 基本的な魔法ダメージを計算する
     */
    magicDamage: function(skill, options){
        console.assert(skill instanceof mabi.Skill);

	var character = options.character;
	var mob = options.mob;
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

    thunderDamage: function(skill, options){
        var oneOptions = $.extend({}, options, {charge: 1});
        var charge = options.charge;
        
        // 最後の落雷はダメージが2倍(1~4チャージでは1.5倍)
        var total = 0;
	for(var i = 0; i < charge; i++){
	    var damage = this.magicDamage(skill, oneOptions);
	    if(i == 4){
		damage *= 2;
	    }else if(i == charge - 1){
		damage *= 1.5;
	    }
	    total += damage;
	}
	return total;
    },

    fusedBoltDamage: function(skill0, skill1, options){
        console.assert(skill0 instanceof mabi.SkillClass);
        console.assert(skill1 instanceof mabi.SkillClass);

	var character = options.character;

	var damage = 0;
        damage += this.magicDamage(skill0, options);
	damage += this.magicDamage(skill1, options);
	damage *= 1 + character.param('fused_bolt_magic_damage');
	return damage;
    }

};

// ----------------------------------------------------------------------


