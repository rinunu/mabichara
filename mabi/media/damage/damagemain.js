/**
 * ダメージ計算固有の変数用名前空間
 */
var dam = {};

/**
 * デフォルトの Condition を追加する
 */
dam.pushConditions = function(){
    dam.conditions.push({name: 'Int500'});
    dam.conditions.push({name: 'Int400'});
    dam.conditions.push({name: 'Int300'});
    dam.conditions.push({name: 'Str200 猫装備'});
};

/**
 * デフォルトの Weapon/Title/Skill を追加する
 */
dam.pushBuiltInItems = function(){
    dam.weapons.push(
	new mabi.SimpleWeapon(
	{
	    name: 'クラウンアイスワンド(150式)',
	    flags: ['ice'],
	    effects: [
		{param: 'weapon_magic_damage', min: 0.22}
	    ]
	})),
    dam.weapons.push(
	new mabi.SimpleWeapon(
	{
	    name: 'フェニックスファイアワンド(245式)',
	    flags: ['fire'],
	    effects: [
		{param: 'weapon_magic_damage', min: -0.06}
	    ]
	}));
    dam.weapons.push(
	new mabi.SimpleWeapon(
	{
	    name: 'フェニックスファイアワンド(245式,S3)',
	    flags: ['fire'],
	    effects: [
		{param: 'weapon_magic_damage', min: -0.06},
		{param: 's_upgrade', min: 9}
	    ]
	}));
    dam.weapons.push(
	new mabi.SimpleWeapon(
	{
	    name: 'ファイアワンド(S3)',
	    flags: ['fire'],
	    effects: [
		{param: 's_upgrade', min: 9}
	    ]
	}));

    dam.titles.push(
	new mabi.SimpleWeapon(
	{
	    name: 'マジックマスター',
	    effects: [
		{param: 'magic_damage', min: 0.05}
	    ]
	}
	));

    dam.skills.push(
	new mabi.SimpleSkillClass(
	{
	    name: 'アイスボルト',
	    flags: ['ice', 'bolt'],
	    ranks: [
		[{param: 'damage_max', min: 80}]
	    ]
	}));
    dam.skills.push(
	new mabi.SimpleSkillClass(
	{
	    name: 'ファイアボルト',
	    flags: ['fire', 'bolt', 'charge_bonus'],
	    ranks: [
		[{param: 'damage_max', min: 120}]
	    ]
	}));
    dam.skills.push(
	new mabi.SimpleSkillClass(
	{
	    name: 'ライトニングボルト',
	    flags: ['lightning', 'bolt'],
	    ranks: [
		[{param: 'damage_max', min: 150}]
	    ]
	}));
    dam.skills.push(
	new mabi.SimpleSkillClass(
	{
	    name: 'ファイアボール',
	    flags: ['fire'],
	    ranks: [
		[{param: 'damage_max', min: 2400}]
	    ]
	}));
};

dam.initializeModel = function(){
    dam.conditions = new mabi.Conditions;
    dam.weapons = new mabi.Elements;
    dam.titles = new mabi.Elements;
    dam.skills = new mabi.Elements;

    dam.pushConditions();
    dam.pushBuiltInItems();
};

dam.initializeView = function(){
    $(".tabs").tabs();
    $(":button").button();
    $(":checkbox").button();

    dam.damageTable = new mabi.DamageTable($('table.damage'), dam.conditions);
    dam.menu = new mabi.Menu($('.menu'));

    for(var i in mabi){
	if(mabi[i].initialize){
	    mabi[i].initialize();
	}
    }

    $('form').dialog();
};

dam.initialize = function(){
    dam.initializeModel();
    dam.initializeView();
};

