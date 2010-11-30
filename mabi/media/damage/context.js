mabi.Context = function(options){
    options = options || {};
    this.columnFields_ = [];
    this.rowFields_ = [];
    this.damageData_ = null;

    this.table_ = null;
};

// ----------------------------------------------------------------------
// property

mabi.Context.prototype.damageData = function(damageData){
    return this.damageData_;
};

mabi.Context.prototype.setDamageData = function(damageData){
    this.damageData_ = damageData;
};

// ----------------------------------------------------------------------

mabi.Context.prototype.update = function(){
    $(this).trigger('change');
};


// ----------------------------------------------------------------------

/**
 * すべての row を列挙する
 */
mabi.Context.prototype.eachRow_ = function(fn){
    this.each_(this.rowFields_, fn);
};

// ----------------------------------------------------------------------
// private

/**
 * すべての column もしくは row を列挙する
 * @param parents
 */
mabi.Context.prototype.each_ = function(fields, fn){
    var iTotal = 0;
    var data = this.data_;
    function impl(iField, parents){
	var field = fields[iField];
	if(iField == fields.length - 1){
	    $.each(data[field.id], function(i, v){
		fn(iTotal++, parents.concat(v));
	    });
	}else{
	    $.each(data[field.id], function(i, v){
		impl(iField + 1, parents.concat(v));
	    });
	}
    }
    impl(0, []);
};

// ----------------------------------------------------------------------

