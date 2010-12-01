
/**
 * スキル
 */
mabi.Skill = function(options){
    mabi.InstanceElement.call(this, options.base, options);
    if(options){
        this.addEffect({param: 'rank', min: options.rank});
    }
};

util.extend(mabi.Skill, mabi.InstanceElement);

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
