/**
 * ダメージ計算のスペックを書く際に使用する
 * with(new mabi.DamageSpecHelper) して使う
 */

mabi.DamageSpecHelper = function(){
    this.character_ = null;
    this.body_ = null;
    this.expression_ = null;
    this.equipmentSet_ = null;
    this.mob_ = null;
};

util.extend(mabi.DamageSpecHelper, mabi.Builder);

// ダメージを計算する
mabi.DamageSpecHelper.prototype.damage = function(){
    this.character_ = new mabi.Character();
    this.character_.setBody(this.body_);
    this.character_.setEquipmentSet(this.equipmentSet_);

    var context = {
	character: this.character_,
        mob: this.mob_
    };
    return Math.floor(this.expression_.value(context));
};

/**
 * 指定された値を body_, equipmentSet_ に設定する
 * 指定されなかった値は変更しない。
 * {
 *   skills{
 *     {name: ランク}
 *   },
 *   rightHand: Equipment
 * }
 *
 * - ランク: 0の時、そのスキルを取り除く
 */
mabi.DamageSpecHelper.prototype.set = function(options){
    var this_ = this;
    if(options.title){
        this.equipmentSet_.setTitle(this.title(options.title));
    }

    $.each(['head', 'rightHand', 'leftHand', 'body'], function(i, slot){
        var equipment = options[slot];
        if(equipment){
            this_.equipmentSet_.addChild(equipment, slot);
        }
    });

    if(options.skills){
        $.each(options.skills, function(name, rank){
            if(rank == 0){
                this_.body_.removeSkill(this_.skill(name));
            }else{
                this_.body_.setSkill(this_.skill(name), rank);
            }
        });
    }
};