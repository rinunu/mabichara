/**
 * ダメージ計算固有の変数用名前空間
 */
var dam = {};

dam.initializeModel = function(){
    dam.conditions = new mabi.Conditions;
    dam.weapons = new mabi.Elements;
    dam.titles = new mabi.Elements;
    dam.skills = new mabi.Elements;

    dam.addBuiltInItems();
    dam.addBuiltInConditions();
};

dam.initializeView = function(){
    $(".tabs").tabs();
    $(":button").button();
    $(":checkbox").button();

    dam.damageTable = new mabi.DamageTable($('table.damage'), dam.conditions);
    dam.menu = new mabi.Menu($('.menu'));

    for(var i in dam){
	if(dam[i].initialize){
	    dam[i].initialize();
	}
    }

    $('form').dialog();
};

dam.initialize = function(){
    dam.initializeModel();
    dam.initializeView();
};

