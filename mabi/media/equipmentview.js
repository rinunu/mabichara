
mabi.EquipmentView = function(){
    this.$element_ = $('.equipment_view');
    this.$element_.dialog(
	{
	    autoOpen: true,
	    width: 700,
	    height: 600,
	    buttons: {"OK": function() {}}
	});
};

