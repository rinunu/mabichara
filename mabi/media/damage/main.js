dam.initializeModel = function(){
    mabi.ajax = new mabi.Ajax;
    
    mabi.titles = new mabi.TitleStore;
    mabi.skills = new mabi.SkillStore;
    mabi.enchants = new mabi.EnchantStore;
    mabi.equipments = new mabi.EquipmentStore;

    // 過去互換
    dam.titles = mabi.titles;
    dam.skills = mabi.skills;
    dam.enchants = mabi.enchants;
    dam.equipments = mabi.equipments;

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
    // ユーザの作成した(もしくはデフォルトの)パーツ
    dam.parts = {
        weapons: new mabi.ElementStore({url: '/lists/weapons'}),
        protectors: new mabi.ElementStore({url: '/lists/protectors'}),
        bodies: new mabi.ElementStore({url: '/lists/bodies'}),
        titles: new mabi.ElementStore({url: '/lists/titles'}),
        mobs: new mabi.ElementStore({url: '/lists/mobs'}),

        expressions: new mabi.Collection()
    };
    dam.setDefaultParts();

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
    // 読込中に見苦しくない程度に表示を整える
    $('button').button();
    $(".tabs").tabs();

    
    dam.initializeModel().success(function(){
        console.log('initialized model');
        dam.initializeView();        
    });
};

