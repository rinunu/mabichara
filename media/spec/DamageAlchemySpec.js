with(new mabi.DamageSpecHelper){

    // 属性マスタリの話
    // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1280427835/558
    describe("錬金術ダメージ計算式", function() {
        var skill_;
        beforeEach(function(){
	    body_ = new mabi.Body();
	    equipmentSet_ = new mabi.EquipmentSet();
	    character_ = new mabi.Character();
	    character_.setBody(body_);
	    character_.setEquipmentSet(equipmentSet_);

            set({
                rightHand: equipment('シリンダー')
            });

            mob_ = mob({protection: 0.1, defense: 10});
        });

        // 計算式
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%A6%A5%A9%A1%BC%A5%BF%A1%BC%A5%AD%A5%E3%A5%CE%A5%F3
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%A2%A5%EB%A5%B1%A5%DF%A5%DE%A5%B9%A5%BF%A5%EA
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1#sdfca970
        //
        // 基本ダメージにアルケミマスタリ補正がかかるという話があったけど、仕様が変わったみたい
        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1273910422/918
        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1288296878/621
        // 
        // シリンダーの攻撃力は錬金術には乗らない
        // シリンダーのクリティカルは錬金術にも有効
        // http://mabinogi.wikiwiki.jp/index.php?%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%CF%A3%B6%E2%BD%D1
        //
        // todo クリティカルについて
        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1268598294/330
        describe('ウォーターキャノン', function(){
            beforeEach(function(){
                set({
                    rightHand: rightHandWeapon(),
                    skills:{
                        'ウォーターキャノン': 1
                    }});
                skill_ = skill('ウォーターキャノン');
                expression_ = mabi.damages.skill(skill_);
            });

            it('基本', function(){
                var a = 136;
                var extra = 0;
                var hit = ((a - 10) * 0.9 + extra);
                expect(damage()).toEqual(Math.floor(hit));
	    });
            
            it('錬金術効率', function(){
                set({skills:{'アルケミマスタリ': 1}});
                var a = 136;
                var extra = 67 * 0.15 / 0.15;
                var hit = ((a - 10) * 0.9 + extra);
                expect(damage()).toEqual(Math.floor(hit));
	    });
            
            it('属性錬金術効率', function(){
                set({skills:{'ウォーターアルケミマスタリ': 1}});
                var a = 136;
                var extra = 67 * 0.10 / 0.15;
                var hit = ((a - 10) * 0.9 + extra);
                expect(damage()).toEqual(Math.floor(hit));
	    });

            it('2チャージ', function(){
                expression_ = mabi.damages.skill(skill_, {charge: 2});
                var a = 136 * 2;
                var extra = 0;
                var hit = ((a - 10) * 0.9 + extra);
                expect(damage()).toEqual(Math.floor(hit));
	    });
            it('5チャージ', function(){
                expression_ = mabi.damages.skill(skill_, {charge: 5});
                var a = 136 * 6;
                var extra = 0;
                var hit = ((a - 10) * 0.9 + extra);
                expect(damage()).toEqual(Math.floor(hit));
	    });
            
            it('属性シリンダー', function(){
                set({
                    rightHand: equipment('ウォーターシリンダー')
                });
                var a = 136;
                var extra = 0;
                var multiplier = 1 + 0.15;
                var hit = ((a - 10) * 0.9 + extra) * multiplier;
                expect(damage()).toEqual(Math.floor(hit));
	    });

            describe('エンチャント', function(){
                beforeEach(function(){
                    set({
                        rightHand: rightHandWeapon({
                            damageMax: 1,
                            prefix: {waterAlchemyDamage: 3, damageMax: 5}}),
                        leftHand: equipment({
                            prefix: {waterAlchemyDamage: 7, damageMax: 11}})
                    });
                });
                it('1チャージ', function(){
                    var a = 136;
                    var b = 3 + 5 + 7 + 11;
                    var base = a + b;
                    var extra = 0;
                    var hit = ((base - 10) * 0.9 + extra);
                    expect(damage()).toEqual(Math.floor(hit));
	        });
                it('5チャージ', function(){
                    expression_ = mabi.damages.skill(skill_, {charge: 5});
                    var a = 136 * 6;
                    var b = (3 + 7) * 5 + 5 + 11;
                    var base = a + b;
                    var extra = 0;
                    var hit = ((base - 10) * 0.9 + extra);
                    expect(damage()).toEqual(Math.floor(hit));
	        });
            });

            it('組み合わせ', function(){
                set({
                    title: 'アルケミマスター',
                    skills:{
                        'アルケミマスタリ': 1,
                        'ウォーターアルケミマスタリ': 1
                    },
                    rightHand: equipment('ウォーターシリンダー'),
                    leftHand: equipment({
                        prefix: {waterAlchemyDamage: 7, damageMax: 11}})
                });
                expression_ = mabi.damages.skill(skill_, {charge: 5});
                var a = 136 * 6; // 基本ダメージ
                var b = (7 + 10) * 5 + 11; // エンチャント・アルケミマスター
                var base = a + b;
                var extra = 67 * (15 + 10) / 15; // ケミマス・属性ケミマス
                var multiplier = 1 + 0.15; // 属性シリンダー
                var hit = ((base - 10) * 0.9 + extra) * multiplier;
                expect(damage()).toEqual(Math.floor(hit));
	    });

            // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%A6%A5%A9%A1%BC%A5%BF%A1%BC%A5%AD%A5%E3%A5%CE%A5%F3%2F%A5%B3%A5%E1%A5%F3%A5%C8
            // 最終ダメージ * 1.15 らしい
            xit('クレシダセット');
            xit('空気抵抗');
            xit('氷属性');
        });

        // 基本情報
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%D5%A5%A1%A5%A4%A5%A2%A5%A2%A5%EB%A5%B1%A5%DF%A5%DE%A5%B9%A5%BF%A5%EA
        //
        // 計算式
        // base = (基本ダメージ + 火属性エンチャント) * チャージ数 + ダメージエンチャント
        // extra = 追加ダメージ * アルケミマスタリスキルレベル / 15 * チャージ数
        // multiplier = シリンダーボーナス
        // d = 防御保護(base * クリティカルヒットボーナス)
        // d += extra
        // d *= multiplier
        // 
        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1268598294/220 < これはまちがい
        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1268598294/241
        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1268598294/706
        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1273910422/918
        // 
        // 追加ダメージ
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1#sdfca970
        //
        // コメントによると R1 で 21-34 なんて話も出てるけど、その後のコメントを読む限り、おそらくバランスが低いだけ
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%D5%A5%EC%A5%A4%A5%DE%A1%BC
        describe('フレイマー', function(){
            beforeEach(function(){
                set({
                    skills:{
                        'フレイマー': 1
                    }});
                skill_ = skill('フレイマー');
                expression_ = mabi.damages.skill(skill_);
            });

            it('基本', function(){
                var a = 42;
                var extra = 0;
                var hit = ((a - 10) * 0.9 + extra);
                expect(damage()).toEqual(Math.floor(hit));
	    });
            it('属性錬金術効率', function(){
                set({
                    skills:{
                        'アルケミマスタリ': 1
                    }
                });
                var a = 42;
                var extra = 10 * 15 / 15;
                var hit = ((a - 10) * 0.9 + extra);
                expect(damage()).toEqual(Math.floor(hit));
	    });

            it('チャージは追加ダメージにもかかり、フルチャージボーナスはない', function(){
                set({
                    skills:{
                        'アルケミマスタリ': 1
                    }
                });
                expression_ = mabi.damages.skill(skill_, {charge: 5});
                var a = 42 * 5;
                var extra = 10 * 15 / 15 * 5;
                var hit = ((a - 10) * 0.9 + extra);
                expect(damage()).toEqual(Math.floor(hit));
	    });
            
            xit('火属性');
        });

        // todo 式は見つけられなかったので、あっているか不明
        // 複数チャージできない=錬金術ダメージ増加効果は普通のダメージ増加と変わらない。
        describe('ヒートバスター', function(){
            beforeEach(function(){
                set({
                    skills:{
                        'ヒートバスター': 1
                    }});
                skill_ = skill('ヒートバスター');
                expression_ = mabi.damages.skill(skill_);
            });

            it('基本', function(){
                var a = 1175;
                var hit = (a - 10) * 0.9;
                expect(damage()).toEqual(Math.floor(hit));
            });
            
            it('錬金術効率', function(){
                set({
                    skills:{
                        'アルケミマスタリ': 1
                    }
                });
                var a = 1175 * (1 + 0.15 * 3);
                var hit = (a - 10) * 0.9;
                expect(damage()).toEqual(Math.floor(hit));
            });
            it('火属性の錬金術効率', function(){
                set({
                    skills:{
                        'ファイアアルケミマスタリ': 1
                    }
                });
                var a = 1175 * (1 + 0.10 * 3);
                var hit = (a - 10) * 0.9;
                expect(damage()).toEqual(Math.floor(hit));
            });

            xit('ヒートバスターマスター');

            xit('火属性');
        });

        // ライフドレイン
        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1268598294/223
        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1268598294/224
        // 古いかも?

        // 属性アルケミマスターは、そのマスタリの効果 * 10% の模様(つまり、R1までで10あがるので、タイトルで11となる)
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%A2%A1%BC%A5%B9%A5%A2%A5%EB%A5%B1%A5%DF%A5%DE%A5%B9%A5%BF%A5%EA
        it('ウォーターアルケミマスター', function(){
            set({
                title: 'ウォーターアルケミマスター',
                rightHand: equipment('シリンダー'),
                skills:{
                    'ウォーターアルケミマスタリ': 1,
                    'ウォーターキャノン': 1
                }});
            skill_ = skill('ウォーターキャノン');
            expression_ = mabi.damages.skill(skill_);
            var a = 136;
            var extra = 67 * 11 / 15;
            var hit = ((a - 10) * 0.9 + extra);
            expect(damage()).toEqual(Math.floor(hit));
	});

        // 属性の錬金術ダメージ+10(ESやシリンダー改造と同じ)
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%A2%A5%EB%A5%B1%A5%DF%A5%DE%A5%B9%A5%BF%A5%EA#x07b79ce
        it('アルケミマスター', function(){
            set({
                title: 'アルケミマスター',
                rightHand: equipment('シリンダー'),
                skills:{
                    'アルケミマスタリ': 1,
                    'ウォーターキャノン': 1
                }});
            skill_ = skill('ウォーターキャノン');
            expression_ = mabi.damages.skill(skill_, {charge: 2});
            var a = 136 * 2;
            var b = 10 * 2;
            var base = a + b;
            var extra = 67 * 15 / 15;
            var hit = ((base - 10) * 0.9 + extra);
            expect(damage()).toEqual(Math.floor(hit));
	});

        // 錬金術効率 + 40%
        // 属性シリンダー補正は 0
        // その他射程などに影響を与える
        // 錬金術実行から効果発生までの間に持ち替えると効果があるため、効果は装備しているだけで有効と思われる。
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1#sdfca970
        // http://mabinogi.wikiwiki.jp/index.php?%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%CF%A3%B6%E2%BD%D1%2F%A5%BF%A5%EF%A1%BC%A5%B7%A5%EA%A5%F3%A5%C0%A1%BC
        it('タワーシリンダー', function(){
            set({
                rightHand: equipment('タワーシリンダー'),
                skills:{
                    'ウォーターキャノン': 1
                }
            });
            expression_ = mabi.damages.skill(skill('ウォーターキャノン'));
            var a = 136;
            var extra = 67 * 40 / 15; // ここにかかる！
            var hit = (a - 10) * 0.9 + extra;
            expect(damage()).toEqual(Math.floor(hit));
	});

        // 効果の意味は ESと同じ
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%A2%A5%EB%A5%B1%A5%DF%A5%DE%A5%B9%A5%BF%A5%EA#x07b79ce
        xit('属性シリンダー改造');


        // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1280427835/914-
        it('クレシダセットは最終ダメージに 0.15 追加になる', function(){
            set({
                rightHand: equipment('ファイアシリンダー'),
                leftHand: equipment({flameBurstDamage: 0.15}),
                skills: {
                    'フレイマー': 1
                }
            });
            expression_ = mabi.damages.skill(skill('フレイマー'));
            var a = 42;
            var hit = (a - 10) * 0.9 * 1.15 * 1.15;
            expect(damage()).toEqual(Math.floor(hit));
        });
        

        describe('具体例', function(){

            // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%D5%A5%EC%A5%A4%A5%DE%A1%BC
            it('フレイマー,ケミマス,火ケミ1で最高57', function(){
                set({
                    rightHand: equipment('シリンダー'),
                    skills:{
                        'アルケミマスタリ': 1,
                        'ファイアアルケミマスタリ': 1,
                        'フレイマー': 1
                    }});
                mob_ = mob({protection: 0, defense: 1});
                expression_ = mabi.damages.skill(skill('フレイマー'));
                expect(damage()).toEqual(57);
            });

            // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1280427835/914-
            describe('クレシダセットは最終ダメージに 0.15 追加になる', function(){
                it('', function(){
                    mob_ = mob({protection: 0, defense: 1});
                    var weapon = equipment('ボルケーノシリンダー');
                    weapon.setParam('fireAlchemyDamage', 7);
                    set({
                        rightHand: weapon,
                        leftHand: equipment({flameBurstDamage: 0.15}), // クレシダ効果
                        skills: {
                            'フレイマー': 1,
                            'ファイアアルケミマスタリ': 4,
                            'アルケミマスタリ': 1
                        }
                    });
                    
                    expression_ = mabi.damages.skill(skill('フレイマー'));
                    expect(damage()).toEqual(93);
                    
                    expression_ = mabi.damages.skill(skill('フレイマー'), {generator: 'maxCritical'});
                    expect(damage()).toEqual(203);

                });
                xit('LD');
            });

            // フレイマー
            // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1280427835/495
            // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1280427835/496
            // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1280427835/106

            // WC
            // 式が Wiki と違う
            // http://jbbs.livedoor.jp/bbs/read.cgi/game/10417/1280427835/325

            


            // 106 ：(*‘ω‘ *)オンライン：2010/08/14(土) 00:23:13 ID:drXo8Q8E0
            // ＳＳの装備・タイトル・スキルの詳細がわからないのであまり役には立たないけど
            // 自分のスペックとどの程度違うか気になったので比較してきた（装備は適当）
            // フレイマー１　火シリ使用　火属性ダメージ＋４３　最大ダメージ＋２２
            // 結果はファイター（ハード）に対して５チャージノンクリ３６０～４００、クリ８５０～１０００
            // 大体１,５倍強化となるとやっぱり集めたくなるな
            // あと気になるのは見た目だけど、このＳＳはローブ装備してるのかな 


            // 計算結果が乗ってない
            // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%D2%A1%BC%A5%C8%A5%D0%A5%B9%A5%BF%A1%BC

        });        
    });
}