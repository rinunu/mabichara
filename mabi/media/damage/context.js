
/**
 * アプリの文脈を表す
 * 
 * ビューの表示は Context を元に行う。
 * Context を共有するビューは同じデータを表示することとなる。
 */
mabi.Context = function(options){
    options = options || {};
    this.mob_ = null;
    this.columnFields_ = [];
    this.rowFields_ = [];

    // {フィールドID: [フィールド値, ...]}
    this.data_ = {};
    var this_ = this;
    $.each(dam.fields, function(k, v){
	this_.data_[v.id] = [];
    });

    // row, column から指定された field の値を取得する関数
    this.getter_ = null;

    this.conditions_ = options.conditions;
    this.columns_ = [];


    this.title_ = dam.titles.get('マジックマスター') // todo
};

// ----------------------------------------------------------------------

/**
 * 列方向に表示するフィールドを設定する
 */
mabi.Context.prototype.setColumnFields = function(fields){
    this.columnFields_ = fields;
};

/**
 * 列方向に表示するフィールドを取得する
 */
mabi.Context.prototype.columnFields = function(){
    return this.columnFields_;
};

/**
 * 行方向に表示するフィールドを設定する
 */
mabi.Context.prototype.setRowFields = function(fields){
    this.rowFields_ = fields;
};

/**
 * 行方向に表示するフィールドを取得する
 */
mabi.Context.prototype.rowFields = function(){
    return this.rowFields_;
};

/**
 * 
 */
mabi.Context.prototype.addExpression = function(data){
    this.addData(dam.fields.EXPRESSION, data);
};

/**
 * 
 */
mabi.Context.prototype.addCharacter = function(data){
    this.addData(dam.fields.CHARACTER, data);
};

/**
 * 
 */
mabi.Context.prototype.addEquipmentSet = function(data){
    this.addData(dam.fields.EQUIPMENT_SET, data);
};

/**
 * 
 */
mabi.Context.prototype.addMob = function(data){
    this.addData(dam.fields.MOB, data);
};

/**
 * 
 */
mabi.Context.prototype.addData = function(field, data){
    this.data_[field.id].push(data);
};

// ----------------------------------------------------------------------
//

/**
 * table を更新し、update イベントを発生する
 */
mabi.Context.prototype.update = function(){
    var this_ = this;

    this.updateGetter();
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'キャラクター');

    var columns = [];
    this.eachColumn(function(i, v){columns.push(v);});

    var rows = [];
    this.eachRow(function(i, v){rows.push(v);});

    $.each(columns, function(i, column){
    	data.addColumn('number', this_.name(column));
    });
    
    data.addRows(rows.length);
    $.each(rows, function(i, row){
    	data.setValue(i, 0, this_.name(row));
    	$.each(columns, function(j, column){
    	    var value = Math.floor(this_.calculate(row, column));
    	    data.setValue(i, j + 1, value);
    	});
    });

    this.table_ = data;

    util.Event.trigger(this, 'update');
};

/**
 * row, column から Character, Mob 等を取り出す関数を作成する
 */
mabi.Context.prototype.updateGetter = function(){
    var map = {};
    $.each(this.rowFields_, function(i, field){
	map[field.id] = [0, i];
    });
    $.each(this.columnFields_, function(i, field){
	map[field.id] = [1, i];
    });

    this.getter_ = function(field, row, column){
	var a = map[field.id];
	if(!a) return null;
	var b = a[0] == 0 ? row : column;
	var result =  b[a[1]];
	console.assert(result);
	return result;
    }
};

/**
 * 計算結果の入った DataTable を取得する
 */
mabi.Context.prototype.table = function(){
    console.assert(this.table_);
    return this.table_;
};

/**
 * すべてのカラムを列挙する
 */
mabi.Context.prototype.eachColumn = function(fn){
    this.each_(this.columnFields_, fn);
};

/**
 * すべての row を列挙する
 */
mabi.Context.prototype.eachRow = function(fn){
    this.each_(this.rowFields_, fn);
};

// ----------------------------------------------------------------------
// private

/**
 * カラムもしくは row の名前を取得する
 */
mabi.Context.prototype.name = function(values){
    return $.map(values, function(v){return v.name()}).join(' | ');
};


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

/**
 * セルの値を計算する
 */
mabi.Context.prototype.calculate = function(row, column){
    var c = {
	condition:  new mabi.Condition({
	    character: this.getter_(dam.fields.CHARACTER, row, column),
	    title: this.title_,
	    weapon: this.getter_(dam.fields.EQUIPMENT_SET, row, column)
	}),
	mob: this.getter_(dam.fields.MOB, row, column),
    };
    var expression = this.getter_(dam.fields.EXPRESSION, row, column)
    return expression.value(c);
};

// ----------------------------------------------------------------------



dam.fields = {};
dam.fields.CHARACTER = {
    id: 'character'
};

dam.fields.EXPRESSION = {
    id: 'expression'
};

dam.fields.MOB = {
    id: 'mob'
};

dam.fields.EQUIPMENT_SET = {
    id: 'equipmentSet'
};
