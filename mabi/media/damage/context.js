mabi.Context = function(options){
    options = options || {};
    this.columnFields_ = [];
    this.rowFields_ = [];
    this.damageData_ = null;

    this.table_ = null;
};

// ----------------------------------------------------------------------

/**
 * 列方向に表示するフィールドを設定する
 */
mabi.Context.prototype.setColumnFields = function(fields){
    this.columnFields_ = fields.slice(0);
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
    this.rowFields_ = fields.slice(0);
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
mabi.Context.prototype.damageData = function(damageData){
    return this.damageData_;
};

/**
 * 
 */
mabi.Context.prototype.setDamageData = function(damageData){
    this.damageData_ = damageData;
};

// ----------------------------------------------------------------------
//

/**
 * table を更新し、update イベントを発生する
 */
mabi.Context.prototype.update = function(){
    var this_ = this;
    console.log('update');

    this.updateGetter();
    var getRowId = this.getRowId;
    var getColumnId = this.getColumnId;
    var getRowFields = this.getRowFields;
    var getColumnFields = this.getColumnFields;

    var records = this.damageData_.records();

    var rowArray = []; // [{id:, values: {Column ID: value, ...}}, ...]
    var columnArray = []; // [{id:, []}]
    var rowMap = {}; // Row への高速アクセス用{ID: Row}
    var columnMap = {}; // Column への高速アクセス用{ID: Column}
    $.each(records, function(i, record){
	var value = Math.floor(record.value());
	var rowId = getRowId(record);
	var columnId = getColumnId(record);
	var row = rowMap[rowId];
	if(!row){
	    row = {id: rowId, values: {}, idFields: getRowFields(record)};
	    rowMap[rowId] = row;
	    rowArray.push(row);
	}
	row.values[columnId] = value;
	if(!columnMap[columnId]){
	    var column = {id: columnId, idFields: getColumnFields(record)};
	    columnMap[columnId] = column;
	    columnArray.push(column);
	}
    });

    // DataTable に変換
    var table = new google.visualization.DataTable();
    table.addColumn('string', '');
    $.each(columnArray, function(iColumn, column){
      	table.addColumn('number', this_.name(column.idFields));
	table.setColumnProperty(iColumn + 1, 'idFields', column.idFields);
    });
    table.addRows(rowArray.length);
    $.each(rowArray, function(iRow, row){
	table.setValue(iRow, 0, this_.name(row.idFields));
	table.setRowProperty(iRow, 'idFields', row.idFields);
	$.each(columnArray, function(iColumn, column){
	    table.setValue(iRow, iColumn + 1, row.values[column.id]);
	});
    });

    this.table_ = table;
    util.Event.trigger(this, 'update');
};

/**
 * row, column から Body, Mob 等を取り出す関数を作成する
 */
mabi.Context.prototype.updateGetter = function(){
    var rowFieldIds = [];
    $.each(this.rowFields_, function(i, v){rowFieldIds.push(v.id);});

    var columnFieldIds = [];
    $.each(this.columnFields_, function(i, v){columnFieldIds.push(v.id);});

    function getId(record, fieldIds){
	var ids = [];
	for(var i = 0; i < fieldIds.length; i++){
	    ids.push(record[fieldIds[i]]().id());
	}
	return ids.join('_');
    }

    function getFields(record, fieldIds){
	var fields = [];
	for(var i = 0; i < fieldIds.length; i++){
	    fields.push(record[fieldIds[i]]());
	}
	return fields;
    }
    this.getRowId = function(record){ return getId(record, rowFieldIds); };
    this.getColumnId = function(record){ return getId(record, columnFieldIds); };
    this.getRowFields = function(record){ return getFields(record, rowFieldIds); };
    this.getColumnFields = function(record){ return getFields(record, columnFieldIds); };
};

/**
 * 計算結果の入った DataTable を取得する
 */
mabi.Context.prototype.table = function(){
    console.assert(this.table_);
    return this.table_;
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
    return $.map(values, function(v){return v.name();}).join(' / ');
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

// ----------------------------------------------------------------------

dam.fields = {};
dam.fields.BODY = {
    id: 'body',
    label: 'ステータス'
};

dam.fields.EXPRESSION = {
    id: 'expression',
    label: '攻撃種別'
};

dam.fields.MOB = {
    id: 'mob',
    label: 'MOB'
};

dam.fields.PROTECTORS = {
    id: 'protectors',
    label: '防具'
};

dam.fields.TITLE = {
    id: 'title',
    label: 'タイトル'
};

dam.fields.WEAPONS = {
    id: 'weapons',
    label: '武器'
};
