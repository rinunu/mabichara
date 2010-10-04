/**
 * @param options {
 *   condition: 発動条件
 *     条件がない場合は省略
 *   op:
 *   param:
 *   min:
 *   max: ゆらぎ幅が無い場合は省略する
 * }
 */
mabi.Effect = function(options){
    options = options || {
    };

    this.condition = options.condition;
    this.op_ = options.op;
    this.param_ = options.param;
    this.min_ = options.min;
    this.max_ = options.max;
};

mabi.Effect.prototype.condition = function(){
    return this.condition_;
};

mabi.Effect.prototype.op = function(){
    return this.op_;
};

mabi.Effect.prototype.param = function(){
    return this.param_;
};

mabi.Effect.prototype.min = function(){
    return this.min_;
};

mabi.Effect.prototype.max = function(){
    return this.max_;
};

mabi.Effect.prototype.clone = function(){
    new mabi.Effect(
	{
	    condition: this.condition_,
	    op: this.op_,
	    param: this.param_,
	    min: this.min_,
	    max: this.max_
	});
};