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
 * 指定したエンチャントを貼った装備を作成する
 */
tmp.createEquipment = function(equipmentName, prefixName, suffixName){
    var equipment = tmp.get(mabi.equipments, equipmentName).create();
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

    mabi.inventory.addChild(tmp.createEquipment('軽鎧', null, 'ダークネス')); // 暗黒(14)
    mabi.inventory.addChild(tmp.createEquipment('アクセサリ', 'ユリ'));
};

tmp.run = function(){
    console.log('処理開始');

    mabi.enchants.load().success(tmp.onEnchantsLoaded);
    tmp.addDummyEquipments();
};

tmp.onEnchantsLoaded = function(){
    console.log('Enchant ロード完了');

    mabi.equipments.load().success(tmp.onEquipmentsLoaded);
};

tmp.onEquipmentsLoaded = function(){
    console.log('Equipment ロード完了');

    mabi.titles.load().success(tmp.onTitlesLoaded);
};

tmp.onTitlesLoaded = function(){
    console.log('Title ロード完了');
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
