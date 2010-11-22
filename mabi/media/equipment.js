/**
 * 以下の情報にアクセスするためには load() する必要がある
 * - upgrades
 */
mabi.EquipmentClass = function(options){
    mabi.Element.call(this, options);
    if(options){
        this.ug_ = options.ug || 5;
        this.flags_ = options.flags || [];
    }
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
 * 装備の詳細が読み込まれているか調べる
 */
mabi.EquipmentClass.prototype.loaded = function(){
    return this.upgrades_ ? true : false;
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

/**
 * フラグを調査する
 */
mabi.EquipmentClass.prototype.is = function(flag){
    return $.inArray(flag, this.flags_) != -1;
};

// ----------------------------------------------------------------------
// NoEnchantedEquipment

mabi.NoEnchantedEquipment = function(base){
    mabi.Element.call(this);
    if(base){
	this.setBase(base);
    }
};

util.extend(mabi.NoEnchantedEquipment, mabi.Element);

/**
 * EquipmentClass を取得する
 */
mabi.NoEnchantedEquipment.prototype.base = function(base){
    return this.child('equipment').base();
};

mabi.NoEnchantedEquipment.prototype.setBase = function(base){
    var baseElement = new mabi.ReferenceElement(base);
    this.addChild(baseElement, 'equipment');
    this.updateName();
};

/**
 * N 回目の Upgrade を設定する
 * 
 * @param i 回数。 0〜N
 * @param upgrade Upgrade か UpgradeClass でなければならない。
 * null を指定した場合は、その回数の改造を取り消す
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
	    proficiency += c.proficiency();
	}
    });
    if(proficiency >= 1){
	name += '(' + proficiency + '式)';
    }else{
	name += '(未改造)';
    }
    this.setName(name);
};

// ----------------------------------------------------------------------
// Equipment

mabi.Equipment = function(base){
    mabi.Element.call(this);

    var noEnchant = new mabi.NoEnchantedEquipment;
    this.addChild(noEnchant, 'equipment');

    if(base){
	this.setBase(base);
    }
};

util.extend(mabi.Equipment, mabi.Element);
mabi.Element.accessors(mabi.Equipment, [
    'prefix', 'suffix', 'equipment']);

/**
 * エンチャントを追加する
 */
mabi.Equipment.prototype.enchant = function(enchant){
    console.assert(enchant instanceof mabi.Enchant);
    this.addChild(enchant, enchant.type());

    return this;
};

/**
 * Enchant のみを含む Element を取得する
 */
mabi.Equipment.prototype.enchants = function(){
    var result = new mabi.Element();
    $.each([this.prefix(), this.suffix()], function(i, v){
        if(v) result.addChild(v);
    });
    return result;
};

// 委譲メソッドを作成する
(function(){
    $.each(['base', 'setBase', 'setUpgrade'],
	   function(i, name){
	       mabi.Equipment.prototype[name] = function(){
		   var a = this.child('equipment');
		   return a[name].apply(a, arguments);
	       };
	   });

    $.each(['is'],
	   function(i, name){
	       mabi.Equipment.prototype[name] = function(){
		   var a = this.base();
		   return a[name].apply(a, arguments);
	       };
	   });
    
})();

