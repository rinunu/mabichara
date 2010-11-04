
/**
 * アプリの文脈を表す
 * 
 * ビューの表示は Context を元に行う。
 * Context を共有するビューは同じデータを表示することとなる。
 */
mabi.Context = function(options){
    this.columns_ = [];
    this.conditions_ = options.conditions;
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