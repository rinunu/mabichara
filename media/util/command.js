
/**
 * コマンド(管理すべき処理)を表す
 * 
 * 管理とは以下のような扱いのことを言う
 * - 遅延して実行する
 * - 定期的に実行する
 * - 非同期実行
 * 
 * プロパティ
 * - type: コマンドの種別
 * 
 * options: {type}
 */
util.Command = function(options){
    options = options || {};
    this.type = options.type;
};

// ----------------------------------------------------------------------
// Command 使用側インタフェース

/**
 * 実行可能か
 */
util.Command.prototype.canExecute = function(){
    return true;
};

/**
 * 実行
 * 
 * 成功時は this.onSuccess, 失敗時は this.onError を呼び出すこと
 * 
 */
util.Command.prototype.execute = function(){
};

/**
 * 成功時のコールバックを登録する
 */
util.Command.prototype.success = function(success){
    if(this.success_){
	this.success_ = util.concat(this.success_, success);
    }else{
	this.success_ = success;
    }
};

/**
 * 失敗時のコールバックを登録する
 */
util.Command.prototype.error = function(error){
    if(this.error_){
	this.error_ = util.concat(this.error_, error);
    }else{
	this.error_ = error;
    }
};

// ----------------------------------------------------------------------
// Command 実装側インタフェース

util.Command.prototype.onSuccess = function(){
    if(this.success_){
	this.success_.apply(this, arguments);
    }
};

util.Command.prototype.onError = function(){
    if(this.error_){
	this.error_.apply(this, arguments);
    }
};

// ======================================================================
// 

/**
 * 同期実行 Command
 */
util.SyncCommand = function(execute, options){
    util.Command.call(this, options);
    this.execute_ = execute;
};

util.extend(util.SyncCommand, util.Command);

util.SyncCommand.prototype.execute = function(){
    this.execute_();
    this.onSuccess();
};

// ======================================================================

/**
 * 非同期実行 Command
 */
util.AsyncCommand = function(execute, options){
    util.Command.call(this, options);
    this.execute = execute;
};

util.extend(util.AsyncCommand, util.Command);

// ======================================================================
//

/**
 * [未実装] 複数の Command を同時に実行する Command
 * 
 * すべての Command が完了すると、この Command も完了する
 */
util.ConcurrentCommand = function(commands){
};

util.extend(util.ConcurrentCommand, util.Command);

