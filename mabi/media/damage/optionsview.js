
/**
 * オプション設定用ビュー
 */
mabi.OptionsView = function($element){
    var this_ = this;
    this.$element_ = $element;
    this.$element_.dialog(
	{
	    autoOpen: false,
	    width: 500,
	    height: 600,
	    buttons: {
                'リセット': util.bind(this, this.reset),
                '決定': util.bind(this, this.submit)}
	});

    this.source_ = [];
    this.columns_ = [];
    this.rows_ = [];

    $('select.source', this.$element_).data('source', util.bind(this, this.source));
    $.each(['rows', 'columns'], function(i, v){
	var $select = $('select.' + v, this_.$element_);
	$select.data('source', function(){return this_[v + '_'];});
    });

    $source = $('select.source', $element);
    $.each(['row', 'column'], function(i, v){
	$('.add-' + v, $element).click(function(){
	    var $select = $('select.' + v + 's', this_.$element_);
	    $(':selected', $source).each(function(){
		var item = $(this).data('model');
		this_[v + 's_'].push(item);
	    });
	    this_.updateUi();
	});
    });
};

mabi.OptionsView.prototype.show = function(context){
    this.context_ = context;
    var damageData = context.damageData();

    this.columns_ = damageData.columnFields().slice(0);
    this.rows_ = damageData.rowFields().slice(0);

    this.updateUi();

    this.$element_.dialog('open');
};

// ----------------------------------------------------------------------
// private

mabi.OptionsView.prototype.submit = function(){
    if(this.source().length >= 1){
	alert('すべての表示項目を縦/横軸のどちらかに設定してください');
	return;
    }

    var damageData = this.context_.damageData();
    damageData.setColumnFields(this.columns_);
    damageData.setRowFields(this.rows_);
    this.context_.update();

    this.$element_.dialog('close');
};

/**
 * 
 */
mabi.OptionsView.prototype.reset = function(){
    this.columns_ = [];
    this.rows_ = [];
    this.updateUi();
};

/**
 * 
 */
mabi.OptionsView.prototype.updateUi = function(){
    $('select', this.$element_).each(function(i, select){
	var $select = $(select);
	var source = $select.data('source');
	if(!source) return;
	$select.empty();
	$.each(source(), function(i, item){
	    $('<option />').val(item.id).text(item.label).data('model', item).appendTo($select);
	});
    });
};


/**
 * 
 */
mabi.OptionsView.prototype.source = function(context){
    var this_ = this;
    var source = [];
    $.each(dam.fields, function(i, v){
	source.push(v);
    });

    source = $.grep(source, function(v){
	return $.inArray(v, this_.rows_) == -1 &&
	    $.inArray(v, this_.columns_) == -1;
    });

    return source;
};    
