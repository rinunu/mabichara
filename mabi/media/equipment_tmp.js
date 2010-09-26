// ----------------------------------------------------------------------

function initialize(){
    tmp.createDummtData();

    $(".tabs").tabs();
    $(".buttons").buttonset();
    $("button").button();
    $(".draggable").draggable({ helper: 'clone' });
    $(".droppable").droppable(
	{
	    drop: function(event, ui) {alert("test");},
	    hoverClass: 'drophover'
	});

    var equipmentSetView = new mabi.EquipmentSetView($(".equipment_set"), tmp.set);
    var optionView = new mabi.OptionsView();
    var inventoryView = new mabi.InventoryView();
    var equipmentView = new mabi.EquipmentView();
    var enchantView = new mabi.EnchantView();
}