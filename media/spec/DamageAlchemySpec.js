with(new mabi.DamageSpecHelper){

    describe("錬金術ダメージ計算式", function() {
        var skill_;
        beforeEach(function(){
	    body_ = new mabi.Body();
	    equipmentSet_ = new mabi.EquipmentSet();
	    character_ = new mabi.Character();
	    character_.setBody(body_);
	    character_.setEquipmentSet(equipmentSet_);

            mob_ = mob({protection: 0.1, defense: 10});
        });

        // 計算式
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%A6%A5%A9%A1%BC%A5%BF%A1%BC%A5%AD%A5%E3%A5%CE%A5%F3
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1%2F%A5%A2%A5%EB%A5%B1%A5%DF%A5%DE%A5%B9%A5%BF%A5%EA
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CF%A3%B6%E2%BD%D1#sdfca970
        // 
        // シリンダーの攻撃力は錬金術には乗らない
        // シリンダーのクリティカルは錬金術にも有効
        // http://mabinogi.wikiwiki.jp/index.php?%C1%F5%C8%F7%2F%C9%F0%B4%EF%2F%CF%A3%B6%E2%BD%D1
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

            xit('空気抵抗');
            xit('エレメンタル属性');
        });

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
    });
}