
/**
 * スキル
 */
mabi.Skill = function(options){
    this.super_.constructor.call(this, options);
    this.base_ = options.base;
    this.rank_ = options.rank;
};

util.extend(mabi.Skill, mabi.Element);

/**
 * SkillClass を取得する
 */
mabi.Skill.prototype.base = function(){
    return this.base_;
};

/**
 * ランクを取得する
 * @return 1~15
 */
mabi.Skill.prototype.rank = function(){
    return this.rank_;
};


// 委譲メソッドを作成する
(function(){
     $.each(['is'],
	    function(i, name){
		mabi.Skill.prototype[name] = function(){
		    return this.base_[name].apply(this.base_, arguments);
		};
	    });
})();

// ----------------------------------------------------------------------

/**
 * スキルクラス
 *
 * flags
 * - charge_bonus: 複数チャージ時にダメージボーナスが発生するか
 */
mabi.SkillClass = function(options){
    this.name_ = options.name;

    // 0 オリジン
    this.ranks_ = options.ranks;

    this.flags_ = options.flags;
};

/**
 * 指定したランクの Skill を生成する
 * @param rank 1~15(F)
 */
mabi.SkillClass.prototype.create = function(rank){
    return new mabi.Skill(
	{
	    base: this,
	    rank: rank,
	    effects: this.ranks_[rank - 1]
	});
};

/**
 */
mabi.SkillClass.prototype.name = function(){
    return this.name_;
};

/**
 * フラグを調査する
 */
mabi.SkillClass.prototype.is = function(flag){
    return $.inArray(flag, this.flags_) != -1;
};

