dam.initializeModel = function(){
    dam.conditions = new mabi.Conditions;
    dam.weapons = new mabi.Elements;
    dam.titles = new mabi.Elements;
    dam.skills = new mabi.Elements;

    dam.addBuiltInItems();
    dam.addBuiltInConditions();
};

dam.initializeView = function(){
    $('button').button();
    $(".tabs").tabs();

    dam.context = new mabi.Context({conditions: dam.conditions});
    dam.setDefaultContext(dam.context);
    dam.context.update();

    dam.help = new mabi.Help($('div.help'));
    dam.generatorView = new mabi.GeneratorView($('div.generator'));
    dam.conditonView = new mabi.ConditionView($('form.condition-view'));
    dam.chartView = new mabi.ChartView($('.chart-view'));
    dam.optionsView = new mabi.OptionsView($('.options-view'));

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

