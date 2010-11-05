
/**
 * select を初期化する
 */
dam.initializeSelect = function($select, items){
    $select.empty();
    items.each(
	function(i, item){
	    $('<option />').text(item.name()).appendTo($select);
	});
};
