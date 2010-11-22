/**
 * ビルトインの情報を定義する
 */

/**
 * デフォルトのパーツを作成する
 */
dam.setDefaultParts = function(context){
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
        [mabi.damages.attack({name: 'アタック', generator: generator})],
        [mabi.damages.skill(smash, {name: 'スマッシュ', generator: generator})],
	[mabi.damages.skill(ib, {name: 'IB', charge: 1, generator: generator})],
	[mabi.damages.skill(fb, {name: 'FB(1C)', charge: 1, generator: generator})],
	[mabi.damages.skill(fb, {name: 'FB(5C)', charge: 5, generator: generator})],
	[mabi.damages.skill(lb, {name: 'LB', charge: 1, generator: generator})],
	[mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(1C)', charge: 1, generator: generator})],
        [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(2C)', charge: 2, generator: generator})],
        [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(3C)', charge: 3, generator: generator})],
	[mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB(5C)', charge: 5, generator: generator})],
	[mabi.damages.fusedBolt(ib, lb, {name: 'IB+LB', charge: 1, generator: generator})],
	[mabi.damages.fusedBolt(fb, lb, {name: 'FB+LB(1C)', charge: 1, generator: generator})],
	[mabi.damages.fusedBolt(fb, lb, {name: 'FB+LB(5C)', charge: 5, generator: generator})],
	[mabi.damages.skill(fbl, {name: 'FBL', charge: 5, generator: generator})],
	[mabi.damages.skill(is, {name: 'IS(5C)', charge: 5, generator: generator})]
    ], function(i, v){
        dam.parts.expressions.push(v[0]);
    });

    // weapons
    var weapons = [
	'アイスワンド',
	'クラウンアイスワンド',
	'ファイアワンド',
	'フェニックスファイアワンド',
	'ライトニングワンド'
    ];
    $.each(weapons, function(i, v){
	var weapon = dam.equipments.find({name: v}).create();
        var weapons = new mabi.EquipmentSet;
        weapons.setRightHand(weapon);
        weapons.setName(v);
        dam.parts.weapons.push(weapons);
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

    // protectors
    var protectors = [
        {name: '裸'},
        {name: 'マジックマスター', title: 'マジックマスター'}
    ];
    $.each(protectors, function(i, v){
	var equipmentSet = new mabi.EquipmentSet();
	equipmentSet.setName(v.name);
        if(v.title) equipmentSet.setTitle(dam.titles.find({name: v.title}));
	dam.parts.protectors.push(equipmentSet);
    });

    // bodies
    var stats = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    var template = {effects:{}};
    $.each(stats, function(i, v){
        template.name = 'int' + v;
        // template.str = v;
        // template.dex = v;
        template.effects['int'] = v;
        
        var body = new mabi.Body(template);
        dam.skills.each(function(i, v){
            body.setSkill(v, 1);
        });

        dam.parts.bodies.push(body);
    });

    // mob
    $.each([
        ['防御保護0', 1000, 0, 0],
        ['ブロンズボーンアーチャー', 960, 42, 0.19],
	['シルバーボーンアーチャー', 1040, 42, 0.19],
	['ゴールドボーンアーチャー', 1160, 50, 0.22],
	
	['ブロンズボーンランサー', 1320, 46, 0.27],
	['シルバーボーンランサー', 1440, 46, 0.27],
	['ゴールドボーンランサー', 1640, 55, 0.3],
	
	['ブロンズボーンファイター', 1800, 52, 0.27],
	['シルバーボーンファイター', 1960, 52, 0.27],
	['ゴールドボーンファイター', 2240, 61, 0.3]
    ], function(i, v){
	var mob = new mabi.Mob({
	    name: v[0],
	    effects: {
		defense: v[2],
		protection: v[3]
	    }
        });
        dam.parts.mobs.push(mob);
    });
};

/**
 * Context にデフォルト値を設定する
 */
dam.setDefaultContext = function(context){
    var data = new mabi.OffenseDefenseDamageData;

    var bodies = ['int500', 'int600'];
    var weapons = ['クラウンアイスワンド'];
    var protectors = ['裸'];
    var expressions = ['IB+FB(2C)', 'IB+FB(3C)'];
    var offenses = [];
    dam.combination([
        ['body', bodies],
        ['weapons', weapons],
        ['protectors', protectors],
        ['expression', expressions]
    ], function(map){
        offenses.push({
            body: dam.parts.bodies.find({name: map['body']}),
            weapons: dam.parts.weapons.find({name: map['weapons']}),
            protectors: dam.parts.protectors.find({name: map['protectors']}),
            expression: dam.parts.expressions.find({name: map['expression']})
        });
    });
    data.setOffenses(offenses);

    var defenses = [];
    $.each([
	'ゴールドボーンファイター'
        ], function(i, v){
            defenses.push({
                mob: dam.parts.mobs.find({name: v})
            });
	});
    data.setDefenses(defenses);
    
    context.setDamageData(data);
    context.setRowFields([dam.fields.BODY]);
    context.setColumnFields([dam.fields.WEAPONS, dam.fields.PROTECTORS, dam.fields.EXPRESSION, dam.fields.MOB]);
};