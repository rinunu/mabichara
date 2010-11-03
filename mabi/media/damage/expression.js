
/**
 * 計算式を表す
 */
mabi.Expression = function(expression){
    this.expression_ = expression;
};

/**
 * 計算結果を取得する
 */
mabi.Expression.prototype.value = function(context){
    console.assert(console instanceof mabi.Context);
    return this.expression_(context);
};
