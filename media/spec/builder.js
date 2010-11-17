/**
 * スペックで各種オブジェクトの生成を容易にするためのヘルパー関数
 *
 * などとして使う
 */
mabi.Builder = function(){
};

mabi.Builder.prototype.skill = function(name){
    var a = dam.skills.find({name: name});
    if(!a) throw 'error';
    return a;
};

mabi.Builder.prototype.title = function(name){
    var a = dam.titles.find({name: name});
    if(!a) throw 'error';
    return a;
};

// 装備を作成する
mabi.Builder.prototype.equipment = function(effects, flags){
    if($.isPlainObject(effects)){
        var base = new mabi.EquipmentClass({effects: effects, flags: flags});
    }else{
        var base = dam.equipments.find({name: effects});
        if(!base) throw 'error' + effects;
    }
    return base.create();
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
