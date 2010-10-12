function initialize(){
    $(".tabs").tabs();
    $(".buttons").buttonset();
    $("button").button();
    $(".draggable").draggable({ helper: 'clone' });
    $(".droppable").droppable(
	{
	    drop: function(event, ui) {alert("test");},
	    hoverClass: 'drophover'
	});

    mabi.ajax = new mabi.Ajax();

    mabi.enchants = new mabi.EnchantStore();
    mabi.equipments = new mabi.EquipmentStore();
    mabi.titles = new mabi.TitleStore();

    mabi.inventory = new mabi.Inventory();

    mabi.editorManager = new mabi.EditorManager();

    mabi.equipmentSetView = new mabi.EquipmentSetView($(".equipment_set"));
    mabi.optionView = new mabi.OptionsView();
    mabi.inventoryView = new mabi.InventoryView(mabi.inventory);
    mabi.equipmentView = new mabi.EquipmentView();

    for(var i in mabi){
	if(mabi[i].initialize){
	    mabi[i].initialize();
	}
    }

    mabi.equipmentView.edit();
    tmp.run();
}

