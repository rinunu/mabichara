/**
 * ビルトインの情報を定義する
 */

/**
 * デフォルトの Weapon/Title/Skill を追加する
 */
dam.addBuiltInItems = function(){
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

/**
 * Character を作成する
 */
dam.createCharacter = function(dto){
    var c = new mabi.Character();

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
dam.addBuiltInConditions = function(){
    var seed = [['int', [100, 200, 300, 400, 500, 600]], 
	      ['weapon', ['ファイアワンド(S3)', 'クラウンアイスワンド(150式)']]];
    var template = {
    	weapon: 'ファイアワンド(S3)',
    	character: {
    	    'int': 600,
    	    ice_magic_damage: 0.15, // アイスマスタリ1
    	    fire_magic_damage: 0.15, // ファイアマスタリ1
    	    lightning_magic_damage: 0.15, // ライトニングマスタリ1
    	    bolt_magic_damage: 0.15, // ボルトマスタリ1
    	    fused_bolt_magic_damage: 0.15 // ボルト魔法
	},
    	title: 'マジックマスター'	    
    };
    dam.addCombinationConditions(seed, template, function(dto){
				     return 'Int' + dto.character['int'] + ' ' + dto.weapon;
				 });
};

