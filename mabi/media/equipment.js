/**
 * 以下の情報にアクセスするためには load() する必要がある
 * - upgrades
 */
mabi.EquipmentClass = function(options){
    mabi.Element.call(this, options);
    this.ug_ = options.ug;
};

util.extend(mabi.EquipmentClass, mabi.Element);

/**
 * 本装備を実体化した装備を作成する
 */
mabi.EquipmentClass.prototype.create = function(){
    var equipment = new mabi.Equipment(this);
    return equipment;
};

/**
 * 装備の詳細を非同期に読み込む
 */
mabi.EquipmentClass.prototype.load = function(){
    return mabi.equipments.loadDetail(this);
};

/**
 * Upgrade 情報を取得する
 */
mabi.EquipmentClass.prototype.upgrades = function(options){
    console.assert(this.upgrades_);
    return this.upgrades_;
};

/**
 * 情報を更新する(load した結果を設定するために使用する)
 */
mabi.EquipmentClass.prototype.set = function(options){
    this.upgrades_ = options.upgrades;
};

// ----------------------------------------------------------------------
// NoEnchantedEquipment

mabi.NoEnchantedEquipment = function(base){
    mabi.Element.call(this);
    this.addChild(base, 'equipment');
    this.updateName();
};

util.extend(mabi.NoEnchantedEquipment, mabi.Element);

/**
 * N 回目の Upgrade を設定する
 * 
 * upgrade は Upgrade, UpgradeClass でなければならない
 */
mabi.NoEnchantedEquipment.prototype.setUpgrade = function(i, upgrade){
    if(upgrade instanceof mabi.Upgrade){
    }else if(upgrade instanceof mabi.UpgradeClass){
	upgrade = upgrade.create();
    }else{
	console.assert(false);
    }
    this.addChild(upgrade, 'upgrade' + i);
    this.updateName();
};

// ----------------------------------------------------------------------
// private

mabi.NoEnchantedEquipment.prototype.updateName = function(){
    var name = this.child('equipment').name();
    var proficiency = 0;
    this.eachChild(function(c, slot){
		       if(slot.indexOf('upgrade') == 0){
			   proficiency += c.proficiency()
		       }
		   });
    if(proficiency >= 1){
	name += '(' + proficiency + '式)';
    }
    this.setName(name);
};

// ----------------------------------------------------------------------
// Equipment

mabi.Equipment = function(base){
    console.assert(base instanceof mabi.EquipmentClass);
    mabi.Element.call(this);

    this.addChild(new mabi.NoEnchantedEquipment(base), 'equipment');
};

util.extend(mabi.Equipment, mabi.Element);

/**
 * EquipmentClass を取得する
 */
mabi.Equipment.prototype.base = function(){
    return this.child('equipment').child('equipment');
};

/**
 * エンチャントを追加する
 */
mabi.Equipment.prototype.enchant = function(enchant){
    console.assert(enchant instanceof mabi.Enchant);
    this.addChild(enchant, enchant.type());
};

mabi.Equipment.prototype.setUpgrade = function(i, upgrade){
    this.child('equipment').setUpgrade(i, upgrade);
};

