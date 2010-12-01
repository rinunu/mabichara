/**
 * Equipment の管理を行う
 *
 * インタフェースは Store と同様である。
 * todo Store による実装に変更する
 */
mabi.EquipmentStore = function(){
    this.super_.constructor.call(this);
};

util.extend(mabi.EquipmentStore, mabi.Collection);

mabi.EquipmentStore.prototype.load = function(){
    var this_ = this;

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
            name: '一般両手剣',
            flags: ['weapon', 'twoHand']
        },

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
	    flags: ['ice']
	}, {
	    name: 'フェニックスファイアワンド',
	    flags: ['fire']
	},

        {
            name: 'シリンダー',
            flags: ['weapon', 'rightHand']
        },
        {
            name: 'ウォーターシリンダー',
            flags: ['weapon', 'rightHand'],
            effects: {
                weaponWaterAlchemyEfficiency: 0.15,
                weaponFireAlchemyEfficiency: -0.05,
                weaponEarthAlchemyEfficiency: -0.05
            }
        },
        {
            name: 'ファイアシリンダー',
            flags: ['weapon', 'rightHand'],
            effects: {
                weaponWaterAlchemyEfficiency: -0.05,
                weaponFireAlchemyEfficiency: 0.15,
                weaponEarthAlchemyEfficiency: -0.05
            }
        },
        {
            name: 'タワーシリンダー',
            flags: ['weapon', 'twoHand'],
            effects: {
                alchemyEfficiency: 0.40
            }
        },
        {
            name: 'ボルケーノシリンダー',
            flags: ['weapon', 'rightHand'],
            effects: {
                weaponFireAlchemyEfficiency: 0.30
                // 不明
            }
        },
        {
            name: 'タイダルウェーブシリンダー',
            flags: ['weapon', 'rightHand'],
            effects: {
                weaponWaterAlchemyEfficiency: 0.30
                // 不明
            }
        }
    ];
    $.each(src, function(i, v){
	var a = new mabi.EquipmentClass(v);
	this_.push(a);
    });


    return (new util.TimerCommand).execute();
};