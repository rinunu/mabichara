// ----------------------------------------------------------------------

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

    // todo これも初期化を待つ
    mabi.inventory = new mabi.Inventory();
    mabi.inventory.initialize();

    mabi.enchants = new mabi.EnchantStore();
    var c = mabi.enchants.initialize();
    c.success(function(){
		  tmp.createDummtData();
		  mabi.equipmentSetView.setModel(tmp.set);
	      });
    mabi.equipmentSetView = new mabi.EquipmentSetView($(".equipment_set"));
    mabi.optionView = new mabi.OptionsView();
    mabi.inventoryView = new mabi.InventoryView(mabi.inventory);
    mabi.equipmentView = new mabi.EquipmentView();
    mabi.enchantView = new mabi.EnchantView();
}
