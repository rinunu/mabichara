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

/**
 * デフォルトの Weapon/Title/Skill を追加する
 */
dam.addBuiltInItems = function(){
    var wands = [
	{
	    name: 'アイスワンド',
	    flags: ['ice'],
	    upgrades: [{}
	    ]
	},
	{
	    name: 'ファイアワンド',
	    flags: ['fire'],
	    upgrades: [{}]
	},
	{
	    name: 'ライトニングワンド',
	    flags: ['lightning'],
	    upgrades: [{}]
	},
	{
	    name: 'クラウンアイスワンド',
	    flags: ['ice'],
	    upgrades: [
		{},
		{
		    proficiency: 150,
		    effects: [
			{param: 'weapon_magic_damage', min: 0.22}
		    ]}]
	},
	{
	    name: 'フェニックスファイアワンド',
	    flags: ['fire'],
	    upgrades: [
		{},
		{
		    proficiency: 245,
		    effects: [
			{param: 'weapon_magic_damage', min: -0.06}
		    ]}]
	}
    ];

    var specials = [
	{},
	{name: 'S3', effects: [{param: 's_upgrade', min: 9}]}
    ];

    dam.combination([['wand', wands], ['special', specials]], function(map){
			var wand = map['wand'];
			var special = map['special'];
			$.each(wand.upgrades, function(i, upgrade){
				   var totalEffects = [];
				   $.each([upgrade.effects, special.effects], function(i, effects){
					      if(effects) totalEffects = totalEffects.concat(effects);
					  });
				   dam.weapons.push(new mabi.SimpleWeapon(
							{
							    name: dam.name(wand.name, upgrade.proficiency, special.name),
							    flags: wand.flags,
							    effects: totalEffects
							}));
			       });
		    });
    

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
    dam.skills.push(
	new mabi.SimpleSkillClass(
	{
	    name: 'アイススピア',
	    flags: ['ice', 'charge_bonus'],
	    ranks: [
		[{param: 'damage_max', min: 240}]
	    ]
	}));
    dam.skills.push(
	new mabi.SimpleSkillClass(
	{
	    name: 'サンダー',
	    flags: ['lightning'],
	    ranks: [
		[{param: 'damage_max', min: 400}]
	    ]
	}));
};

/**
 * Character を作成する
 */
dam.createCharacter = function(dto){
    var c = new mabi.Character(dto);

    $.each(dto, function(k, v){
	       c.setParam(k, v);
	   });
    return c;
};

/**
 * 組み合わせを生成、各組み合わせごとに fn を呼び出す
 * 
 * fn の引数はマップである。
 * 
 * @param i seed のインデックス。 これ以降の seed について組み合わせを生成する
 * @param map 現在の組み合わせ結果
 */
dam.combination = function(seed, fn, i, map){
    i = i === undefined ? 0 : i;
    map = map || {};
    var param = seed[i][0];
    var values = seed[i][1];
    if(i == seed.length - 1){
	$.each(values, function(j, value){
		   map[param] = value;
		   fn(map);
	       });
    }else{
	$.each(values, function(j, value){
		   map[param] = value;
		   dam.combination(seed, fn, i + 1, map);
	       });
    }
};

/**
 * template から実際の Condition を生成する
 * params に指定されたフィールドは、 params で上書きする
 * 
 * @param nameFn 名前を生成する関数
 */
dam.createCondition = function(template, params, nameFn){
    var characterTemplate = template.character;

    $.each(params, function(k, v){
	       if(k in characterTemplate){
		   // console.log(k + 'を character に設定します');
		   characterTemplate[k] = v;
	       }else if(k in template){
		   // console.log(k + 'を template に設定します');
		   template[k] = v;
	       }
	   });
    template.name = nameFn(template);
    var dto = {
	name: template.name,
	character: dam.createCharacter(template.character),
	weapon: dam.weapons.get(template.weapon),
	title: dam.titles.get(template.title)
    };
    // console.log(dto);
    var condition = new mabi.Condition(dto);
    return condition;
};

/**
 * seed を元に、組み合わせを生成し、その組み合わせ毎に Condition を生成する
 * 
 * @param seed 組み合わせデータ
 * @param template テンプレート
 * @param nameFn 名前を生成する関数
 */
dam.addCombinationConditions = function(seed, template, nameFn){
    dam.combination(seed, function(map){
			console.log(map['int'], map['weapon']);
			var condition = dam.createCondition(template, map, nameFn);
			dam.conditions.push(condition);
		    });
};

/**
 * デフォルトの Condition を追加する
 */
// dam.addBuiltInConditions = function(){
//     dam.addCombinationConditions(seed, template, function(dto){
// 				     return 'Int' + dto.character['int'] + ' ' + dto.weapon;
// 				 });
// };

dam.setDefaultContext = function(context){
    var ib = dam.skills.get('アイスボルト').create(1);
    var fb = dam.skills.get('ファイアボルト').create(1);
    var lb = dam.skills.get('ライトニングボルト').create(1);
    var fbl = dam.skills.get('ファイアボール').create(1);
    var th = dam.skills.get('サンダー').create(1);
    var is = dam.skills.get('アイススピア').create(1);
    $.each([
	[new mabi.MagicDamage(ib, {name: 'IB', charge: 1})],
	[new mabi.MagicDamage(fb, {name: 'FB(1C)', charge: 1})],
	[new mabi.MagicDamage(fb, {name: 'FB(5C)', charge: 5})],
	[new mabi.MagicDamage(lb, {name: 'LB', charge: 1})],
	[new mabi.FusedBoltMagicDamage(ib, fb, {name: 'IB+FB(1C)', charge: 1})],
	[new mabi.FusedBoltMagicDamage(ib, fb, {name: 'IB+FB(5C)', charge: 5})],
	[new mabi.FusedBoltMagicDamage(ib, lb, {name: 'IB+LB', charge: 1})],
	[new mabi.FusedBoltMagicDamage(fb, lb, {name: 'FB+LB(1C)', charge: 1})],
	[new mabi.FusedBoltMagicDamage(fb, lb, {name: 'FB+LB(5C)', charge: 5})]
	// [new mabi.MagicDamage(fbl, {name: 'FBL', charge: 5})],
	// [new mabi.MagicDamage(is, {name: 'IS(5C)', charge: 5})],
	// [new mabi.ThunderDamage(th, {name: 'TH(5C)', charge: 5})]
    ], function(i, v){
	context.addExpression(v[0]);
    });

    var weapons = [
	// 'アイスワンド', 
	// 'クラウンアイスワンド(150式)',
	// 'クラウンアイスワンド(150式 S3)',
	'ファイアワンド', 
	'ファイアワンド(S3)'
	// 'フェニックスファイアワンド(245式)', 
	// 'フェニックスファイアワンド(245式 S3)',
	// 'ライトニングワンド',
	// 'ライトニングワンド(S3)'
    ];
    $.each(weapons, function(i, v){
	context.addEquipmentSet(dam.weapons.get(v));
    });

    var ints = ['int', [200, 300, 400, 500, 600, 700, 800, 900]];
    var template = {
    	'int': 600,
    	ice_magic_damage: 0.15, // アイスマスタリ1
    	fire_magic_damage: 0.15, // ファイアマスタリ1
    	lightning_magic_damage: 0.15, // ライトニングマスタリ1
    	bolt_magic_damage: 0.15, // ボルトマスタリ1
    	fused_bolt_magic_damage: 0.15 // ボルト魔法
    };
    dam.combination([ints], function(map){
	template.name = 'Int' + map['int'];
	template['int'] = map['int'];
	var character = dam.createCharacter(template);
	context.addCharacter(character);
    });

    var mob = new mabi.Element({
	effects:[
	    {param: 'protection', min: 0.1}
	]});
    context.setMob(mob);

    context.setRowFields([dam.fields.CHARACTER]);
    // context.setRowFields([dam.fields.CHARACTER]);
    // context.setColumnFields([dam.fields.EXPRESSION]);
    context.setColumnFields([dam.fields.EXPRESSION, dam.fields.EQUIPMENT_SET]);
};