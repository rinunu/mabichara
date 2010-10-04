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

    mabi.enchants = new mabi.EnchantStore();
    var c = mabi.enchants.initialize();
    c.success(function(){
		  var set =tmp.createDummtData();
		  mabi.equipmentSetView.setModel(set);
	      });
    mabi.equipmentSetView = new mabi.EquipmentSetView($(".equipment_set"));
    mabi.optionView = new mabi.OptionsView();
    mabi.inventoryView = new mabi.InventoryView();
    mabi.equipmentView = new mabi.EquipmentView();
    mabi.enchantView = new mabi.EnchantView();
}
