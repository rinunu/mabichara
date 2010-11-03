
/**
 * スキル
 * 
 * 将来的には mabi.Skill と統一する
 */
mabi.SimpleSkill = function(options){
    this.super_.constructor.call(this, options);
    this.base_ = options.base;
};

util.extend(mabi.SimpleSkill, mabi.Element);

/**
 * SimpleSkillClass を取得する
 */
mabi.SimpleSkill.prototype.base = function(){
    return this.base_;
};

// 委譲メソッドを作成する
(function(){
     $.each(['is'],
	    function(i, name){
		mabi.SimpleSkill.prototype[name] = function(){
		    return this.base_[name].apply(this.base_, arguments);
		};
	    });
})();

// ----------------------------------------------------------------------

/**
 * スキルクラス
 * 
 * 将来的には mabi.SkillClass と統一する
 */
mabi.SimpleSkillClass = function(options){
    this.name_ = options.name;

    // 0 オリジン
    this.ranks_ = options.ranks;

    this.flags_ = options.flags;
};

/**
 * 指定したランクの SimpleSkill を生成する
 * @param rank 1~15(F)
 */
mabi.SimpleSkillClass.prototype.create = function(rank){
    rank -= 1;
    return new mabi.SimpleSkill(
	{
	    base: this,
	    name: this.name_,
	    effects: this.ranks_[rank]
	});
};

/**
 */
mabi.SimpleSkillClass.prototype.name = function(){
    return this.name_;
};

/**
 * フラグを調査する
 */
mabi.SimpleSkillClass.prototype.is = function(flag){
    return $.inArray(flag, this.flags_) != -1;
};


