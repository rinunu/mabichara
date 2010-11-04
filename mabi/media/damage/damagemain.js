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
    var ib = dam.skills.get('アイスボルト').create(1);
    var fb = dam.skills.get('ファイアボルト').create(1);
    var lb = dam.skills.get('ライトニングボルト').create(1);
    $.each([{name: 'IB', expression: new mabi.MagicExpression(ib, 1)},
	    {name: 'FB(1C)', expression: new mabi.MagicExpression(fb, 1)},
	    {name: 'FB(5C)', expression: new mabi.MagicExpression(fb, 5)},
	    {name: 'LB', expression: new mabi.MagicExpression(lb, 1)},
	    {name: 'IB+FB(1C)', expression: new mabi.FusedBoltMagicDamage(ib, fb, 1)},
	    {name: 'IB+FB(5C)', expression: new mabi.FusedBoltMagicDamage(ib, fb, 5)},
	    {name: 'IB+LB', expression: new mabi.FusedBoltMagicDamage(ib, lb, 1)},
	    {name: 'FB+LB(1C)', expression: new mabi.FusedBoltMagicDamage(fb, lb, 1)},
	    {name: 'FB+LB(5C)', expression: new mabi.FusedBoltMagicDamage(fb, lb, 5)}
	   ],
	   function(i, v){
	       dam.damageTable.addColumn(v);
	   });

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

