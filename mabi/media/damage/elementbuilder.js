
/**
 * 様々な Element を生成するためのヘルパー
 *
 * テストやサンプルデータの作成に使用する
 */
mabi.ElementBuilder = function(){
};

/**
 * @param option{
 * name:
 * lifeMax:
 * protection:
 * defense:
 * }
 */
mabi.ElementBuilder.mob = function(options){
    var mob = new mabi.Element({
	name: options.name,
	effects:[
	    {param: 'protection', min: options.protection},
	    {param: 'defense', min: options.defense},
	    {param: 'lifeMax', min: options.lifeMax}
	]});
    return mob;
};

/**
 * Body を作成する
 */
mabi.ElementBuilder.body = function(dto){
    var body = new mabi.Body(dto);

    $.each(dto, function(k, v){
	body.setParam(k, v);
    });
    return body;
};

/**
 * Weapon を作成する
 */
mabi.ElementBuilder.weapon = function(options){
    var flags = ['weapon'];
    if(options.flags) flags = flags.concat(options);
    var dto = {
	name: options.name,
	flags: flags,
	effects: []
    };
    if(options.effects){
	$.each(options.effects, function(k, v){
	    dto.effects.push({param: k, min: v});
	});
    }

    var weapon = new mabi.EquipmentClass(dto).create();
    weapon.setName(options.name);
    return weapon;
};

