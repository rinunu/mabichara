mabi.Serializer = function(){
};

mabi.Serializer.prototype.serialize = function(object){
    var this_ = this;
    if(object instanceof mabi.Effect){
        return this.simple(object, ['op', 'param', 'min']);
    }else if(object instanceof mabi.Element){
        return this.serializeElement(object);
    }else if(object instanceof Array){
        var result = [];
        $.each(object, function(i, v){
            result.push(this_.serialize(v));
        });
        return result;
    }
    throw '未対応';
};

mabi.Serializer.prototype.deserializeEffect = function(json){
    var this_ = this;
    return new mabi.Effect(json);
};

mabi.Serializer.prototype.deserializeElement = function(json){
    var this_ = this;
    var result = new (this.type(json.type))({
        name: json.name
    });

    if(json.effects){
        $.each(json.effects, function(i, effect){
            result.addEffect(this_.deserializeEffect(effect));
        });
    }
    
    if(json.children){
        $.each(json.children, function(i, child){
            result.addChild(
                this_.deserializeElement(child),
                child.slot
            );
        });
    }
    return result;
};


// ----------------------------------------------------------------------
// private

(function(){
    var map = {
        Mob: mabi.Mob,
        Element: mabi.Element,
        EquipmentSet: mabi.EquipmentSet,
        Equipment: mabi.Equipment
    };

    mabi.Serializer.NAME_TO_TYPE = map;
})();

/**
 * Element の型名を取得する
 */
mabi.Serializer.prototype.typeName = function(element){
    var result;
    $.each(mabi.Serializer.NAME_TO_TYPE, function(name, type){
        if(element.constructor == type){
            result = name;
            return false;
        }
        return true;
    });
    if(!result) throw '未対応の Element タイプです';
    return result;
};

/**
 * Element の型を取得する
 */
mabi.Serializer.prototype.type = function(name){
    var type = mabi.Serializer.NAME_TO_TYPE[name];
    if(!type) throw '未対応の型です:' + name;
    return type;
};

/**
 * 
 */
mabi.Serializer.prototype.serializeElement = function(object){
    var this_  = this;
    var result = this.simple(object, ['name']);

    result.type = this.typeName(object);
    
    var effects = [];
    object.effects().each(function(i, effect){
        effects.push(this_.serialize(effect));
    });
    if(effects.length > 0)result.effects = effects;

    var children = [];
    object.eachChild(function(child, slot){
        child = this_.serialize(child);
        child.slot = slot;
        children.push(child);
    });
    if(children.length > 0)result.children = children;
    
    return result;
};

/**
 * 指定されたプロパティのみからなるオブジェクトを返す
 */
mabi.Serializer.prototype.simple = function(object, names){
    var result = {};
    $.each(names, function(i, name){
        result[name] = object[name]();
    });
    return result;
};

