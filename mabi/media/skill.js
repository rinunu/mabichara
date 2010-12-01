
/**
 * スキル
 */
mabi.Skill = function(options){
    mabi.InstanceElement.call(this, options.base, options);
    if(options){
        this.rank_ = options.rank;
    }
};

util.extend(mabi.Skill, mabi.InstanceElement);

/**
 * ランクを取得する
 * @return 1~15
 */
mabi.Skill.prototype.rank = function(){
    return this.rank_;
};

// 委譲メソッドを作成する
(function(){
     $.each(['is', 'englishName'],
	    function(i, name){
		mabi.Skill.prototype[name] = function(){
		    return this.base_[name].apply(this.base_, arguments);
		};
	    });
})();

// ----------------------------------------------------------------------

mabi.SkillClass = function(options){
    mabi.Element.call(this, options);

    // 0 オリジン
    this.ranks_ = options.ranks;

    this.englishName_ = options.englishName;
};
util.extend(mabi.SkillClass, mabi.Element);

/**
 * 指定したランクの Skill を生成する
 * @param rank 1~15(F)
 */
mabi.SkillClass.prototype.create = function(rank){
    var effects = this.ranks_[rank - 1];
    console.assert(effects);
    return new mabi.Skill(
	{
	    base: this,
	    rank: rank,
	    effects: effects
	});
};

/**
 */
mabi.SkillClass.prototype.englishName = function(){
    return this.englishName_;
};

