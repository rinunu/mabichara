/**
 * ビルトインの情報を定義する
 */

dam.setDefaultContext = function(context){
    var data = new mabi.CombinationDamageData;

    // Expression
    // var generator = 'max';
    // var generator = 'maxCritical';
    var generator = 'criticalExpectation';
    var ib = dam.skills.ICEBOLT;
    var fb = dam.skills.FIREBOLT;
    var lb = dam.skills.LIGHTNING_BOLT;
    var fbl = dam.skills.FIREBALL;
    var th = dam.skills.THUNDER;
    var is = dam.skills.ICE_SPEAR;
    var smash = dam.skills.find({name: 'スマッシュ'});
    $.each([
        // [mabi.damages.attack({name: 'アタック', generator: generator})],
        // [mabi.damages.skill(smash, {name: 'スマッシュ', generator: generator})]
        
	// [mabi.damages.skill(ib, {name: 'IB', charge: 1, generator: generator})],
	// [mabi.damages.skill(fb, {name: 'FB(1C)', charge: 1, generator: generator})],
	// [mabi.damages.skill(fb, {name: 'FB(5C)', charge: 5, generator: generator})],
	// [mabi.damages.skill(lb, {name: 'LB', charge: 1, generator: generator})],
	// [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(1C)', charge: 1, generator: generator})],
        [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(2C)', charge: 2, generator: generator})],
        [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(3C)', charge: 3, generator: generator})]
	// [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(5C)', charge: 5, generator: generator})]
	// [mabi.damages.fusedBolt(ib, lb, {name: 'IB+LB', charge: 1, generator: generator})],
	// [mabi.damages.fusedBolt(fb, lb, {name: 'FB+LB(1C)', charge: 1, generator: generator})],
	// [mabi.damages.fusedBolt(fb, lb, {name: 'FB+LB(5C)', charge: 5, generator: generator})]
	// [mabi.damages.skill(fbl, {name: 'FBL', charge: 5, generator: generator})]
	// [mabi.damages.skill(is, {name: 'IS(5C)', charge: 5, generator: generator})],
	// [mabi.damages.thunder(th, {name: 'TH(5C)', charge: 5, generator: generator})]
    ], function(i, v){
	data.addExpression(v[0]);
    });

    // EquipmentSet
    var weapons = [
	// 'アイスワンド', 
	'クラウンアイスワンド(150式)',
	'クラウンアイスワンド(150式 S3)',
        'クラウンアイスワンド(150式 R3)'
	// 'クラウンアイスワンド(205式)',
	// 'クラウンアイスワンド(205式 S3)'
	// 'ファイアワンド', 
	// 'ファイアワンド(S3)',
        // 'ファイアワンド(R3)'
	// 'フェニックスファイアワンド(245式)', 
	// 'フェニックスファイアワンド(245式 S3)',
	// 'ライトニングワンド',
	// 'ライトニングワンド(S3)'
    ];
    $.each(weapons, function(i, v){
	var equipmentSet = new mabi.EquipmentSet();
	equipmentSet.setName(v);
	equipmentSet.setRightHand(dam.equipments.get(v));
	equipmentSet.setTitle(dam.titles.find({name: 'マジックマスター'}));
	data.addEquipmentSet(equipmentSet);
    });

    // 近接武器
    // var weaponBase = dam.equipments.find({name: '両手剣'});
    // var equipmentSet = new mabi.EquipmentSet();
    
    // equipmentSet.setName('改造なし');
    // var e = weaponBase.create();
    // equipmentSet.setRightHand(e);
    // data.addEquipmentSet(equipmentSet);

    // equipmentSet = new mabi.EquipmentSet();
    // equipmentSet.setName('R3改造');
    // e = weaponBase.create();
    // e.setParam('rUpgrade', 0.26);
    // equipmentSet.setRightHand(e);
    // data.addEquipmentSet(equipmentSet);
    
    // equipmentSet = new mabi.EquipmentSet();
    // equipmentSet.setName('S3改造');
    // e = weaponBase.create();
    // e.setParam('sUpgradeMax', 10);
    // e.setParam('sUpgradeMax', 21);
    // equipmentSet.setRightHand(e);
    // data.addEquipmentSet(equipmentSet);

    // Character
    var abbreviations = {
        'str': 'Str',
	'int': 'Int',
	lightning_magic_damage: 'L',
	fire_magic_damage: 'F',
	ice_magic_damage: 'I'};
    var template = {
    };

    var ints = [400, 500, 600, 700, 800, 900];
    dam.combination([['int', ints]], function(map){
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

    // 近接
    // var damages = [200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420];
    // template = {
    // };
    // dam.combination([['damage', damages]], function(map){
    //     var damage = map['damage'];
    //     template.str = damage * 2.5 + 10;
    //     template.name = '最大' + damage;
    //     var body = mabi.ElementBuilder.body(template);
    //     body.setSkill(dam.skills.find({name: 'スマッシュ'}), 1);
    //     data.addBody(body);
    // });

    // MOB
    $.each([
        // ['防御保護0', 1000, 0, 0],
        // ['ブロンズボーンアーチャー', 960, 42, 0.19],
	// ['シルバーボーンアーチャー', 1040, 42, 0.19],
	// ['ゴールドボーンアーチャー', 1160, 50, 0.22],
	
	// ['ブロンズボーンランサー', 1320, 46, 0.27],
	// ['シルバーボーンランサー', 1440, 46, 0.27],
	// ['ゴールドボーンランサー', 1640, 55, 0.3],
	
	// ['ブロンズボーンファイター', 1800, 52, 0.27],
	// ['シルバーボーンファイター', 1960, 52, 0.27],
	['ゴールドボーンファイター', 2240, 61, 0.3]
        ], function(i, v){
	    var mob = new mabi.Element({
		name: v[0] + '(HP ' + v[1] + ')',
		effects:[
		    {param: 'defense', min: v[2]},
		    {param: 'protection', min: v[3]}
		]});
	    data.addMob(mob);
	});
    
    context.setDamageData(data);
    context.setRowFields([dam.fields.BODY]);
    context.setColumnFields([dam.fields.EQUIPMENT_SET, dam.fields.EXPRESSION, dam.fields.MOB]);
};