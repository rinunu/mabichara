/**
 * 開発用のスタブなど
 */
var tmp = {};

/**
 * Store から指定された名前の要素を取得する
 */
tmp.get = function(store, name){
    var result = null;
    store.each(function(i, element){
		   if(element.name() == name){
		       result = element;
		       return false;
		   }
		   return true;
	       });

    if(!result){
	throw 'error:' + name;
    }
    return result;
};

/**
 * 武器に指定した改造を施す
 */
tmp.upgrade = function(equipment, i, name){
    var upgrade = null;
    $.each(equipment.base().upgrades(), function(i, v){
	       if(v.name() == name){
		   upgrade = v;
		   return false;
	       }
	       return true;
	   });
    if(!upgrade){
	throw 'error' + name;
    }

    equipment.setUpgrade(i, upgrade);
};

/**
 * 指定したエンチャントを貼った装備を作成する
 */
tmp.createEquipment = function(equipmentInfo, prefixName, suffixName){
    if(equipmentInfo instanceof Array){
	var class_ = tmp.get(mabi.equipments, equipmentInfo[0]);
	var equipment = class_.create();
	$.each(equipmentInfo[1].split('＞'), function(i, v){
		   tmp.upgrade(equipment, i, v);
	       });
    }else{
	var equipment = tmp.get(mabi.equipments, equipmentInfo).create();
    }

    if(prefixName){
	equipment.enchant(tmp.get(mabi.enchants, prefixName).create());
    }
    if(suffixName){
	equipment.enchant(tmp.get(mabi.enchants, suffixName).create());
    }
    return equipment;
};

tmp.createEquipmentSet = function(json){
    var set = new mabi.EquipmentSet();
    set.setName(json.name);
    for(var slot in json.children){
	var row = json.children[slot];
	if(slot == 'title'){
	    set.addChild(tmp.get(mabi.titles, row), slot);
	}else{
	    var equipment = row[0];
	    var prefix = row[1];
	    var suffix = row[2];
	    
	    var element = tmp.createEquipment(equipment, prefix, suffix);
	    set.addChild(element, slot);
	}
    }

    return set;
};

/**
 * ダミーの装備セットを作成する
 */
tmp.createDummtData = function(){
    tmp.set = tmp.createEquipmentSet(
    	{
    	    name: 'クリティカル特化装備セット',
    	    children: {
		title: 'ラノとコンヌースをつないだ',
    		right_hand: ['ウィングボウ', 'リザード', 'カリバーン'],
    		head: ['帽子', '丸い', '火炎'],
    		hand: ['グローブ', '鋼鉄針', '品位ある'],
    		foot: ['ブーツ?', '作曲家の', '優雅な'],
    		body: ['服', '不安な', 'ホワイトホース'],
    		accessory1: ['アクセサリ', 'サプライジング', 'ヤグルマギク'],
    		accessory2: ['アクセサリ', 'サプライジング', 'ヤグルマギク']
    	    }
    	}
    );

    mabi.inventory.addChild(
    	tmp.createEquipmentSet(
    	    {
    		name: '',
    		children: {
    		    title: 'クリティカルヒットマスター',
    		    body: ['軽鎧', '原理の', null],
    		    accessory1: ['アクセサリ', 'ライト', null]
    		}
    	    }));

    mabi.inventory.addChild(tmp.createEquipment('軽鎧', null, 'ダークネス'));
    mabi.inventory.addChild(tmp.createEquipment('アクセサリ', 'ユリ'));

    // ウィングボウ(1級105式)
    mabi.inventory.addChild(
	tmp.createEquipment(
	    ['ウィングボウ',
	     'チップ強化1＞チップ強化2＞チップ強化3＞チップ強化3＞チップ強化3']));

    // エルブンショートボウ(1級103式)
    // エルブンショートボウ(S級103式)
    mabi.inventory.addChild(
	tmp.createEquipment(
	    ['エルブンショートボウ',
	     'メレス式強化＞チップ強化2＞弓の弦強化1＞弓の弦強化2＞弓の弦強化3']));

    // エルブンショートボウ(S級127式)
    mabi.inventory.addChild(
	tmp.createEquipment(
	    ['エルブンショートボウ',
	     'メレス式強化＞チップ強化2＞チップ強化3＞チップ強化4＞チップ強化4']));

    // エルブンショートボウ(S級125式)
    mabi.inventory.addChild(
	tmp.createEquipment(
	    ['エルブンショートボウ',
	     'メレス式強化＞弓の弦の交換＞弓の弦の交換＞弓の弦強化2＞弓の弦強化3']));

    // エルブンショートボウ(S級92式)
    mabi.inventory.addChild(
	tmp.createEquipment(
	    ['エルブンショートボウ',
	     'メレス式改造＞照準器交換＞照準器交換＞照準器交換']));

    // エルブンショートボウ(S級115式)
    mabi.inventory.addChild(
	tmp.createEquipment(
	    ['エルブンショートボウ',
	     'メレス式改造＞弓の弦の交換＞弓の弦の交換＞弓の弦強化2＞弓の弦強化3']));

    // エルブンショートボウ(S級126式)
    mabi.inventory.addChild(
	tmp.createEquipment(
	    ['エルブンショートボウ',
	     'メレス式改造＞弓の弦の交換＞弓の弦の交換＞チップ強化4＞弓の弦強化3']));

    // エルブンショートボウ(S級132式)
    mabi.inventory.addChild(
	tmp.createEquipment(
	    ['エルブンショートボウ',
	     'メレス式改造＞弓の弦の交換＞弓の弦の交換＞チップ強化4＞チップ強化4']));
};

tmp.run = function(){
    console.log('処理開始');
    tmp.addDummyEquipments();

    mabi.equipments.load().success(
	function(){
	    console.log('loaded 1');
	    var c = new util.ConcurrentCommand([]);
	    c.add(mabi.enchants.load());
	    c.add(mabi.titles.load());
	    c.add(tmp.get(mabi.equipments, 'ウィングボウ').load());
	    c.add(tmp.get(mabi.equipments, 'ハイランダーロングボウ').load());
	    c.add(tmp.get(mabi.equipments, 'エルブンショートボウ').load());
	    c.add(tmp.get(mabi.equipments, 'ショートボウ').load());
	    c.success(tmp.onLoaded);
	});
};

tmp.onLoaded = function(){
    console.log('loaded 2');
    tmp.createDummtData();
    mabi.equipmentSetView.setModel(tmp.set);
};

/**
 * ダミーの装備情報を登録する
 */
tmp.addDummyEquipments = function(){
    mabi.equipments.add(
	new mabi.EquipmentClass(
	    {
		name: '軽鎧',
		effects: [
		    {param: 'defense', op: '+', min: 4},
		    {param: 'protection', op: '+', min: 1}]
	    }));
    mabi.equipments.add(
	new mabi.EquipmentClass(
	    {
		name: '帽子'
	    }));
    mabi.equipments.add(
	new mabi.EquipmentClass(
	    {
		name: 'グローブ'
	    }));
    mabi.equipments.add(
	new mabi.EquipmentClass(
	    {
		name: 'ブーツ?'
	    }));
    mabi.equipments.add(
	new mabi.EquipmentClass(
	    {
		name: '服'
	    }));
    mabi.equipments.add(
	new mabi.EquipmentClass(
	    {
		name: 'アクセサリ'
	    }));
};

    // new mabi.Equipment(
    // 	{
    // 	    name: 'ウィングボウ(1級 105式)',
    // 	    effects: [
    // 		{param: 'attack_max', op: '+', min: 14},
    // 		{param: 'critical', op: '+', min: 71}]
    // 	}),
