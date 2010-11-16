dam.initializeModel = function(){
    mabi.ajax = new mabi.Ajax;
    
    dam.titles = new mabi.TitleStore;
    dam.skills = new mabi.SkillStore;
    dam.enchants = new mabi.EnchantStore;
    dam.equipments = new mabi.EquipmentStore;

    var c = new util.ConcurrentCommand(
	[
            dam.skills.load(),
            dam.titles.load(),
            dam.equipments.load()
        ]);
    c.execute();
    return c;
};

dam.initializeView = function(){
    $('button').button();
    $(".tabs").tabs();

    dam.context = new mabi.Context();
    dam.setDefaultContext(dam.context);
    dam.context.update();

    dam.help = new mabi.Help($('div.help'));
    dam.generatorView = new mabi.GeneratorView($('div.generator'));
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
    dam.initializeModel().success(function(){
        console.log('initialized model');
        dam.initializeView();        
    });
};

