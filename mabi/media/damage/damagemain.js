
/**
 * デフォルトの Condition を追加する
 */
mabi.pushConditions = function(){
    mabi.conditions.push({name: 'Int500'});
    mabi.conditions.push({name: 'Int400'});
    mabi.conditions.push({name: 'Int300'});
    mabi.conditions.push({name: 'Str200 猫装備'});
};

mabi.initialize = function(){
    mabi.conditions = new mabi.Conditions;
    mabi.pushConditions();

    $(".tabs").tabs();
    $(":button").button();
    $(":checkbox").button();

    mabi.damageTable = new mabi.DamageTable($('table.damage'), mabi.conditions);
    mabi.menu = new mabi.Menu($('.menu'));

    for(var i in mabi){
	if(mabi[i].initialize){
	    mabi[i].initialize();
	}
    }


    $('form').dialog();
};

