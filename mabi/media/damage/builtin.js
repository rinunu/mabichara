/**
 * ビルトインの情報を定義する
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
	{
	    name: 'アイスワンド',
	    upgrades: [{}]
	}, {
	    name: 'ファイアワンド',
	    upgrades: [{}]
	}, {
	    name: 'ライトニングワンド',
	    upgrades: [{}]
	}, {
	    name: 'クラウンアイスワンド',
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
	    upgrades: [
		{},
		{
		    proficiency: 245,
		    effects: {weapon_magic_damage: -0.06}
		}]
	}, {
            name: '両手剣', upgrades: [{}]
        }, {
            name: 'ウォーターシリンダー', upgrades: [{}]
        }, {
            name: 'ファイアシリンダー', upgrades: [{}]
        }, {
            name: 'ボルケーノシリンダー', upgrades: [{}]
        }, {
            name: 'タワーシリンダー', upgrades: [{}]
        }
    ];
    var specials = [
        {},
        {name: 'S3', effects: {sUpgradeMax: 9}},
        {name: 'R3', effects: {rUpgrade: 0.26}}
    ];
    dam.combination([['weapon', weapons], ['special', specials]], function(map){
    	var dto = map['weapon'];
	var special = map['special'];
	$.each(dto.upgrades, function(i, upgrade){
            var base = dam.equipments.find({name: dto.name});
            var weapon = base.create();
            weapon.addChild(new mabi.Element(upgrade), 'upgrade');
            weapon.addChild(new mabi.Element(special), 'special');

            var weapons = new mabi.EquipmentSet;
            weapons.setRightHand(weapon);
            weapons.setName(dam.name(base.name(), upgrade.proficiency, special.name));
            dam.parts.weapons.push(weapons);
        });
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
        {name: '裸', effects: {}},
        {name: 'マジックマスター', title: 'マジックマスター', effects: {}},
        {name: '最大100', effects: {damageMax: 100}},
        {name: '最大150', effects: {damageMax: 150}},
        {name: '最大200', effects: {damageMax: 200}},
        {name: '最大250', effects: {damageMax: 250}},
        {name: '最大300', effects: {damageMax: 300}},
        {name: '最大350', effects: {damageMax: 350}},
        {name: '最大400', effects: {damageMax: 400}}
    ];
    $.each(protectors, function(i, v){
	var equipmentSet = new mabi.EquipmentSet({effects: v.effects});
	equipmentSet.setName(v.name);
        if(v.title) equipmentSet.setTitle(dam.titles.find({name: v.title}));
	dam.parts.protectors.push(equipmentSet);
    });

    // bodies
    var values = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    var names = ['str', 'dex', 'int'];
    var template = {effects:{}};
    dam.combination([['name', names], ['value', values]], function(map){
        var name = map['name'];
        var value = map['value'];
        template.name = name + value;
        template.effects[name] = value;
        
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