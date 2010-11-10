
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
	    height: 500,
	    buttons: {'設定する': util.bind(this, this.submit)}
	});

    this.source_ = [];
    this.columns_ = [];
    this.rows_ = [];

    $('.reset', $element).click(function(){
	this_.columns_ = [];
	this_.rows_ = [];
	this_.updateUi();
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
    // todo 複数回実行
    var this_ = this;
    this.context_ = context;

    this.columns_ = context.columnFields().slice(0);
    this.rows_ = context.rowFields().slice(0);

    var $source = $('select.source', this.$element_).data('source', util.bind(this, this.source));

    $.each(['rows', 'columns'], function(i, v){
	var $select = $('select.' + v, this.$element_);
	$select.data('source', function(){return this_[v + '_'];});
    });

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

    this.context_.setColumnFields(this.columns_);
    this.context_.setRowFields(this.rows_);
    this.context_.update();

    this.$element_.dialog('close');
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
