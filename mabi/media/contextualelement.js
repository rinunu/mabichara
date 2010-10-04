
mabi.ContextualElement = function(element, character, equipmentSet){
    this.element_ = element;
    this.character_ = character;
    this.equipmentSet_ = equipmentSet;
};

/**
 * 指定したパラメータの値を取得する
 */
mabi.ContextualElement.prototype.param = function(param){
    return this.element_.param(param, this.character_, this.equipmentSet_);
};

mabi.ContextualElement.prototype.name = function(){
    return this.element_.name();
};
