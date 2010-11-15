/**
 * ビルトインの情報を定義する
 */

/**
 * 武器の名前を生成する
 */
dam.name = function(name, proficiency, special){
    var options = [];
    if(proficiency) options.push(proficiency + '式');
    if(special) options.push(special);

    if(options.length >= 1){
	name += '(';
	name += options.join(' ');
	name += ')';
    }
    return name;
};

dam.addBuiltInWands = function(){
    var wands = [
	{
	    name: 'アイスワンド',
	    flags: ['ice'],
	    upgrades: [{}]
	}, {
	    name: 'ファイアワンド',
	    flags: ['fire'],
	    upgrades: [{}]
	}, {
	    name: 'ライトニングワンド',
	    flags: ['lightning'],
	    upgrades: [{}]
	}, {
	    name: 'クラウンアイスワンド',
	    flags: ['ice'],
	    upgrades: [
		{}, {
		    proficiency: 150,
		    effects: {weapon_magic_damage: 0.22}
		}, {
		    proficiency: 205,
		    effects: {weapon_magic_damage: 0.28}
		}
	    ]
	}, {
	    name: 'フェニックスファイアワンド',
	    flags: ['fire'],
	    upgrades: [
		{},
		{
		    proficiency: 245,
		    effects: {weapon_magic_damage: -0.06}
		    }]
	}
    ];

    var specials = [
	{},
	{name: 'S3', effects: {s_upgrade: 9}}
    ];

    dam.combination([['wand', wands], ['special', specials]], function(map){
	var wand = map['wand'];
	var special = map['special'];
	$.each(wand.upgrades, function(i, upgrade){
            var base = new mabi.EquipmentClass({
		name: wand.name,
		flags: wand.flags
	    });
            var a = base.create();
            a.setName(dam.name(wand.name, upgrade.proficiency, special.name));
            a.addChild(new mabi.Element(upgrade));
            a.addChild(new mabi.Element(special));
	    dam.weapons.push(a);
	});
    });
};

dam.addBuiltInWeapons = function(){
    var src = [{
	constant: 'HAND',
	name: '素手',
	effects: {
	    damageMax: 8,
	    critical: 0.1
	}}];
    $.each(src, function(i, v){
	var a = mabi.ElementBuilder.weapon(v);
	dam.weapons.push(a);
	dam.weapons[v.constant] = a;
    });

    dam.addBuiltInWands();
};

dam.addBuiltInTitles = function(){
    var src = [
	['マジックマスター', 'MAGIC_MASTER',  {magic_damage: 0.05}]
    ];
    $.each(src, function(i, v){
	var a = new mabi.Title({
	    name: v[0],
	    effects: v[2]
	});
	dam.titles.push(a);
	dam.titles[v[1]] = a;
    });
};

dam.addBuiltInSkills = function(){
    var src = [
	['アイスボルト', 'ICEBOLT',
	 ['ice', 'bolt'],
	 [
	     [{param: 'damage_max', min: 80}]
	 ]],
	['ファイアボルト', 'FIREBOLT',
	 ['fire', 'bolt', 'charge_bonus'],
	 [
	     [{param: 'damage_max', min: 120}]
	 ]],
	['ライトニングボルト', 'LIGHTNING_BOLT',
	 ['lightning', 'bolt'],
	 [
	     [{param: 'damage_max', min: 150}]
	 ]],
	['ファイアボール', 'FIREBALL',
	 ['fire'],
	 [
	     [{param: 'damage_max', min: 2400}]
	 ]],
	['アイススピア', 'ICE_SPEAR',
	 ['ice', 'charge_bonus'],
	 [
	     [{param: 'damage_max', min: 240}]
	 ]],
	['サンダー', 'THUNDER',
	 ['lightning'],
	 [
	     [{param: 'damage_max', min: 400}]
	 ]],

	['アイスマスタリ', 'MAGIC_ICE_MASTERY',
	 [],
	 [
	     [{param: 'ice_magic_damage', min: 0.15}]
	 ]],
	['ファイアマスタリ', 'MAGIC_FIRE_MASTERY',
	 [],
	 [
	     [{param: 'fire_magic_damage', min: 0.15}]
	 ]],
	['ライトニングマスタリ', 'MAGIC_LIGHTNING_MASTERY',
	 [],
	 [
	     [{param: 'lightning_magic_damage', min: 0.15}]
	 ]],
	['ボルトマスタリ', 'MAGIC_BOLT_MASTERY',
	 [],
	 [
	     [{param: 'bolt_magic_damage', min: 0.15}]
	 ]],
	['ボルト魔法の合体', 'BOLT_COMPOSER',
	 [],
	 [
	     [{param: 'fused_bolt_magic_damage', min: 0.15}]
	 ]]
    ];

    $.each(src, function(i, v){
	var a = new mabi.SkillClass({
	    name: v[0],
	    flags: v[2],
	    ranks: v[3]
	});
	dam.skills.push(a);
	dam.skills[v[1]] = a;
    });
};

/**
 * 組み込みの Weapon/Title/Skill を追加する
 */
dam.addBuiltInItems = function(){
    dam.addBuiltInWeapons();
    dam.addBuiltInTitles();
    dam.addBuiltInSkills();
};

dam.setDefaultContext = function(context){
    var data = new mabi.CombinationDamageData;

    // Expression
    var critical = false;
    var ib = dam.skills.ICEBOLT;
    var fb = dam.skills.FIREBOLT;
    var lb = dam.skills.LIGHTNING_BOLT;
    var fbl = dam.skills.FIREBALL;
    var th = dam.skills.THUNDER;
    var is = dam.skills.ICE_SPEAR;
    $.each([
	// [new mabi.MagicDamage(ib, {name: 'IB', charge: 1, critical: critical})],
	// [new mabi.MagicDamage(fb, {name: 'FB(1C)', charge: 1, critical: critical})],
	// [new mabi.MagicDamage(fb, {name: 'FB(5C)', charge: 5, critical: critical})],
	// [new mabi.MagicDamage(lb, {name: 'LB', charge: 1, critical: critical})],
	[new mabi.FusedBoltMagicDamage(ib, fb, {name: 'IB+FB(1C)', charge: 1, critical: critical})],
	// [new mabi.FusedBoltMagicDamage(ib, fb, {name: 'IB+FB(5C)', charge: 5, critical: critical})],
	[new mabi.FusedBoltMagicDamage(ib, lb, {name: 'IB+LB', charge: 1, critical: critical})],
	// [new mabi.FusedBoltMagicDamage(fb, lb, {name: 'FB+LB(1C)', charge: 1, critical: critical})],
	// [new mabi.FusedBoltMagicDamage(fb, lb, {name: 'FB+LB(5C)', charge: 5, critical: critical})]
	// [new mabi.MagicDamage(fbl, {name: 'FBL', charge: 5, critical: critical})],
	// [new mabi.MagicDamage(is, {name: 'IS(5C)', charge: 5, critical: critical})],
	// [new mabi.ThunderDamage(th, {name: 'TH(5C)', charge: 5, critical: critical})]

	// [new mabi.FusedBoltMagicDamage(ib, fb, {name: 'IB+FB(1C クリ)', charge: 1, critical: true})],
	[new mabi.FusedBoltMagicDamage(ib, lb, {name: 'IB+LB(クリ)', charge: 1, critical: true})]
    ], function(i, v){
	data.addExpression(v[0]);
    });

    // EquipmentSet
    var weapons = [
	// 'アイスワンド', 
	'クラウンアイスワンド(150式)',
	'クラウンアイスワンド(150式 S3)',
	'クラウンアイスワンド(205式)',
	'クラウンアイスワンド(205式 S3)'
	// 'ファイアワンド', 
	// 'ファイアワンド(S3)',
	// 'フェニックスファイアワンド(245式)', 
	// 'フェニックスファイアワンド(245式 S3)',
	// 'ライトニングワンド',
	// 'ライトニングワンド(S3)'
    ];
    $.each(weapons, function(i, v){
	var equipmentSet = new mabi.EquipmentSet();
	equipmentSet.setName(v);
	equipmentSet.setRightHand(dam.weapons.get(v));
	equipmentSet.setTitle(dam.titles.MAGIC_MASTER);
	data.addEquipmentSet(equipmentSet);
    });

    // Character
    var ints = ['int', [600, 700]];
    var abbreviations = {
	'int': 'Int',
	lightning_magic_damage: 'L',
	fire_magic_damage: 'F',
	ice_magic_damage: 'I'};

    var template = {
    	'int': 600
    };
    dam.combination([ints], function(map){
	var names = [];
	$.each(map, function(k, v){
	    if(v > 1){
		names.push(abbreviations[k] + v);
	    }else if(v > 0){
		names.push(abbreviations[k] + Math.floor(v * 100));
	    }
	    template[k] = v;
	});
	template.name = names.join(' ');

	var body = mabi.ElementBuilder.body(template);
	body.setSkill(dam.skills.ICEBOLT, 1);
	body.setSkill(dam.skills.FIREBOLT, 1);
	body.setSkill(dam.skills.LIGHTNING_BOLT, 1);
	body.setSkill(dam.skills.FIREBALL, 1);
	body.setSkill(dam.skills.THUNDER, 1);
	body.setSkill(dam.skills.ICE_SPEAR, 1);

	body.setSkill(dam.skills.MAGIC_ICE_MASTERY, 1);
	body.setSkill(dam.skills.MAGIC_FIRE_MASTERY, 1);
	body.setSkill(dam.skills.MAGIC_LIGHTNING_MASTERY, 1);
	body.setSkill(dam.skills.MAGIC_BOLT_MASTERY, 1);
	body.setSkill(dam.skills.BOLT_COMPOSER, 1);

	data.addBody(body);
    });

    // MOB
    $.each(
	[['ブロンズボーンアーチャー', 960, 42, 0.19],
	 ['シルバーボーンアーチャー', 1040, 42, 0.19],
	 ['ゴールドボーンアーチャー', 1160, 50, 0.22],
	 
	 ['ブロンズボーンランサー', 1320, 46, 0.27],
	 ['シルバーボーンランサー', 1440, 46, 0.27],
	 ['ゴールドボーンランサー', 1640, 55, 0.3],
	 
	 ['ブロンズボーンファイター', 1800, 52, 0.27],
	 ['シルバーボーンファイター', 1960, 52, 0.27],
	 ['ゴールドボーンファイター', 2240, 61, 0.3]], function(i, v){
	     var mob = new mabi.Element({
		 name: v[0] + '(HP ' + v[1] + ')',
		 effects:[
		     {param: 'defense', min: v[2]},
		     {param: 'protection', min: v[3]}
		 ]});
	     data.addMob(mob);
	 });

    context.setDamageData(data);
    context.setRowFields([dam.fields.BODY, dam.fields.MOB]);
    // context.setRowFields([dam.fields.BODY]);
    // context.setColumnFields([dam.fields.EXPRESSION]);
    context.setColumnFields([dam.fields.EQUIPMENT_SET, dam.fields.EXPRESSION]);
};