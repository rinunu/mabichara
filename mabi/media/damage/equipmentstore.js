/**
 * Equipment の管理を行う
 *
 * インタフェースは Store と同様である。
 * todo Store による実装に変更する
 */
mabi.EquipmentStore = function(){
    this.super_.constructor.call(this);
};

util.extend(mabi.EquipmentStore, mabi.Elements);

mabi.EquipmentStore.prototype.load = function(){
    var this_ = this;

    var wands = [
	{
	    name: 'アイスワンド',
	    flags: ['ice'],
	    upgrades: [{}]
	}, {
	    name: 'ファイアワンド',
	    flags: ['fire'],
	    upgrades: [{}]
	}, {
	    name: 'ライトニングワンド',
	    flags: ['lightning'],
	    upgrades: [{}]
	}, {
	    name: 'クラウンアイスワンド',
	    flags: ['ice'],
	    upgrades: [
		{}, {
		    proficiency: 150,
		    effects: {weapon_magic_damage: 0.22}
		}, {
		    proficiency: 205,
		    effects: {weapon_magic_damage: 0.28}
		}
	    ]
	}, {
	    name: 'フェニックスファイアワンド',
	    flags: ['fire'],
	    upgrades: [
		{},
		{
		    proficiency: 245,
		    effects: {weapon_magic_damage: -0.06}
		}]
	}
    ];

    var specials = [
	{},
	{name: 'S3', effects: {sUpgradeMax: 9}},
        {name: 'R3', effects: {rUpgrade: 0.26}}
    ];

    var name = function(name, proficiency, special){
        var options = [];
        if(proficiency) options.push(proficiency + '式');
        if(special) options.push(special);
        
        if(options.length >= 1){
	    name += '(';
	    name += options.join(' ');
	    name += ')';
        }
        return name;
    };

    dam.combination([['wand', wands], ['special', specials]], function(map){
	var wand = map['wand'];
	var special = map['special'];
	$.each(wand.upgrades, function(i, upgrade){
            var a = new mabi.EquipmentClass({
		name: wand.name,
		flags: wand.flags
	    });
            a.setName(name(wand.name, upgrade.proficiency, special.name));
            a.addChild(new mabi.Element(upgrade));
            a.addChild(new mabi.Element(special));
	    this_.push(a);
	});
    });

    // ----------------------------------------------------------------------

    var src = [
        {
	    constant: 'HAND',
	    name: '素手',
	    effects: {
	        damageMax: 8,
	        critical: 0.1
	    }},
        {
	    name: '万能鍋',
            flags: ['cooking']
        },
        {
            name: '両手剣',
            flags: ['weapon', 'twoHand']
        },

        {
            name: 'シリンダー',
            flags: ['weapon', 'rightHand']
        },
        {
            name: 'ウォーターシリンダー',
            flags: ['weapon', 'rightHand'],
            effects: {
                weaponWaterAlchemyEfficiency: 0.15
            }
        },
        {
            name: 'タワーシリンダー',
            flags: ['weapon', 'twoHand'],
            effects: {
                alchemyEfficiency: 40
            }
        }
    ];
    $.each(src, function(i, v){
	var a = new mabi.EquipmentClass(v);
	this_.push(a);
    });


    return (new util.TimerCommand).execute();
};