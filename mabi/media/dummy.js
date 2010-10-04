/**
 * 開発用のスタブなど
 */
var tmp = {};

tmp.createEquipmentSet = function(json){
    var set = new mabi.EquipmentSet();
    set.setName(json.name);
    for(var slot in json.children){
	var row = json.children[slot];
	var equipment = row[0];
	var prefix = row[1];
	var suffix = row[2];

	var element = new mabi.ConcreteEquipment();
	element.addChild(mabi.Equipment.find(equipment), 'equipment');
	element.addChild(new mabi.ConcreteEnchant(mabi.enchants.find(prefix)), 'prefix');
	element.addChild(new mabi.ConcreteEnchant(mabi.enchants.find(suffix)), 'suffix');
	set.addChild(element, slot);
    }

    return set;
};

tmp.createDummtData = function(){
    return tmp.createEquipmentSet(
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