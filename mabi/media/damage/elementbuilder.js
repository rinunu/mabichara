
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

