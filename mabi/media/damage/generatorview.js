
/**
 * Condition を自動生成するためのビュー
 */
mabi.GeneratorView = function($element){
    this.$element_ = $element;
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 800,
	    height: 500,
	    buttons: {"設定する": function() {
		dam.context.update();
	    }}
	});

    // $(':checkbox', this.$element_).button();
    $('.flags', this.$element_).buttonset();
};

mabi.GeneratorView.prototype.show = function(){
    this.$element_.dialog('open');

    dam.initializeSelect($('select.weapon', this.$element_), dam.weapons);
    dam.initializeSelect($('select.title', this.$element_), dam.titles);

    // todo 最初の 1回だけ
    var $vars = [$('.var0', this.$element_),
		$('.var1', this.$element_)];
    $.each($vars, function(i, $var){
	       new mabi.VariableControl($var);
	   });
};


// ----------------------------------------------------------------------
// 可変部編集コントロール

/**
 * 可変部を編集するためのコントロール
 */
mabi.VariableControl = function($element){
    this.$element_ = $element;
    var $type = $('select.type', this.$element_);

    var types = {};
    $.each([{id: '', label: ''},
	    {id: 'weapon', label: '武器', type: 'select', items: dam.weapons},
	    {id: 'int', label: 'Int', type: 'number'}], 
	   function(i, v){
	       types[v.id] = v;
	   });

    $type.empty();
    $.each(types, function(i, v){
	       $('<option />').val(v.id).text(v.label).data('model', v).appendTo($type);
	   });

    $type.change(function(){
		     var type = types[$(this).val()];
		     console.log(type);
		     var $detail = $('.detail', $element);
		     $detail.empty();
		     if(type.type == 'select'){
			 var $select = $('<select multiple size="5"/>').appendTo($detail);
			 dam.initializeSelect($select, type.items);
		     }
		});
    
    // var $select = $('<select multiple size="5"/>').appendTo($element_);
    // dami.initializeSelect($select, dam.weapons);
};

