/**
 * 開発用のスタブなど
 */
var tmp = {};

tmp.createEquipment = function(equipment, prefix, suffix){
    var a = new mabi.ConcreteEquipment();
    a.addChild(mabi.Equipment.find(equipment), 'equipment');
    a.addChild(new mabi.ConcreteEnchant(mabi.Enchant.find(prefix)), 'prefix');
    a.addChild(new mabi.ConcreteEnchant(mabi.Enchant.find(suffix)), 'suffix');
    return a;
};

tmp.createDummtData = function(){
    var set = new mabi.EquipmentSet();
    set.setName('クリティカル特化装備セット');
    set.addChild(tmp.createEquipment("帽子", "荒い", "盗賊"), 'head');
    set.addChild(tmp.createEquipment("軽鎧", "荒い", "盗賊"), 'body');

    tmp.set = set;
};

tmp.createEnchant = function(name, effects){
};

// ----------------------------------------------------------------------

mabi.Enchant.elements.push(
    tmp.createEnchant(
	'カリバーン',
	[['maxDamage', 10],
	 ['critical', 10],
	 ['mana', 10],
	 ['repairCost', 10]]),

    tmp.createEnchant(
	'グロリアス',
	[['critical', 8, 'lv>=25'],
	 ['maxDamage', 5, 'マナシールド>=10'],
	 ['maxDamage', 6, 'レンジアタック>=3'],
	 ['str', -20],
	 ['repairCost', 3]]),

    new mabi.Enchant(
	{
	    name: '暗黒',
	    effects: [
		{effect: 'defense', min: -3},
		{effect: 'will', min: -5},
		{effect: 'maxDamage', min: -5, condition: 'lv>=30'}
	    ]}),
    new mabi.Enchant(
	{
	    name: '荒い',
	    effects: [
		{effect: 'dex', min: -10, condition: 'ライトニングボルト>=10'},
		{effect: 'maxInjury', min: 10, condition: 'スマッシュ>=9'},
		{effect: 'critical', min: 10}
	    ]}),

    new mabi.Enchant(
	{
	    name: '盗賊',
	    effects: [
		{effect: 'life', min: -15, condition: 'lv>=25'},
		{effect: 'luck', min: 10, condition: 'lv>=30'}
	    ]}),

    new mabi.Enchant(
	{
	    name: '原理の',
	    effects: [
		{effect: 'str', min: 5},
		{effect: 'int', min: 5},
		{effect: 'dex', min: 5},
		{effect: 'critical', min: 16, condition: 'title=クリティカルヒットマスター'},
		{effect: 'critical', min: 6, condition: 'title=メイズ平原遺跡を見つけた'},
		{effect: 'repairCost', min: 1.12}
	    ]})
);


mabi.Equipment.elements.push(
    new mabi.Equipment(
	{
	    name: '軽鎧',
	    effects: [
		new mabi.Effect({effect: 'defense', min: 4}),
		new mabi.Effect({effect: 'protection', min: 1})]
	}),
    new mabi.Equipment(
	{
	    name: '帽子'
	})
);