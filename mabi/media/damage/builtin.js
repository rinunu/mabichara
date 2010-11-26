/**
 * ビルトインの情報を定義する
 */

dam.name = function(name, upgrade, special){
    var options = [];
    if(upgrade) options.push(upgrade.proficiency + '式');
    if(special) options.push(special.name);
    
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
    var generator = 'maxCritical';
    // var generator = 'criticalExpectation';
    var ib = dam.skills.ICEBOLT;
    var fb = dam.skills.FIREBOLT;
    var lb = dam.skills.LIGHTNING_BOLT;
    var fbl = dam.skills.FIREBALL;
    var th = dam.skills.THUNDER;
    var is = dam.skills.ICE_SPEAR;
    var smash = dam.skills.find({name: 'スマッシュ'});
    var wc = dam.skills.find({name: 'ウォーターキャノン'});
    $.each([
        [mabi.damages.attack({name: 'アタック', generator: generator})],
        [mabi.damages.skill(smash, {name: 'スマッシュ', generator: generator})],
	[mabi.damages.skill(ib, {name: 'IB', charge: 1, generator: generator})],
	[mabi.damages.skill(fb, {name: 'FB(1チャージ)', charge: 1, generator: generator})],
	[mabi.damages.skill(fb, {name: 'FB(5チャージ)', charge: 5, generator: generator})],
	[mabi.damages.skill(lb, {name: 'LB', charge: 1, generator: generator})],
	[mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB合体(1チャージ)', charge: 1, generator: generator})],
        [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB合体(2チャージ)', charge: 2, generator: generator})],
        [mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB合体(3チャージ)', charge: 3, generator: generator})],
	[mabi.damages.fusedBolt(ib, fb, {name: 'IB+FB合体(5チャージ)', charge: 5, generator: generator})],
	[mabi.damages.fusedBolt(ib, lb, {name: 'IB+LB合体', charge: 1, generator: generator})],
	[mabi.damages.fusedBolt(fb, lb, {name: 'FB+LB合体(1チャージ)', charge: 1, generator: generator})],
	[mabi.damages.fusedBolt(fb, lb, {name: 'FB+LB合体(5チャージ)', charge: 5, generator: generator})],
	[mabi.damages.skill(fbl, {name: 'FBL', charge: 5, generator: generator})],
	[mabi.damages.skill(is, {name: 'IS(5C)', charge: 5, generator: generator})],

        [mabi.damages.skill(dam.skills.find({name: 'ウォーターキャノン'}), {name: 'ウォーターキャノン', generator: generator})],
        [mabi.damages.skill(dam.skills.find({name: 'ウォーターキャノン'}), {name: 'ウォーターキャノン(5チャージ)', charge:5, generator: generator})],
        [mabi.damages.skill(dam.skills.find({name: 'フレイマー'}), {name: 'フレイマー', generator: generator})],
        [mabi.damages.skill(dam.skills.find({name: 'フレイマー'}), {name: 'フレイマー(5チャージ)', charge:5, generator: generator})],
        [mabi.damages.skill(dam.skills.find({name: 'ヒートバスター'}), {name: 'ヒートバスター', generator: generator})]
    ], function(i, v){
        dam.parts.expressions.push(v[0]);
    });

    // weapons
    var wandSpecials = [
        null,
        {name: 'S3', effects: {sUpgradeMax: 9}},
        {name: 'R3', effects: {rUpgrade: 0.26}}
    ];
    var weapons = [
	{
	    name: '素手',
	    upgrades: [null],
            specials: [null]
        },
	{
	    name: 'アイスワンド',
	    upgrades: [null],
            specials: wandSpecials
        },
        {
	    name: 'ファイアワンド',
	    upgrades: [null],
            specials: wandSpecials
        },
        {
	    name: 'ライトニングワンド',
	    upgrades: [null],
            specials: wandSpecials
        },
        {
	    name: 'クラウンアイスワンド',
	    upgrades: [
		null,
                {
		    proficiency: 150,
		    effects: {weapon_magic_damage: 0.22}
		}, {
		    proficiency: 205,
		    effects: {weapon_magic_damage: 0.28}
		}
	    ],
            specials: wandSpecials
        },
        {
	    name: 'フェニックスファイアワンド',
	    upgrades: [
		null,
		{
		    proficiency: 245,
		    effects: {weapon_magic_damage: -0.06}
		}
            ],
            specials: wandSpecials
        },
        {
            name: '一般両手剣',
            upgrades: [null],
            specials: [
                null,
                {name: 'S3', effects: {sUpgradeMin: 10, sUpgradeMax: 21}},
                {name: 'R3', effects: {rUpgrade: 0.26}}
            ]},
        {
            name: 'シリンダー',
            upgrades: [null],
            specials: [null]
        },
        {
            name: 'ウォーターシリンダー',
            upgrades: [null],
            specials: [null]
        },
        {
            name: 'ファイアシリンダー',
            upgrades: [null],
            specials: [null]
        },
        {
            name: 'タイダルウェーブシリンダー',
            upgrades: [null],
            specials: [null]
        },
        {
            name: 'ボルケーノシリンダー',
            upgrades: [null],
            specials: [null]
        },
        {
            name: 'タワーシリンダー',
            upgrades: [null],
            specials: [null]
        }
    ];
    $.each(weapons, function(i, dto){
        var base = dam.equipments.find({name: dto.name});
        dam.combination([['upgrade', dto.upgrades], ['special', dto.specials]], function(map){
            var upgrade = map['upgrade'];
            var special = map['special'];
            var weapon = base.create();
            if(upgrade) weapon.addChild(new mabi.Element(upgrade), 'upgrade');
            if(special) weapon.addChild(new mabi.Element(special), 'special');

            var weapons = new mabi.EquipmentSet;
            weapons.setRightHand(weapon);
            weapons.setName(dam.name(base.name(), upgrade, special));
            dam.parts.weapons.push(weapons);
        });
    });

    // protectors
    var protectors = [
        {name: '防具なし', effects: {}},
        {name: '火練金ダメ59', effects: {fireAlchemyDamage:
                                         13 // シリンダー改造
                                         + 12 // シリンダーp: シナジー
                                         + 8 // 足p: 熱い
                                         + 6 * 2 // アクセp 加熱された
                                         + 6 // 頭s: 火炎
                                         + 5 // 手p: スパーク
                                         + 3 // 盾p: スチーム
                                        }},
        {name: '水練金133', effects: {waterAlchemyDamage:
                                      27 // シリンダー改造
                                      + 27 + 7 // シリンダー: 湿った/リプル
                                      + 7 // 足: /リプル
                                      + (9 + 10) * 2 // アクセp 透明な/タイダル
                                      + 7 // 頭: /リプル
                                      + 7 // 手: /リプル
                                      + 6 + 7 // 盾: スチーム/リプル
                                     }},
        {name: 'クレシダ+火練金59', effects: {
            fireAlchemyDamage: 13 + 12 + 8 + 6 * 2 + 6 + 5 + 3,
            waterCannonDamage: 0.15,
            flameBurstDamage: 0.15
        }},
        {name: 'クレシダ+水練金133', effects: {
            waterAlchemyDamage: 133,
            waterCannonDamage: 0.15,
            flameBurstDamage: 0.15
        }},
        {name: '最大100', effects: {damageMax: 100}},
        {name: '最大150', effects: {damageMax: 150}},
        {name: '最大200', effects: {damageMax: 200}},
        {name: '最大250', effects: {damageMax: 250}},
        {name: '最大300', effects: {damageMax: 300}},
        {name: '最大350', effects: {damageMax: 350}},
        {name: '最大400', effects: {damageMax: 400}},
        {name: '最大450', effects: {damageMax: 450}},
        {name: '最大500', effects: {damageMax: 500}}
    ];
    $.each(protectors, function(i, v){
	var equipmentSet = new mabi.EquipmentSet();
	equipmentSet.setName(v.name);
        equipmentSet.setHead(new mabi.EquipmentClass({effects: v.effects}).create());
	dam.parts.protectors.push(equipmentSet);
    });

    // titles
    dam.parts.titles.push(new mabi.Title({name: '一般タイトル'}));
    var titles = [
        'マジックマスター',
        'アルケミマスター',
        'ウォーターアルケミマスター',
        'ファイアアルケミマスター'
    ];
    $.each(titles, function(i, v){
	dam.parts.titles.push(dam.titles.find({name: v}));
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
	['ゴールドボーンファイター', 2240, 61, 0.3],

        ['グール(白色・強化)', 0, 13, 0.5],
        ['ホローナイト(強化)', 0, 33, 0.5],
        ['レッドゴーストキング', 0, 100, 0.7],
        ['ガスト', 12000, 800, 0.20],
        ['レッドガスト', 15000, 500, 0.20],
        ['ブルーガスト', 12000, 1000, 0.20]
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
    var data = new mabi.OffenseDefenseDamageSource;

    var offenses = [];
    // var bodies = ['int500', 'int600'];
    // var weapons = ['クラウンアイスワンド'];
    // var protectors = ['防具なし'];
    // var titles = ['マジックマスター'];
    // var expressions = ['IB+FB合体(2チャージ)', 'IB+FB合体(3チャージ)'];
    // dam.combination([
    //     ['body', bodies],
    //     ['weapons', weapons],
    //     ['protectors', protectors],
    //     ['title', titles],
    //     ['expression', expressions]
    // ], function(map){
    //     offenses.push({
    //         body: dam.parts.bodies.find({name: map['body']}),
    //         weapons: dam.parts.weapons.find({name: map['weapons']}),
    //         protectors: dam.parts.protectors.find({name: map['protectors']}),
    //         title: dam.parts.titles.find({name: map['title']}),
    //         expression: dam.parts.expressions.find({name: map['expression']})
    //     });
    // });
    $.each([['str0', 'スマッシュ', '最大400', '一般タイトル', '一般両手剣'],
            ['str0', 'スマッシュ', '最大400', '一般タイトル', '一般両手剣(S3)'],
            ['str0', 'スマッシュ', '最大400', '一般タイトル', '一般両手剣(R3)'],
            ['int700', 'IB+FB合体(5チャージ)', '防具なし', 'マジックマスター',
             'クラウンアイスワンド(R3)'],
            ['int700', 'FBL', '防具なし', 'マジックマスター', 'クラウンアイスワンド(R3)'],
            ['str0', 'ヒートバスター', '防具なし', 'アルケミマスター', 'タワーシリンダー']],
           function(i, v){
               offenses.push({
                   body: dam.parts.bodies.find({name: v[0]}),
                   weapons: dam.parts.weapons.find({name: v[4]}),
                   protectors: dam.parts.protectors.find({name: v[2]}),
                   title: dam.parts.titles.find({name: v[3]}),
                   expression: dam.parts.expressions.find({name: v[1]})
               });
           });
    
    data.setOffenses(offenses);

    var defenses = [];
    $.each([
        'グール(白色・強化)',
        'ホローナイト(強化)',
        'レッドゴーストキング',
        'ガスト',
        'レッドガスト',
        'ブルーガスト'
    ], function(i, v){
        defenses.push({
            mob: dam.parts.mobs.find({name: v})
        });
    });
    data.setDefenses(defenses);
    
    context.setDamageData(data);
    context.setRowFields([dam.fields.MOB]);
    context.setColumnFields([dam.fields.BODY, dam.fields.PROTECTORS, dam.fields.TITLE,
                             dam.fields.WEAPONS, dam.fields.EXPRESSION]);
};