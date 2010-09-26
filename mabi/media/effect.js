/**
 * @param options {
 *   condition: 発動条件
 *     条件がない場合は省略
 *   effect:
 *   min:
 *   max: ゆらぎ幅が無い場合は省略する}
 */
mabi.Effect = function(options){
    options = options || {
    };

    this.condition = options.condition;
    this.effect = options.effect;
    this.min = options.min;
    this.max = options.max;
};

