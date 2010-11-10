/**
 * キャラクター本体
 */
mabi.Body = function(options){
    this.super_.constructor.call(this, options);
};

util.extend(mabi.Body, mabi.Element);

/**
 * スキル情報を追加する
 */
mabi.Body.prototype.setSkill = function(skill, rank){
    console.assert(skill instanceof mabi.SkillClass);
    this.addChild(skill.create(rank), skill.name());
};

/**
 * スキル情報を取得する
 */
mabi.Body.prototype.skill = function(skill){
    console.assert(skill instanceof mabi.SkillClass);
    return this.child(skill.name());
};
