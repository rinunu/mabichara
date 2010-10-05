/**
 * 開発用のスタブなど
 */
var tmp = {};

tmp.createEquipment = function(equipmentName, prefixName, suffixName){
    var element = new mabi.ConcreteEquipment();

    var equipment = new mabi.NoEnchantedEquipment();
    equipment.addChild(mabi.Equipment.find(equipmentName), 'equipment');
    element.addChild(equipment, 'equipment');

    if(prefixName){
	element.addChild(new mabi.ConcreteEnchant(mabi.enchants.find(prefixName)), 'prefix');
    }
    if(suffixName){
	element.addChild(new mabi.ConcreteEnchant(mabi.enchants.find(suffixName)), 'suffix');
    }
    return element;
};

tmp.createEquipmentSet = function(json){
    var set = new mabi.EquipmentSet();
    set.setName(json.name);
    for(var slot in json.children){
	var row = json.children[slot];
	var equipment = row[0];
	var prefix = row[1];
	var suffix = row[2];

	var element = tmp.createEquipment(equipment, prefix, suffix);
	set.addChild(element, slot);
    }

    return set;
};

tmp.createDummtData = function(){
    tmp.set = tmp.createEquipmentSet(
	{
	    name: 'クリティカル特化装備セット',
	    children: {
		right_hand: ['ウィングボウ(1級 105式)', 'リザード', 'カリバーン'],
		head: ['帽子', '丸い', '火炎'],
		hand: ['グローブ', '鋼鉄針', '品位ある'],
		foot: ['ブーツ?', '作曲家の', '優雅な'],
		body: ['服', '不安な', 'ホワイトホース'],
		accessory1: ['アクセサリ', 'サプライジング', 'ヤグルマギク'],
		accessory2: ['アクセサリ', 'サプライジング', 'ヤグルマギク']
	    }
	}
    );
    // タイトル	ラノとコンヌースをつないだ

    mabi.inventory.addChild(
	tmp.createEquipmentSet(
	    {
		name: '',
		children: {
		    // title クリティカルヒットマスター
		    body: ['軽鎧', '原理の', null],
		    accessory1: ['アクセサリ', 'ライト', null]
		}
	    }));

    mabi.inventory.addChild(tmp.createEquipment('軽鎧', null, 'ダークネス')); // 暗黒(14)
    mabi.inventory.addChild(tmp.createEquipment('アクセサリ', 'ユリ'));
};

tmp.createEnchant = function(name, effects){
};

// ----------------------------------------------------------------------

mabi.Equipment.elements.push(
    new mabi.Equipment(
	{
	    name: '軽鎧',
	    effects: [
		{param: 'defense', op: '+', min: 4},
		{param: 'protection', op: '+', min: 1}]
	}),
    new mabi.Equipment(
	{
	    name: 'ウィングボウ(1級 105式)',
	    effects: [
		{param: 'attack_max', op: '+', min: 14},
		{param: 'critical', op: '+', min: 71}]
	}),
    new mabi.Equipment(
	{
	    name: '帽子'
	}),
    new mabi.Equipment(
	{
	    name: 'グローブ'
	}),
    new mabi.Equipment(
	{
	    name: 'ブーツ?'
	}),
    new mabi.Equipment(
	{
	    name: '服'
	}),
    new mabi.Equipment(
	{
	    name: 'アクセサリ'
	})
);