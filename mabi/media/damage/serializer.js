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

mabi.Serializer.prototype.deserialize = function(dto){
};

// ----------------------------------------------------------------------
// private

/**
 * Element の型名を取得する
 */
mabi.Serializer.prototype.typeName = function(element){
    if(element.constructor == mabi.Mob){
        return 'Mob';
    }else if(element.constructor == mabi.EquipmentSet){
        return 'EquipmentSet';
    }else if(element.constructor == mabi.Equipment){
        return 'Equipment';
    }else if(element.constructor == mabi.Element){
        return 'Element';
    }else{
        throw '未対応の Element タイプです';
    }
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
    object.eachChild(function(child){
        children.push(this_.serialize(child));
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

