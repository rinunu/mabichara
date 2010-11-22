/**
 * クラス Element のインスタンスとなる Element
 *
 * 例えば EnchantClass のインスタンスである Enchant 等。
 *
 * base にクラスを保持する
 */
mabi.InstanceElement = function(base, options){
    mabi.Element.call(this, options);
    if(base){
        this.setName(base.name());
        this.base_ = base;
    }

    this.addSharedProperties(['base_']);
};

util.extend(mabi.InstanceElement, mabi.Element);

/**
 * クラスを取得する
 */
mabi.InstanceElement.prototype.base = function(){
    return this.base_;
};
