
describe("各種計算式", function() {
    var character_;
    var body;
    var expression;
    var equipmentSet;
    var mob_;

    function skill(name){
        var a = dam.skills.find({name: name});
        if(!a) throw 'error';
        return a;
    }
    
    function title(name){
        var a = dam.titles.find({name: name});
        if(!a) throw 'error';
        return a;
    }

    // 装備を作成する
    function equipment(effects, flags){
        if($.isPlainObject(effects)){
            var base = new mabi.EquipmentClass({effects: effects, flags: flags});
        }else{
            var base = dam.equipments.find({name: effects});
            if(!base) throw 'error' + effects;
        }
        return base.create();
    }

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

        mob_ = mob({protection: 0, defense: 0});
    });

    // todo 魔法とエンチャント
    // http://mbng.at.webry.info/201005/article_10.html
    describe('魔法', function(){    

        xit('特別改造');
        xit('近接武器に持ち替えた場合の特別改造は乗るのか?');

        // http://mabimaho.exblog.jp/11715223
        xit('ブレイズ');
    });

    describe('近接', function(){
	beforeEach(function(){
	    character_.setParam('str', 100);
            body.setSkill(skill('スマッシュ'), 1);

            equipmentSet.
                setHead(
                    equipment({}).
                        enchant(prefix({str:10, damageMax:10})));
            
	    mob_ = mob({protection: 0.1, defense: 10});
	});

	describe('片手武器', function(){
	    beforeEach(function(){
		equipmentSet.
                    setRightHand(
                        rightHandWeapon({damageMax: 100}).
                            enchant(prefix({str:10, damageMax:10}))).
                    setLeftHand(
                        equipment({}).
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
		expression = mabi.damages.skill(skill('スマッシュ'));
                var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                var b = 10 + 10 + 10; // 最大ダメージ効果
                var c = 100; // 武器最大ダメージ
                var d = Math.floor(((a + b + c) * 5 - 10) * 0.9);
		expect(damage()).toEqual(d);
	    });
            
            it('スキル使用時のクリティカルのダメージ', function() {
		expression = mabi.damages.skill(skill('スマッシュ'), {generator: 'maxCritical'});
                var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                var b = 10 + 10 + 10; // 最大ダメージ効果
                var c = 100; // 武器最大ダメージ
                var d = Math.floor(((a + b + c) * 5 * 2.5 - 10) * 0.9);
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
		expression = mabi.damages.skill(skill('スマッシュ'));
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
		expression = mabi.damages.skill(skill('スマッシュ'));
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
		expression = mabi.damages.skill(skill('スマッシュ'));
                var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                var b = 10; // 本体最大ダメージ効果
                var c = (100 + 10) + (50 + 10); // 武器最大ダメージ
                var d = Math.floor(((a + b + c) * 5 - 10) * 0.9);
		expect(damage()).toEqual(d);
	    });
            
	});
    });

    // http://mabinogi.wikiwiki.jp/index.php?%C1%F5%C8%F7%2F%C6%C3%CA%CC%B2%FE%C2%A4
    describe('特別改造', function(){
	beforeEach(function(){
            body.setSkill(skill('スマッシュ'), 1);
	    mob_ = mob({protection: 0, defense: 0});
	});

        describe('R改造', function(){
            describe('片手武器', function(){
                beforeEach(function(){
		    equipmentSet.
                        setRightHand(rightHandWeapon({damageMax: 100, rUpgrade: 0.18}));
	        });

                it('ノンクリのダメージは増加しない', function(){
                    expression = mabi.damages.attack();
                    var c = 100; // 武器最大ダメージ
                    var d = Math.floor(c);
		    expect(damage()).toEqual(d);
                });
                
                it('アタッククリ時、ベースダメージ * (クリスキル倍率 + X) となる', function(){
                    expression = mabi.damages.attack({generator: 'maxCritical'});
                    var c = 100; // 武器最大ダメージ
                    var d = Math.floor(c * (2.5 + 0.18));
		    expect(damage()).toEqual(d);
                });
                
                it('スマッシュクリ時、ベースダメージ * (クリスキル倍率 + X) となる', function(){
                    expression = mabi.damages.skill(skill('スマッシュ'), {generator: 'maxCritical'});
                    var c = 100; // 武器最大ダメージ
                    var d = Math.floor(c * 5 * (2.5 + 0.18));
		    expect(damage()).toEqual(d);
                });
            });
            
            describe('2刀流', function(){
                beforeEach(function(){
		    equipmentSet.
                        setRightHand(rightHandWeapon({damageMax: 100, rUpgrade: 0.18})).
                        setLeftHand(rightHandWeapon({damageMax: 50, rUpgrade: 0.18}));
	        });

                xit('アタック時は・・わかりませんでした');

                // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1261413038/590
                // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1276271205/965
                it('スマッシュクリ時、ベースダメージ * (クリスキル倍率 + 右手R + 左手R) となる', function(){
                    expression = mabi.damages.skill(skill('スマッシュ'), {generator: 'maxCritical'});
                    var c = 100 + 50; // 武器最大ダメージ
                    var d = Math.floor(c * 5 * (2.5 + 0.18 * 2));
		    expect(damage()).toEqual(d);
                });
            });

            // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1276271205/972
            xit('分身術には武器のR改造が乗る');
        });

        describe('S改造', function(){
            describe('片手武器', function(){
                beforeEach(function(){
		    equipmentSet.
                        setRightHand(rightHandWeapon({damageMax: 100, sUpgradeMax: 13}));
	        });

                it('ダメージは + X となる', function(){
                    expression = mabi.damages.attack();
                    var c = 100 + 13; // 武器最大ダメージ
                    var d = Math.floor(c);
		    expect(damage()).toEqual(d);
                });
                
                xit('クリ時、わかりませんでした・・', function(){
                });
                
                xit('スマッシュ時、わかりませんでした・・', function(){
                });
            });
            
            describe('2刀流', function(){
                beforeEach(function(){
		    equipmentSet.
                        setRightHand(rightHandWeapon({damageMax: 100, sUpgradeMax: 13})).
                        setLeftHand(rightHandWeapon({damageMax: 50, sUpgradeMax: 13}));
	        });

                xit('アタック時は・・わかりませんでした');
                xit('スマッシュ時、わかりませんでした', function(){
                });
            });

        });

    });

    describe('その他', function(){

        // 期待値を求める(バランス計算は行わず、 80% 固定とする)
        //
        // クリを含まない期待値 a = (max - min) * 0.75 + min
        // クリを含む期待値は「a * 0.7 + {a + (max * クリ倍率)} * 0.3」となる
        // 
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%C6%A1%BC%A5%BF%A5%B9%2F%A5%D0%A5%E9%A5%F3%A5%B9
        // http://lab.lowreal.net/test/mabinogi/damage.html
        // http://www.mabinogi.jp/6th/community/knowledgeContent.asp?ty=&c1=&c2=&lv=0&od=&ix=19117&p=
        describe('期待値', function(){
            it('バランス80%、クリ30% 時の期待値', function(){
		equipmentSet.setRightHand(rightHandWeapon({damageMin: 10, damageMax: 100}));
                expression = mabi.damages.attack({generator: 'expectation'});
		expect(damage()).toEqual(122); // 結果は上記計算機より(ただし小数点切り捨て)
            });
            
            xit('魔法のバランスは100%までいく');
        });
    });

    describe('具体例', function(){

        // http://www.mabinogi.jp/6th/community/knowledgeContent.asp?ty=&c1=&c2=&lv=0&od=&ix=19117&p=
        // > 通常 ：最小60最大110クリ30%の時ダメージ期待値は147
        // 青3段：最小70最大131クリ30%の時ダメージ期待値は174.7
        // 赤3段：最小60最大110クリ30%の時ダメージ期待値は155.8
        describe('特別改造(両手剣・弓)', function(){
	    beforeEach(function(){
                expression = mabi.damages.attack({generator: 'expectation'});
	    });

            it('改造なし', function(){
                equipmentSet.setRightHand(rightHandWeapon({damageMin: 60, damageMax: 110}));
		expect(damage()).toEqual(147);
            });
            
            it('S改造', function(){
                equipmentSet.setRightHand(rightHandWeapon({damageMin: 60, damageMax: 110, sUpgradeMin: 10, sUpgradeMax: 21}));
                expect(damage()).toEqual(174);
            });
            
            it('R改造', function(){
                console.log('R改造');
                equipmentSet.setRightHand(rightHandWeapon({damageMin: 60, damageMax: 110, rUpgrade: 0.26}));
                expect(damage()).toEqual(155);
            });
        });

        // http://mabinogi.wikiwiki.jp/index.php?%C1%F5%C8%F7%2F%C6%C3%CA%CC%B2%FE%C2%A4
        // > 上にも出ていますが青で最大+21　赤でクリ倍率+26%　クリ1を前提に計算してみました
        // バランス80%(期待値は約75%)の時、特別改造無しのクリを考えないダメージ期待値272.75(＝最小0最大363)(クリ30%を考慮した期待値で436.1)で赤が1ダメージほど優位になる結果となりました
        describe('特別改造(両手剣・弓)', function(){
	    beforeEach(function(){
                expression = mabi.damages.attack({generator: 'expectation'});
	    });

            it('改造なし', function(){
                // 272.75 * 0.7 + (272.75 + 363 * 1.5) * 0.3 
                equipmentSet.setRightHand(rightHandWeapon({damageMin: 0, damageMax: 363}));
		expect(damage()).toEqual(436);
            });
            
            it('R改造', function(){
                console.log('R改造');
                equipmentSet.setRightHand(rightHandWeapon({damageMin: 0, damageMax: 363, rUpgrade: 0.26}));
		expect(damage()).toEqual(464);
            });
            
            it('S改造', function(){
                equipmentSet.setRightHand(rightHandWeapon({damageMin: 0, damageMax: 363, sUpgradeMin: 10, sUpgradeMax: 21}));
		expect(damage()).toEqual(463);
            });
        });
        
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

		    equipmentSet.setTitle(title('マジックマスター'));

		    mob_ = mob({protection: 0.1});
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例1', function(){
		    equipmentSet.setRightHand(equipment('クラウンアイスワンド(150式)'));
		    expression = mabi.damages.skill(dam.skills.ICEBOLT, {charge: 1});
		    expect(damage()).toEqual(181);
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例2', function() {
		    equipmentSet.setRightHand(equipment('フェニックスファイアワンド(245式)'));
		    expression = mabi.damages.skill(dam.skills.FIREBALL, {charge: 5});
		    expect(damage()).toEqual(3410);
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例3', function() {
		    equipmentSet.setRightHand(equipment('フェニックスファイアワンド(245式 S3)'));
		    expression = mabi.damages.skill(dam.skills.FIREBALL, {charge: 5});
		    expect(damage()).toEqual(3424);
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例4', function() {
		    equipmentSet.setRightHand(equipment('ファイアワンド(S3)'));
		    expression = mabi.damages.fusedBolt(dam.skills.FIREBOLT, dam.skills.LIGHTNING_BOLT, {charge: 5});
		    expect(damage()).toEqual(1864);
	        });
	    });

            
	    describe('http://aumiya.jugem.jp/?eid=173', function(){
	        beforeEach(function(){
		    character_.setParam('int', 600);
		    equipmentSet.setTitle(title('マジックマスター'));
		    mob_ = mob({protection: 0});
	        });

	        describe('マスタリなし', function(){
		    it('クリティカル FBL', function() {
		        equipmentSet.setRightHand(equipment('ファイアワンド'));
		        expression = mabi.damages.skill(dam.skills.FIREBALL, {charge: 5, generator: 'maxCritical'});
		        expect(damage()).toEqual(9009);
		    });
		    it('クリティカル IS', function() {
		        // あわない。。
		        equipmentSet.setRightHand(equipment('アイスワンド'));
		        expression = mabi.damages.skill(dam.skills.ICE_SPEAR, {charge: 5, generator: 'maxCritical'});
		        expect(damage()).toEqual(5630);
		    });

		    it('クリティカル TH', function() {
		        // あわない。。
		        equipmentSet.setRightHand(equipment('ライトニングワンド'));
		        expression = mabi.damages.thunder(dam.skills.THUNDER, {charge: 5, generator: 'maxCritical'});
		        expect(damage()).toEqual(8893);
		    });
	        });
	    });

            // http://mabimaho.exblog.jp/page/2/
            // 合わない。。 バランス80で計算してるので、本来はさらにダメージが上がるから、さらにあわない・・
	    describe('魔法期待値', function(){
	        beforeEach(function(){
		    body.setSkill(dam.skills.MAGIC_ICE_MASTERY, 1);
		    body.setSkill(dam.skills.MAGIC_FIRE_MASTERY, 1);
		    body.setSkill(dam.skills.MAGIC_LIGHTNING_MASTERY, 1);
		    body.setSkill(dam.skills.MAGIC_BOLT_MASTERY, 1);
		    body.setSkill(dam.skills.BOLT_COMPOSER, 1);
		    body.setParam('int', 700);

		    // equipmentSet.setTitle(title('マジックマスター'));
                });

                it('LB S改造', function(){
                    equipmentSet.setRightHand(equipment('ライトニングワンド(S3)'));
		    expression = mabi.damages.skill(dam.skills.LIGHTNING_BOLT, {generator: 'expectation'});
		    expect(damage()).toEqual(317.8);
	        });
                it('LB R改造', function(){
                    equipmentSet.setRightHand(equipment('ライトニングワンド(R3)'));
		    expression = mabi.damages.skill(dam.skills.LIGHTNING_BOLT, {generator: 'expectation'});
		    expect(damage()).toEqual(316.6);
	        });

                // > 合成ボルト魔法の場合、S改造分のダメージ２回計算式にかかってくるのですね。
                // Int700、各種マスタリRank1、S改造+9、CIW+22%改造で合成魔法の場合ですが、保護無視で39.8(計算違ってたらごめんなさい）の追加ダメージとなるとかなり大きいですね。
                // 中級魔法もあるし、単純にR改造かなって思ってましたけどS改造バカにできない(￣￢￣*)
                // => おそらくボルト合成魔法の 0.15 を忘れてると思われるので、39.8 * 1.15 = 45 であってるはず？
                it('IB+FB S3', function(){
                    // 39.8 = 18 * (1 + 0.35 + 0.15 + 0.15) * (1 + 0.22) * 1.1
                    // 39.8 * 1.15
                    mob_ = mob({protection: 1, defense: 0});
                    equipmentSet.setRightHand(equipment('クラウンアイスワンド(150式)'));
		    expression = mabi.damages.fusedBolt(dam.skills.ICEBOLT, dam.skills.FIREBOLT, {generator: 'max'});
		    expect(damage()).toEqual(0);

                    equipmentSet.setRightHand(equipment('クラウンアイスワンド(150式 S3)'));
		    expression = mabi.damages.fusedBolt(dam.skills.ICEBOLT, dam.skills.FIREBOLT, {generator: 'max'});
		    expect(damage()).toEqual(45);
	        });
            });

            
            
        });
    });

    // http://akiwing.blog48.fc2.com/blog-entry-112.html
    // http://akiwing.blog48.fc2.com/blog-category-2.html
    // http://mabimaho.exblog.jp/11715223
    // http://aumiya.jugem.jp/?eid=203
    // http://aumiya.jugem.jp/?eid=206
    
    xit('スキルを持っていない場合、ダメージ計算は失敗する');
    xit('スキルランクによるダメージ変化');

});
