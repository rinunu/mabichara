
/**
 * 計算式を表す
 */
mabi.Expression = function(expression, name){
    this.expression_ = expression;
    this.name_ = name;
};

/**
 * 計算結果を取得する
 */
mabi.Expression.prototype.value = function(context){
    console.assert(console instanceof mabi.Context);
    return this.expression_(context);
};

mabi.Expression.prototype.name = function(){
    return this.name_;
};