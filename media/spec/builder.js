/**
 * スペックで各種オブジェクトの生成を容易にするためのヘルパー関数
 *
 * などとして使う
 */
mabi.Builder = function(){
};

/**
 * SkillClass を取得する
 * @param rank 指定された場合は Skill を生成する
 */
mabi.Builder.prototype.skill = function(name){
    var a = dam.skills.find({name: name});
    if(!a) throw 'error スキルが存在しません: ' + name;
    return a;
};

mabi.Builder.prototype.title = function(name){
    var a = dam.titles.find({name: name});
    if(!a) throw 'error タイトルが存在しません: ' + name;
    return a;
};

// 装備を作成する
mabi.Builder.prototype.equipment = function(options, flags){
    options = options || {};
    var this_ = this;
    if($.isPlainObject(options)){
        var effects = $.extend({}, options);
        delete effects.prefix;
        delete effects.suffix;
        var base = new mabi.EquipmentClass({effects: effects, flags: flags});
    }else{
        var base = dam.equipments.find({name: options});
        if(!base) throw 'error 装備が存在しません: ' + options;
    }
    var equipment = base.create();

    $.each(['prefix'], function(i, v){
        if(options[v]){
            equipment.enchant(this_.prefix(options[v]));
        }
    });

    return equipment;
};

mabi.Builder.prototype.equipmentSet = function(options, flags){
    var equipmentSet = new mabi.EquipmentSet;
    var this_ = this;
    $.each(['title', 'head', 'rightHand', 'leftHand', 'body'], function(i, slot){
        var equipment = options[slot];
        if(equipment){
            equipmentSet.addChild(equipment, slot);
        }
    });
    return equipmentSet;
};

// ES を作成する
mabi.Builder.prototype.prefix = function(effects){
    var base = new mabi.EnchantClass({effects: effects, rank: 1, type: 'prefix'});
    return base.create();
};

mabi.Builder.prototype.mob = function(effects){
    return mabi.ElementBuilder.mob(effects);
};

mabi.Builder.prototype.rightHandWeapon = function(effects, flags){
    flags = flags || [];
    flags = flags.concat(['weapon', 'rightHand']);
    
    return this.equipment(effects, flags);
};

mabi.Builder.prototype.twoHandWeapon = function(effects, flags){
    flags = flags || [];
    flags = flags.concat(['weapon', 'twoHand']);
    
    return this.equipment(effects, flags);
};
