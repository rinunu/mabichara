with(new mabi.DamageSpecHelper){
    describe("戦闘(Combat)ダメージの計算式", function() {

        beforeEach(function(){
	    body_ = new mabi.Body();
	    equipmentSet_ = new mabi.EquipmentSet();
            body_.setSkill(skill('スマッシュ'), 1);
            mob_ = mob({protection: 0, defense: 0});
        });

        describe('基本', function(){
	    beforeEach(function(){
	        body_.setParam('str', 100);

                set({
                    head: equipment({prefix: {str:10, damageMax:10}})
                });
                
	        mob_ = mob({protection: 0.1, defense: 10});
	    });

	    describe('片手武器', function(){
	        beforeEach(function(){
                    set({
                        rightHand: rightHandWeapon({
                            damageMax: 100,
                            prefix: {str:10, damageMax:10}
                        }),
                        leftHand: equipment({
                            prefix: {str:10, damageMax:10}})
                    });
	        });

	        it('アタックのダメージは本体性能 + 武器性能で計算される', function() {
		    expression_ = mabi.damages.attack();
                    var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10 + 10 + 10; // 最大ダメージ効果
                    var c = 100; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) - 10) * 0.9);
		    expect(damage()).toEqual(d);
	        });

                it('スマッシュのダメージ', function() {
		    expression_ = mabi.damages.skill(skill('スマッシュ'));
                    var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10 + 10 + 10; // 最大ダメージ効果
                    var c = 100; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) * 5 - 10) * 0.9);
		    expect(damage()).toEqual(d);
	        });
                
                it('スキル使用時のクリティカルのダメージ', function() {
		    expression_ = mabi.damages.skill(skill('スマッシュ'), {generator: 'maxCritical'});
                    var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10 + 10 + 10; // 最大ダメージ効果
                    var c = 100; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) * 5 * 2.5 - 10) * 0.9);
		    expect(damage()).toEqual(d);
	        });
	    });

            describe('両手武器', function(){
	        beforeEach(function(){
                    set({
                        rightHand: twoHandWeapon({
                            damageMax: 100,
                            prefix: {str:10, damageMax:10}
                        })
                    });
	        });

	        it('アタックのダメージは本体性能 + 武器性能で計算される', function() {
                    expression_ = mabi.damages.attack();
                    var a = (100 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10; // 最大ダメージ効果
                    var c = 100 + 10; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) - 10) * 0.9);
		    expect(damage()).toEqual(d);
	        });

                it('スマッシュのダメージは6倍になる', function(){
		    expression_ = mabi.damages.skill(skill('スマッシュ'));
                    var a = (100 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10; // 最大ダメージ効果
                    var c = 100 + 10; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) * 6 - 10) * 0.9);
		    expect(damage()).toEqual(d);
	        });

	    });

            describe('両手装備(Not 武器)', function(){
	        beforeEach(function(){
                    set({
                        rightHand: equipment({
                            damageMax: 100,
                            prefix: {str:10, damageMax:10}}, ['twoHand'])
                    });
	        });

                it('スマッシュのダメージは5倍', function(){
		    expression_ = mabi.damages.skill(skill('スマッシュ'));
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
                    set({
                        rightHand: rightHandWeapon({
                            damageMax: 100,
                            prefix: {str:10, damageMax:10}}),
                        leftHand: rightHandWeapon({
                            damageMax: 50,
                            prefix: {str:10, damageMax:10}})
                    });
                                
	        });

	        it('アタックのダメージは右手・左手で別々に計算される', function() {
                    var a = (100 + 10 + 10 + 10 - 10) / 2.5; // str による最大ダメージ
                    var b = 10; // 最大ダメージ効果
                    
                    expression_ = mabi.damages.attack();
                    var c = 100 + 10; // 武器最大ダメージ
                    var d = Math.floor(((a + b + c) - 10) * 0.9);
		    expect(damage()).toEqual(d);

                    expression_ = mabi.damages.attack({weapon: equipmentSet_.leftHand()});
                    c = 50 + 10; // 武器最大ダメージ
                    d = Math.floor(((a + b + c) - 10) * 0.9);
		    expect(damage()).toEqual(d);
	        });

                it('スマッシュのダメージは (本体 + 右手 + 左手) * 5', function(){
		    expression_ = mabi.damages.skill(skill('スマッシュ'));
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
            describe('R改造', function(){
                describe('片手武器', function(){
                    beforeEach(function(){
                        set({
                            rightHand: rightHandWeapon({damageMax: 100, rUpgrade: 0.18})
                        });
	            });

                    it('ノンクリのダメージは増加しない', function(){
                        expression_ = mabi.damages.attack();
                        var c = 100; // 武器最大ダメージ
                        var d = Math.floor(c);
		        expect(damage()).toEqual(d);
                    });
                    
                    it('アタッククリ時、ベースダメージ * (クリスキル倍率 + X) となる', function(){
                        expression_ = mabi.damages.attack({generator: 'maxCritical'});
                        var c = 100; // 武器最大ダメージ
                        var d = Math.floor(c * (2.5 + 0.18));
		        expect(damage()).toEqual(d);
                    });
                    
                    it('スマッシュクリ時、ベースダメージ * (クリスキル倍率 + X) となる', function(){
                        expression_ = mabi.damages.skill(skill('スマッシュ'), {generator: 'maxCritical'});
                        var c = 100; // 武器最大ダメージ
                        var d = Math.floor(c * 5 * (2.5 + 0.18));
		        expect(damage()).toEqual(d);
                    });
                });
                
                describe('2刀流', function(){
                    beforeEach(function(){
                        set({
                            rightHand: rightHandWeapon({damageMax: 100, rUpgrade: 0.18}),
                            leftHand: rightHandWeapon({damageMax: 50, rUpgrade: 0.18})
                        });
	            });

                    xit('アタック時は・・わかりませんでした');

                    // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1261413038/590
                    // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1276271205/965
                    it('スマッシュクリ時、ベースダメージ * (クリスキル倍率 + 右手R + 左手R) となる', function(){
                        expression_ = mabi.damages.skill(skill('スマッシュ'), {generator: 'maxCritical'});
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
                        set({
                            rightHand: rightHandWeapon({damageMax: 100, sUpgradeMax: 13})
                        });
	            });

                    it('ダメージは + X となる', function(){
                        expression_ = mabi.damages.attack();
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
                        set({
                            rightHand: rightHandWeapon({damageMax: 100, sUpgradeMax: 13}),
                            leftHand: rightHandWeapon({damageMax: 50, sUpgradeMax: 13})
                        });
	            });

                    xit('アタック時は・・わかりませんでした');
                    xit('スマッシュ時、わかりませんでした', function(){
                    });
                });

            });

        });

        describe('具体例', function(){

            // http://www.mabinogi.jp/6th/community/knowledgeContent.asp?ty=&c1=&c2=&lv=0&od=&ix=19117&p=
            // > 通常 ：最小60最大110クリ30%の時ダメージ期待値は147
            // 青3段：最小70最大131クリ30%の時ダメージ期待値は174.7
            // 赤3段：最小60最大110クリ30%の時ダメージ期待値は155.8
            describe('特別改造(両手剣・弓)', function(){
	        beforeEach(function(){
                    expression_ = mabi.damages.attack({generator: 'criticalExpectation'});
	        });

                it('改造なし', function(){
                    set({rightHand: rightHandWeapon({damageMin: 60, damageMax: 110})});
		    expect(damage()).toEqual(147);
                });
                
                it('S改造', function(){
                    set({rightHand: rightHandWeapon({
                        damageMin: 60, damageMax: 110, sUpgradeMin: 10, sUpgradeMax: 21})});
                    expect(damage()).toEqual(174);
                });
                
                it('R改造', function(){
                    set({rightHand: rightHandWeapon({
                        damageMin: 60, damageMax: 110, rUpgrade: 0.26})});
                    expect(damage()).toEqual(155);
                });
            });

            // http://mabinogi.wikiwiki.jp/index.php?%C1%F5%C8%F7%2F%C6%C3%CA%CC%B2%FE%C2%A4
            // > 上にも出ていますが青で最大+21　赤でクリ倍率+26%　クリ1を前提に計算してみました
            // バランス80%(期待値は約75%)の時、特別改造無しのクリを考えないダメージ期待値272.75(＝最小0最大363)(クリ30%を考慮した期待値で436.1)で赤が1ダメージほど優位になる結果となりました
            describe('特別改造(両手剣・弓)', function(){
	        beforeEach(function(){
                    expression_ = mabi.damages.attack({generator: 'criticalExpectation'});
	        });

                it('改造なし', function(){
                    // 272.75 * 0.7 + (272.75 + 363 * 1.5) * 0.3 
                    set({rightHand: rightHandWeapon({damageMin: 0, damageMax: 363})});
		    expect(damage()).toEqual(436);
                });
                
                it('R改造', function(){
                    set({rightHand: rightHandWeapon({damageMin: 0, damageMax: 363, rUpgrade: 0.26})});
		    expect(damage()).toEqual(464);
                });
                
                it('S改造', function(){
                    set({rightHand: rightHandWeapon({damageMin: 0, damageMax: 363, sUpgradeMin: 10, sUpgradeMax: 21})});
		    expect(damage()).toEqual(463);
                });
            });
            
        });

        // http://akiwing.blog48.fc2.com/blog-entry-112.html
        // http://akiwing.blog48.fc2.com/blog-category-2.html
        // http://mabimaho.exblog.jp/11715223
        // http://aumiya.jugem.jp/?eid=203
        // http://aumiya.jugem.jp/?eid=206
    });
}