/**
 * スペックで各種オブジェクトの生成を容易にするためのヘルパー関数
 * 
 * with(mabi.builder){
 * }
 *
 * などとして使う
 */
mabi.builder = {
    skill: function(name){
        var a = dam.skills.find({name: name});
        if(!a) throw 'error';
        return a;
    },

    title: function(name){
        var a = dam.titles.find({name: name});
        if(!a) throw 'error';
        return a;
    },

    // 装備を作成する
    equipment: function(effects, flags){
        if($.isPlainObject(effects)){
            var base = new mabi.EquipmentClass({effects: effects, flags: flags});
        }else{
            var base = dam.equipments.find({name: effects});
            if(!base) throw 'error' + effects;
        }
        return base.create();
    },

    // ES を作成する
    prefix: function(effects){
        var base = new mabi.EnchantClass({effects: effects, rank: 1, type: 'prefix'});
        return base.create();
    },

    mob: function(effects){
        return mabi.ElementBuilder.mob(effects);
    },

    rightHandWeapon: function(effects, flags){
        flags = flags || [];
        flags = flags.concat(['weapon', 'rightHand']);
        
        return this.equipment(effects, flags);
    },

    twoHandWeapon: function(effects, flags){
        flags = flags || [];
        flags = flags.concat(['weapon', 'twoHand']);
        
        return this.equipment(effects, flags);
    }
};
