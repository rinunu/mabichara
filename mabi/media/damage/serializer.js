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
 * 
 */
mabi.Serializer.prototype.serializeElement = function(object){
    var this_  = this;
    var result = this.simple(object, ['name']);
    
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

