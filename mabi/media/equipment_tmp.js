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

    mabi.inventory = new mabi.Inventory();
    mabi.enchants = new mabi.EnchantStore();
    mabi.equipments = new mabi.EquipmentStore();

    mabi.equipmentSetView = new mabi.EquipmentSetView($(".equipment_set"));
    mabi.optionView = new mabi.OptionsView();
    mabi.inventoryView = new mabi.InventoryView(mabi.inventory);
    mabi.equipmentView = new mabi.EquipmentView();
    mabi.enchantView = new mabi.EnchantView();

    tmp.run();
}
