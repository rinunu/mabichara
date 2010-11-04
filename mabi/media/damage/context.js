
/**
 * Expression を計算するための文脈を表す
 */
mabi.Context = function(options){
    this.condition_ = options.condition;
    this.enemy_ = options.enemy;
};

/**
 * 計算対象となる Condition を取得する
 */
mabi.Context.prototype.condition = function(){
    return this.condition_;
};

/**
 * 計算対象となる目標物を取得する
 */
mabi.Context.prototype.enemy = function(){
    return this.enemy_;
};
