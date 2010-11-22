
mabi.Character = function(options){
    mabi.Element.call(this, options);
};

util.extend(mabi.Character, mabi.Element);

mabi.Element.accessors(mabi.Character, ['body', 'equipmentSet']);

