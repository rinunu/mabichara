
mabi.DamageData = function(){
    this.columnFields_ = [];
    this.rowFields_ = [];
    this.damageSource_ = null;

    this.table_ = null;
};

// ----------------------------------------------------------------------
// property

mabi.DamageData.prototype.setDamageSource = function(damageSource){
    this.table_ = null;
    this.damageSource_ = damageSource;
};

mabi.DamageData.prototype.damageSource = function(damageSource){
    return this.damageSource_;
};


mabi.DamageData.prototype.setColumnFields = function(fields){
    this.table_ = null;
    this.columnFields_ = fields.slice(0);    
};

mabi.DamageData.prototype.columnFields = function(fields){
    return this.columnFields_;
};


mabi.DamageData.prototype.setRowFields = function(fields){
    this.table_ = null;
    this.rowFields_ = fields.slice(0);    
};

mabi.DamageData.prototype.rowFields = function(fields){
    return this.rowFields_;
};


mabi.DamageData.prototype.table = function(){
    if(!this.table_){
        this.update();
    }
    return this.table_;
};

// ----------------------------------------------------------------------
// private

mabi.DamageData.prototype.update = function(){
    var this_ = this;
    console.log('update');

    this.updateGetter();
    var getRowId = this.getRowId;
    var getColumnId = this.getColumnId;
    var getRowFields = this.getRowFields;
    var getColumnFields = this.getColumnFields;

    var records = this.damageSource_.records();

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
};

/**
 * row, column から Body, Mob 等を取り出す関数を作成する
 */
mabi.DamageData.prototype.updateGetter = function(){
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
 * カラムもしくは row の名前を取得する
 */
mabi.DamageData.prototype.name = function(values){
    return $.map(values, function(v){return v.name();}).join(' / ');
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
