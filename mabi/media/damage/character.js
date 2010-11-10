
mabi.Character = function(options){
    this.super_.constructor.call(this, options);
};

util.extend(mabi.Character, mabi.Element);

mabi.Element.accessors(mabi.Character, ['body', 'equipmentSet']);

