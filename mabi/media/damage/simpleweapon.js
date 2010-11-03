
/**
 * 武器
 * 
 * 将来的には mabi.Weapon と統一する
 */
mabi.SimpleWeapon = function(options){
    this.super_.constructor.call(this, options);
    this.flags_ = options.flags || [];
};

util.extend(mabi.SimpleWeapon, mabi.Element);

/**
 * フラグを調査する
 */
mabi.SimpleWeapon.prototype.is = function(flag){
    return $.inArray(flag, this.flags_) != -1;
};
