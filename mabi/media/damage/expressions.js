/**
 * 各種計算式を定義する
 */

// ----------------------------------------------------------------------
// ファクトリー

/**
 * 共通的な引数は以下のとおり
 * @param options {
 *   charge:,
 *   generator: 実ダメージを生成する('max', 'min', 'maxCritical', 'expectation')
 *   デフォルトは max
 * }
 */
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
     * スキル1発分のダメージを計算する
     */
    skill: function(skill, options){
        options = $.extend({}, options);
        
        return new mabi.Expression(function(c){
            options = $.extend(options, c);
	    return mabi.expressions.skillDamage(skill, options);
	}, options.name);
    },

    /**
     * 複数ヒットする攻撃のダメージを計算する
     */
    thunder: function(skill, options){
        if(skill.name() == 'サンダー'){
            return new mabi.Expression(function(c){
                options = $.extend(options, c);
	        return mabi.expressions.thunderDamage(skill, options);
	    }, options.name);
        }else{
            throw 'error';
        }
    },

    /**
     * ボルト魔法の合体攻撃ダメージ計算式
     */
    fusedBolt: function(skill0, skill1, options){
        return new mabi.Expression(function(c){
            options = $.extend(options, c);
	    return mabi.expressions.fusedBoltDamage(skill0, skill1, options);
	}, options.name);
    }
};

// ----------------------------------------------------------------------
// private

mabi.expressions = {
    
    // ----------------------------------------------------------------------
    // min, max から実際のダメージを決定する
    
    /**
     * 期待値を計算する(バランス80, クリなし 前提)
     */
    gen_expectation: function(damage, character){
        var min = damage[0];
        var max = damage[1];
        var noncri = (max - min) * 0.7514 + min; // 正確じゃない。。
        return noncri;
    },
    
    /**
     * 期待値を計算する(バランス80, クリ30% 前提)
     */
    gen_criticalExpectation: function(damage, character){
        var min = damage[0];
        var max = damage[1];
        var noncri = (max - min) * 0.7514 + min; // 正確じゃない。。
        return noncri * 0.7 + this.critical(noncri, max, character) * 0.3;
    },
    
    /**
     * 最小値+クリティカルが発生しなかったものとして計算する
     */
    gen_max: function(damage, character){
        return damage[1];
    },

    /**
     * 最小値+クリティカルが発生しなかったものとして計算する
     */
    gen_min: function(damage, character){
        return damage[0];
    },
    
    /**
     * 最大値+クリティカルが発生したものとして計算する
     */
    gen_maxCritical: function(damage, character){
        return this.critical(damage[1], damage[1], character);
    },
    
    // ----------------------------------------------------------------------

    /**
     * 実ダメージを生成する
     */
    generate : function(damage, options){
        return this['gen_' + options.generator](damage, options.character);
    },

    /**
     * str から[min, max] ダメージを求める
     *
     * Str 増加値から最大ダメージを求める用途には使用できない(-10 しているため)
     */
    strToDamage : function(str){
        if(str < 10) return [0, 0];

        str -= 10;
	return [str / 3, str / 2.5];
    },

    /**
     * 基本ダメージにクリティカルをのせる
     */
    critical: function(base, max, character){
        // console.log(character.rUpgrade());
        return base + max * (1.5 + character.rUpgrade());
    },
    
    /**
     * 本体のダメージ値を取得する
     * 
     * 以下のものは除外する
     * - 武器/武器エンチャントのダメージ
     * - str/dex による最大ダメージ上昇
     */
    characterDamage: function(character){
        var equipmentSet = character.equipmentSet();
        var result = [0, 0];
        equipmentSet.eachChild(function(e){
            if(e instanceof mabi.Equipment && (e.is('rightHand') || e.is('twoHand'))){
                return;
            }
            result[0] += e.damageMin(character);
            result[1] += e.damageMax(character);
        });
        return result;
    },

    /**
     * 武器のダメージを計算する
     */
    weaponDamage: function(weapon, character){
        return [weapon.damageMin(character) + weapon.sUpgradeMin(),
                weapon.damageMax(character) + weapon.sUpgradeMax()];
    },

    add: function(a, b){
        if(typeof b == 'number'){
            a[0] += b;
            a[1] += b;
        }else{
            a[0] += b[0];
            a[1] += b[1];
        }
    },
    
    multiply: function(a, v){
        a[0] *= v;
        a[1] *= v;
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

    // ----------------------------------------------------------------------
    // 各種ダメージを計算するための関数群
    //
    // 各関数に共通な引数は以下のとおり
    //
    // @param options {
    //   generator:
    //   character:,
    //   mob:,
    //   charge:,
    // }

    defaultOptions: function(){
        return {
            charge: 1,
            generator: 'max'
        };
    },

    /**
     * 最終的なダメージを決定する
     *
     * ダメージがマイナスなら 1 とする
     */
    hit: function(damage){
        return damage > 1 ? damage : 1;
    },

    /**
     * ベースとなるダメージから、最終的なダメージの計算を行う
     * 以下のものを考慮する
     * - min, max から実ダメージ決定
     * - クリティカル
     * - 防御・保護
     *
     * @param options {
     *   共通的な引数に加え
     *   damage: ベースとなるダメージ[min, max]
     *   defense: 防御。 未指定の場合は mob のものを使用する
     *   extraDamage: 追加ダメージ。 防御保護無視ダメージ(デフォルト0)
     *   multiplier: 最終ダメージに乗算される係数(デフォルト1)
     * }
     */
    basicDamage: function(options){
        var character = options.character;
	var mob = options.mob;
	var defense = options.defense !== undefined ? options.defense : mob.defense();
	var protection = mob.protection();
        var damage = this.generate(options.damage, options);
        var extraDamage = options.extraDamage || 0;
        var multiplier = options.multiplier || 1;
        
	damage = ((damage - defense) * (1 - protection) + extraDamage) * multiplier;
        return damage;
    },
    
    /**
     * スキル1発のダメージを計算する
     */
    skillDamage: function(skill, options){
        console.assert(skill instanceof mabi.SkillClass);
        if(skill.is('melee')){
            return this.meleeDamage(skill, options);
        }else if(skill.is('magic')){
            return this.magicDamage(skill, options);
        }else if(skill.is('alchemy')){
            return this.alchemyDamage(skill, options);
        }
        throw 'スキルのカテゴリが不正です: ' + skill.name();
    },

    /**
     * 近接スキル1発のダメージを計算する
     * @param skill 未指定の場合はアタックダメージを計算する
     */
    meleeDamage: function(skill, options){
        options = $.extend(this.defaultOptions(), options);
        var this_ = this;
	var character = options.character;
        var baseDamage = this.strToDamage(character.str());
        this.add(baseDamage, this.characterDamage(character));

        var weapons = []; // 攻撃を行う武器
        var skillMultiplier = 1;
        if(skill){
            skillMultiplier = this.skillMultiplier(skill, character);
            $.each([character.equipmentSet().rightHand(),
                    character.equipmentSet().leftHand()], function(i, v){
                        if(v && (v.is('twoHand') || v.is('rightHand'))){
                            weapons.push(v);
                        }
                    });
        }else{
            weapons.push(options.weapon || character.equipmentSet().rightHand());
        }

        $.each(weapons, function(i, weapon){
            var weaponDamage = this_.weaponDamage(weapon, character);
            this_.add(baseDamage, weaponDamage);
        });

        this.multiply(baseDamage, skillMultiplier);
        
	return this.hit(this.basicDamage($.extend({
	    damage: baseDamage
	}, options)));
    },

    rangedDamage: function(options){
        options = $.extend(this.defaultOptions(), options);
    },

    /**
     * 基本的な魔法ダメージを計算する
     */
    basicMagicDamage: function(skill, options){
        options = $.extend(this.defaultOptions(), options);
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
	var b = 1 + character.param('weapon_magic_damage') + character.param('magic') / 100.0;

	// todo ダメージエンチャントボーナス
	var enchantBonus = 0;

	// 特別改造魔法ダメージボーナス
	var specialUpgradeBonus = character.sUpgradeMax();

	var baseDamage = character.body().skill(skill).damage();
        this.multiply(baseDamage, fullChargeBonus);
	this.add(baseDamage, [wandBonus, wandBonus]);
        this.multiply(baseDamage, chargeBonus);
        this.add(baseDamage, [enchantBonus, enchantBonus]);

        return this.basicDamage($.extend({
            damage: baseDamage,
            extraDamage: specialUpgradeBonus,
            multiplier: a * b * 1.1,
            defense: 0
        }, options));
    },

    /**
     * 1ヒット分の魔法ダメージを計算する(合体魔法以外)
     */
    magicDamage: function(skill, options){
        return this.hit(this.basicMagicDamage(skill, options));
    },

    fusedBoltDamage: function(skill0, skill1, options){
        console.assert(skill0 instanceof mabi.SkillClass);
        console.assert(skill1 instanceof mabi.SkillClass);

	var character = options.character;

	var damage = 0;
        damage += this.basicMagicDamage(skill0, options);
	damage += this.basicMagicDamage(skill1, options);
	damage *= 1 + character.param('fused_bolt_magic_damage');
	return this.hit(damage);
    },

    thunderDamage: function(skill, options){
        options = $.extend(this.defaultOptions(), options);
        
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

    // ----------------------------------------------------------------------
    // 錬金術

    /**
     * 錬金術ダメージを計算する
     */
    alchemyDamage: function(skill, options){
        var this_ = this;
        options = $.extend(this.defaultOptions(), options);
        console.assert(skill instanceof mabi.Skill);

	var character = options.character;
	var mob = options.mob;
        var charge = options.charge;
        var weapon = character.equipmentSet().rightHand();
        skill = character.body().skill(skill);

        if(!weapon) throw '武器を装備してください';

        var alchemyEfficiency = character.param('alchemyEfficiency');
	$.each(mabi.Alchemy.ELEMENTS, function(i, v){
	    if(skill.is(v)){
                alchemyEfficiency += character.param(v + 'AlchemyEfficiency');
	    }
	});

        var chargeBonus = charge;
        if(skill.is('fullChargeBonus') && charge == 5) chargeBonus = 6;

	var baseDamage = skill.damage();

        // todo * 空気抵抗係数
        
        // * チャージ補正
        this.multiply(baseDamage, chargeBonus);
        
        // + エンチャント補正
        this.add(baseDamage, this.characterDamage(character));
        this.add(baseDamage, weapon.enchants().damage());
        $.each(mabi.Alchemy.ELEMENTS, function(i, v){
	    if(skill.is(v)){
                this_.add(baseDamage, character.param(v + 'AlchemyDamage') * charge);
	    }
	});

        var extraDamage = skill.param('extraDamage') *
            alchemyEfficiency / 15;
        if(skill.is('extraChargeBonus')) extraDamage *= charge;

        // シリンダー補正
        var multiplier = 1;
        $.each(mabi.Alchemy.ELEMENTS, function(i, v){
	    if(skill.is(v)){
                multiplier += character.param('weapon' + mabi.capitalize(v) + 'AlchemyEfficiency');
	    }
	});

        // エレメンタル
        
        return this.hit(this.basicDamage($.extend({
            damage: baseDamage,
            extraDamage: extraDamage,
            multiplier: multiplier
        }, options)));
    }
};

// ----------------------------------------------------------------------


