mabi.Serializer = function(){
};

mabi.Serializer.prototype.serialize = function(object){
    var this_ = this;
    if(object instanceof mabi.Effect){
        return this.simple(object, ['op', 'param', 'min']);
    }else if(object instanceof mabi.Element){
        console.assert(object.childrenLength() == 0);
        var a = this.simple(object, ['name']);
        a.effects = [];
        object.eachEffect(function(effect){
            a.effects.push(this_.serialize(effect));
        });
        return a;
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
 * 指定されたプロパティのみからなるオブジェクトを返す
 */
mabi.Serializer.prototype.simple = function(object, names){
    var result = {};
    $.each(names, function(i, name){
        result[name] = object[name]();
    });
    return result;
};

