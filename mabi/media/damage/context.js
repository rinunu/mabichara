
/**
 * アプリの文脈を表す
 * 
 * ビューの表示は Context を元に行う。
 * Context を共有するビューは同じデータを表示することとなる。
 */
mabi.Context = function(options){
    options = options || {};
    this.columns_ = [];
    this.conditions_ = options.conditions;
    this.mob_ = null;
};

/**
 *
 */
mabi.Context.prototype.setConditions = function(conditions){
    this.conditions_ = conditions;
};

/**
 * @param options {
 *   name: 名前,
 *   expression: Expression
 * }
 */
mabi.Context.prototype.addColumn = function(options){
    this.columns_.push(options);
};

/**
 * すべての Column を列挙する
 * 
 * 呼び出し元で内容を変更してはならない
 */
mabi.Context.prototype.columns = function(){
    return this.columns_;
};

/**
 * Conditions を取得する
 */
mabi.Context.prototype.conditions = function(){
    return this.conditions_;
};

/**
 * Mob を取得する
 */
mabi.Context.prototype.mob = function(){
    return this.mob_;
};

mabi.Context.prototype.setMob = function(mob){
    this.mob_ = mob;
};

// ----------------------------------------------------------------------
//

/**
 * 計算結果の入った DataTable を取得する
 */
mabi.Context.prototype.table = function(){
    var this_ = this;
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'キャラクター');
    $.each(this.columns_, function(i, column){
    	data.addColumn('number', column.name);
    });
    
    data.addRows(this.conditions_.length());
    this.conditions_.each(
    	function(row, condition){
    	    data.setValue(row, 0, condition.name());
    	    $.each(this_.columns_, function(i, column){
    		var c = {
    		    condition: condition,
    		    mob: this_.mob_
    		};
    		var value = Math.floor(column.expression.value(c));
    		data.setValue(row, i + 1, value);
    	    });
    	});
    return data;
};

