/**
 * ビルトインの情報を定義する
 */

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

/**
 * 組み込みの Weapon/Title/Skill を追加する
 */
dam.addBuiltInItems = function(){
    dam.addBuiltInTitles();
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
	// [mabi.damages.magic(ib, {name: 'IB', charge: 1, critical: critical})],
	// [mabi.damages.magic(fb, {name: 'FB(1C)', charge: 1, critical: critical})],
	// [mabi.damages.magic(fb, {name: 'FB(5C)', charge: 5, critical: critical})],
	// [mabi.damages.magic(lb, {name: 'LB', charge: 1, critical: critical})],
	[mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(1C)', charge: 1, critical: critical})],
	// [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(5C)', charge: 5, critical: critical})],
	[mabi.damages.fusedBolt(ib, lb, {name: 'IB+LB', charge: 1, critical: critical})],
	// [mabi.damages.fusedBolt(fb, lb, {name: 'FB+LB(1C)', charge: 1, critical: critical})],
	// [mabi.damages.fusedBolt(fb, lb, {name: 'FB+LB(5C)', charge: 5, critical: critical})]
	// [mabi.damages.magic(fbl, {name: 'FBL', charge: 5, critical: critical})],
	// [mabi.damages.magic(is, {name: 'IS(5C)', charge: 5, critical: critical})],
	// [new mabi.ThunderDamage(th, {name: 'TH(5C)', charge: 5, critical: critical})]

	// [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(1C クリ)', charge: 1, critical: true})],
	[mabi.damages.fusedBolt(ib, lb, {name: 'IB+LB(クリ)', charge: 1, critical: true})]
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
	equipmentSet.setRightHand(dam.equipments.get(v));
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