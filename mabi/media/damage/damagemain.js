dam.initializeModel = function(){
    dam.conditions = new mabi.Conditions;
    dam.weapons = new mabi.Elements;
    dam.titles = new mabi.Elements;
    dam.skills = new mabi.Elements;

    dam.addBuiltInItems();
    dam.addBuiltInConditions();
};

dam.createContext = function(){
    var ib = dam.skills.get('アイスボルト').create(1);
    var fb = dam.skills.get('ファイアボルト').create(1);
    var lb = dam.skills.get('ライトニングボルト').create(1);
    var fbl = dam.skills.get('ファイアボール').create(1);
    var th = dam.skills.get('サンダー').create(1);
    var is = dam.skills.get('アイススピア').create(1);
    var context = new mabi.Context({conditions: dam.conditions});
    $.each([{name: 'IB', expression: new mabi.MagicDamage(ib, 1)},
	    {name: 'FB(1C)', expression: new mabi.MagicDamage(fb, 1)},
	    {name: 'FB(5C)', expression: new mabi.MagicDamage(fb, 5)},
	    {name: 'LB', expression: new mabi.MagicDamage(lb, 1)},
	    {name: 'IB+FB(1C)', expression: new mabi.FusedBoltMagicDamage(ib, fb, 1)},
	    {name: 'IB+FB(5C)', expression: new mabi.FusedBoltMagicDamage(ib, fb, 5)},
	    {name: 'IB+LB', expression: new mabi.FusedBoltMagicDamage(ib, lb, 1)},
	    {name: 'FB+LB(1C)', expression: new mabi.FusedBoltMagicDamage(fb, lb, 1)},
	    {name: 'FB+LB(5C)', expression: new mabi.FusedBoltMagicDamage(fb, lb, 5)},
	    {name: 'FBL', expression: new mabi.MagicDamage(fbl, 5)},
	    {name: 'IS(5C)', expression: new mabi.MagicDamage(is, 5)},
	    {name: 'TH(5C)', expression: new mabi.ThunderDamage(th, {charge: 5})}
	   ],
	   function(i, v){
	       context.addColumn(v);
	   });

    var mob = new mabi.Element(
	{
	    effects:[
		{param: 'protection', min: 0.1}
	    ]});
    context.setMob(mob);

    return context;
};

dam.initializeView = function(){
    dam.context = dam.createContext();

    dam.help = new mabi.Help($('div.help'));
    dam.generatorView = new mabi.GeneratorView($('div.generator'));
    dam.conditonView = new mabi.ConditionView($('form.condition-view'));
    dam.graphView = new mabi.GraphView($('.graph-view'));

    dam.damageTable = new mabi.DamageTable($('table.damage'), dam.context);

    dam.menu = new mabi.Menu($('.menu'));

    for(var i in dam){
	if(dam[i].initialize){
	    dam[i].initialize();
	}
    }
};

dam.initialize = function(){
    dam.initializeModel();
    dam.initializeView();
};

