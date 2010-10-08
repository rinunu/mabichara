
/**
 * 個別装備の編集を行うビュー
 */
mabi.EquipmentView = function(){
    this.$element_ = $('.equipment_view');
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 700,
	    height: 600,
	    buttons: {"OK": function() {}}
	});
};

mabi.EquipmentView.prototype.edit = function(element){
    this.$element_.dialog('open');
};