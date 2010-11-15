
describe("各種計算式", function() {
    var character_;
    var body;
    var expression;
    var equipmentSet;
    var mob_;

    // ダメージを計算する
    function damage(){
        var context = {
	    character: character_,
            mob: mob_
	};
	return Math.floor(expression.value(context));
    }

    // ES を作成する
    function prefix(effects){
        var base = new mabi.EnchantClass({effects: effects, rank: 1, type: 'prefix'});
        return base.create();
    }

    // 装備を作成する
    function equipment(effects, flags){
        var base = new mabi.EquipmentClass({effects: effects, flags: flags});
        return base.create();
    }

    function mob(effects){
        return mabi.ElementBuilder.mob(effects);
    }
    
    function rightHandWeapon(effects, flags){
        flags = flags || [];
        flags = flags.concat(['weapon', 'rightHand']);

        return equipment(effects, flags);
    }
    
    function twoHandWeapon(effects, flags){
        flags = flags || [];
        flags = flags.concat(['weapon', 'twoHand']);

        return equipment(effects, flags);
    }

    beforeEach(function(){
	body = new mabi.Body();
	equipmentSet = new mabi.EquipmentSet();
	character_ = new mabi.Character();
	character_.setBody(body);
	character_.setEquipmentSet(equipmentSet);
    });

    // http://mbng.at.webry.info/201005/article_10.html
    describe('魔法', function(){
	beforeEach(function(){
	    body.setSkill(dam.skills.ICEBOLT, 1);
	    body.setSkill(dam.skills.FIREBOLT, 1);
	    body.setSkill(dam.skills.LIGHTNING_BOLT, 1);
	    body.setSkill(dam.skills.FIREBALL, 1);
	    body.setSkill(dam.skills.THUNDER, 1);
	    body.setSkill(dam.skills.ICE_SPEAR, 1);
	});
	
	describe('Wiki 例', function(){
	    beforeEach(function(){
		body.setSkill(dam.skills.MAGIC_ICE_MASTERY, 1);
		body.setSkill(dam.skills.MAGIC_FIRE_MASTERY, 1);
		body.setSkill(dam.skills.MAGIC_LIGHTNING_MASTERY, 1);
		body.setSkill(dam.skills.MAGIC_BOLT_MASTERY, 1);
		body.setSkill(dam.skills.BOLT_COMPOSER, 1);
		body.setParam('int', 600);

		equipmentSet.setTitle(dam.titles.MAGIC_MASTER);

		mob_ = mob({protection: 0.1});
	    });
	    
	    // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	    it('Wiki 例1', function(){
		equipmentSet.setRightHand(dam.equipments.get('クラウンアイスワンド(150式)'));
		expression = mabi.damages.magic(dam.skills.ICEBOLT, {charge: 1});
		expect(damage()).toEqual(181);
	    });
	    
	    // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	    it('Wiki 例2', function() {
		equipmentSet.setRightHand(dam.equipments.get('フェニックスファイアワンド(245式)'));
		expression = mabi.damages.magic(dam.skills.FIREBALL, {charge: 5});
		expect(damage()).toEqual(3410);
	    });
	    
	    // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	    it('Wiki 例3', function() {
		equipmentSet.setRightHand(dam.equipments.get('フェニックスファイアワンド(245式 S3)'));
		expression = mabi.damages.magic(dam.skills.FIREBALL, {charge: 5});
		expect(damage()).toEqual(3424);
	    });
	    
	    // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	    it('Wiki 例4', function() {
		equipmentSet.setRightHand(dam.equipments.get('ファイアワンド(S3)'));
		expression = mabi.damages.fusedBolt(dam.skills.FIREBOLT, dam.skills.LIGHTNING_BOLT, {charge: 5});
		expect(damage()).toEqual(1864);
	    });
	});

	describe('http://aumiya.jugem.jp/?eid=173', function(){
	    beforeEach(function(){
		character_.setParam('int', 600);
		equipmentSet.setTitle(dam.titles.MAGIC_MASTER);
		mob_ = mob({protection: 0});
	    });

	    describe('マスタリなし', function(){
		it('クリティカル FBL', function() {
		    equipmentSet.setRightHand(dam.equipments.get('ファイアワンド'));
		    expression = mabi.damages.magic(dam.skills.FIREBALL, {charge: 5, critical: true});
		    expect(damage()).toEqual(9009);
		});
		it('クリティカル IS', function() {
		    // あわない。。
		    equipmentSet.setRightHand(dam.equipments.get('アイスワンド'));
		    expression = mabi.damages.magic(dam.skills.ICE_SPEAR, {charge: 5, critical: true});
		    expect(damage()).toEqual(5630);
		});

		it('クリティカル TH', function() {
		    // あわない。。
		    equipmentSet.setRightHand(dam.equipments.get('ライトニングワンド'));
		    expression = mabi.damages.magic(dam.skills.THUNDER, {charge: 5, critical: true});
		    expect(damage()).toEqual(8893);
		});
	    });
	});

	describe('近接', function(){
	    beforeEach(function(){
		character_.setParam('str', 100);
                body.setSkill(dam.skills.find('スマッシュ'), 1);

                equipmentSet.
                    setHead(
                        equipment().
                            enchant(prefix({str:10, damageMax:10})));
                
		mob_ = mob({protection: 0.1, defense: 10});
	    });

	    describe('片手武器(二刀流出来ない)', function(){
		beforeEach(function(){
		    equipmentSet.
                        setRightHand(
                            rightHandWeapon({damageMax: 100}).
                                enchant(prefix({str:10, damageMax:10}))).
                        setLeftHand(
                            equipment().
                                enchant(prefix({str:10, damageMax:10})));
		});

		it('アタックのダメージは本体性能 + 武器性能で計算される', function() {
		    expression = mabi.damages.attack();
                    var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10 + 10 + 10; // 最大ダメージ効果
                    var c = 100; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) - 10) * 0.9);
		    expect(damage()).toEqual(d);
		});

                it('スマッシュのダメージ', function() {
		    expression = mabi.damages.skill(dam.skills.find('スマッシュ'));
                    var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10 + 10 + 10; // 最大ダメージ効果
                    var c = 100; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) * 5 - 10) * 0.9);
		    expect(damage()).toEqual(d);
		});

	    });

            describe('両手武器', function(){
		beforeEach(function(){
                    equipmentSet.
                        setRightHand(
                            twoHandWeapon({damageMax: 100}).
                                enchant(prefix({str:10, damageMax:10})));
		});

		it('アタックのダメージは本体性能 + 武器性能で計算される', function() {
                    expression = mabi.damages.attack();
                    var a = (100 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10; // 最大ダメージ効果
                    var c = 100 + 10; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) - 10) * 0.9);
		    expect(damage()).toEqual(d);
		});

                it('スマッシュのダメージは6倍になる', function(){
		    expression = mabi.damages.skill(dam.skills.find('スマッシュ'));
                    var a = (100 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10; // 最大ダメージ効果
                    var c = 100 + 10; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) * 6 - 10) * 0.9);
		    expect(damage()).toEqual(d);
		});

	    });

            describe('両手装備(Not 武器)', function(){
		beforeEach(function(){
                    equipmentSet.
                        setRightHand(
                            equipment({damageMax: 100}, ['twoHand']).
                                enchant(prefix({str:10, damageMax:10})));
		});

                it('スマッシュのダメージは5倍', function(){
		    expression = mabi.damages.skill(dam.skills.find('スマッシュ'));
                    var a = (100 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10; // 最大ダメージ効果
                    var c = 100 + 10; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) * 5 - 10) * 0.9);
		    expect(damage()).toEqual(d);
		});

	    });

	    // 二刀流
            // ダメージ・クリ・バランスはその攻撃を行う武器によって計算される
            //
            // エンチャント
            // - ES は、その武器を使用したときにのみ効果がある
            // - ただし、ステータス変化 ES は常に効果がある
            //
	    // http://www.mabinogi.jp/6th/community/knowledgeContent.asp?ty=&c1=&c2=&lv=&od=&ix=18777&p=
	    // http://mabinogi.wikiwiki.jp/index.php?%B7%D7%BB%BB%BC%B0
            // http://mabinogi.wikiwiki.jp/index.php?cmd=read&page=%C0%EF%C6%AE%BB%D8%C6%EE%2F%C6%F3%C5%E1%CE%AE&word=%C6%F3%C5%E1%CE%AE
            // http://wiki.mabinogiworld.com/index.php?title=Dual_Wield
	    describe('二刀流', function(){
		beforeEach(function(){
                    equipmentSet.
                        setRightHand(
                            rightHandWeapon({damageMax: 100}).
                                enchant(prefix({str:10, damageMax:10}))).
                        setLeftHand(
                            rightHandWeapon({damageMax: 50}).
                                enchant(prefix({str:10, damageMax:10})));
		});

		it('アタックのダメージは右手・左手で別々に計算される', function() {
                    var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10; // 最大ダメージ効果
                    
                    expression = mabi.damages.attack();
                    var c = 100 + 10; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) - 10) * 0.9);
		    expect(damage()).toEqual(d);

                    expression = mabi.damages.attack({weapon: equipmentSet.leftHand()});
                    c = 50 + 10; // 武器最大ダメージ
                    d = Math.floor(((a + b + c) - 10) * 0.9);
		    expect(damage()).toEqual(d);
		});

                it('スマッシュのダメージは (本体 + 右手 + 左手) * 5', function(){
		    expression = mabi.damages.skill(dam.skills.find('スマッシュ'));
                    var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10; // 本体最大ダメージ効果
                    var c = (100 + 10) + (50 + 10); // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) * 5 - 10) * 0.9);
		    expect(damage()).toEqual(d);
		});
                
	    });
	});

        xit('スキルを持っていない場合、ダメージ計算は失敗する');


    });
});
