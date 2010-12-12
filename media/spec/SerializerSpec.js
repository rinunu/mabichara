with(new mabi.Builder){
    describe('Serializer', function(){
        // 各種オブジェクトをシリアライズ・デシリアライズする
        //
        // シリアライズした結果は JSON 文字列へ変換可能な JavaScript オブジェクトとなる。

        var serializer;
        var subject;
        var json;
        beforeEach(function(){
            serializer = new mabi.Serializer;
        });

        it('配列', function(){
            var subject = [new mabi.Effect({param: 'str', min: 1}),
                           new mabi.Effect({param: 'dex', min: 3})];
            expect(serializer.serialize(subject)).toEqual([
                {op: '+', param: 'str', min: 1},
                {op: '+', param: 'dex', min: 3}
            ]);
        });
        
        describe('Effect', function(){
            describe('シリアライズ', function(){
                it('基本', function(){
                    subject = new mabi.Effect({op: '+', param: 'str', min: 1});
                    expect(serializer.serialize(subject)).toEqual({
                        op: '+', param: 'str', min: 1
                    });
                });
            });
            describe('デシリアライズ', function(){
                it('基本', function(){
                    json = {
                        op: '+', param: 'str', min: 1
                    };

                    subject = serializer.deserializeEffect(json);
                    with(subject){
                        expect(op()).toEqual('+');
                        expect(param()).toEqual('str');
                        expect(min()).toEqual(1);
                    };
                });
            });
        });
        
        describe('Element', function(){
            describe('シリアライズ', function(){
                it('基本', function(){
                    subject = new mabi.Element({name: '名前'});
                    expect(serializer.serialize(subject)).toEqual({
                        type: 'Element',
                        name: '名前'
                    });
                });

                it('型情報', function(){
                    subject = new mabi.Mob({name: 'name0'});
                    expect(serializer.serialize(subject)).toEqual({
                        type: 'Mob',
                        name: 'name0'
                    });
                });
                
                it('effects', function(){
                    subject = new mabi.Element();
                    subject.addEffect({param: 'str', min: 1});
                    subject.addEffect({param: 'dex', min: 3});
                    expect(serializer.serialize(subject)).toEqual({
                        type: 'Element',
                        name: '',
                        effects: [
                            {op: '+', param: 'str', min: 1},
                            {op: '+', param: 'dex', min: 3}
                        ]
                    });
                });
                
                it('children', function(){
                    subject = new mabi.Element({name: 'parent'});
                    var children = [
                        new mabi.Element({name: 'child0'}),
                        new mabi.Element({name: 'child1'})
                    ];
                        
                    subject.addChild(children[0], 'slot0');
                    subject.addChild(children[1], 'slot1');
                    expect(serializer.serialize(subject)).toEqual({
                        type: 'Element',
                        name: 'parent',
                        children: [
                            {type: 'Element', name: 'child0', slot: 'slot0'},
                            {type: 'Element', name: 'child1', slot: 'slot1'}
                        ]
                    });
                });

            });

            describe('デシリアライズ', function(){
                it('基本', function(){
                    json = {
                        type: 'Element',
                        name: 'name0'
                    };
                    subject = serializer.deserializeElement(json);
                    with(subject){
                        expect(subject instanceof mabi.Element).toBeTruthy();
                        expect(name()).toEqual('name0');
                    }
                });

                it('型情報', function(){
                    json = {
                        type: 'Mob',
                        name: 'name0'
                    };
                    subject = serializer.deserializeElement(json);
                    with(subject){
                        expect(subject instanceof mabi.Mob).toBeTruthy();
                    }
                });
                
                it('effects', function(){
                    json = {
                        type: 'Element',
                        name: '',
                        effects: [
                            {op: '+', param: 'str', min: 1},
                            {op: '+', param: 'dex', min: 3}
                        ]
                    };
                    subject = serializer.deserializeElement(json);
                    with(subject.effects()){
                        expect(length()).toEqual(2);
                        expect(get(0).param()).toEqual('str');
                        expect(get(1).param()).toEqual('dex');
                    }
                });
                
                it('children', function(){
                    json = {
                        type: 'Element',
                        name: 'parent',
                        children: [
                            {type: 'Element', name: 'child0', slot: 'slot0'},
                            {type: 'Element', name: 'child1', slot: 'slot1'}
                        ]
                    };
                    subject = serializer.deserializeElement(json);
                    with(subject){
                        expect(childrenLength()).toEqual(2);
                        expect(child('slot0').name()).toEqual('child0');
                        expect(child('slot1').name()).toEqual('child1');
                    }
                });

            });
        });

        // 作成中
        xdescribe('OffenseDefenseDamageSource', function(){
            it('シリアライズは', function(){
                var bodies = [
                    new mabi.Body({str: 1}),
                    new mabi.Body({str: 1})];
                var weapons = [
                    equipmentSet({
                        rightHand: rightHandWeapon({damageMax: 1})
                    }),
                    equipmentSet({
                        rightHand: rightHandWeapon({damageMax: 1})
                    })];
                var protectors = [
                    equipmentSet({
                        rightHand: rightHandWeapon({damageMax: 1})
                    }),
                    equipmentSet({
                        rightHand: rightHandWeapon({damageMax: 1})
                    })];
                var titles = [
                    new mabi.Title({dex: 1}),
                    new mabi.Title({dex: 1})];
                
                var expression = new mabi.Expression(function(){});
                
                var mobs = [
                    new mabi.Mob(),
                    new mabi.Mob()];

                var subject = new OffenseDefenseDamageSource;
                subject.setOffenses([
                    {
                        body: body,
                        weapons: weapons,
                        protectors: protectors,
                        title: title,
                        expression: expression
                    },
                    {
                        body: body2,
                        weapons: weapons2,
                        protectors: protectors2,
                        title: title2,
                        expression: expression2
                    }
                ]);
                source.setDefenses([{mob: mob}, {mob: mob2}]);

                expect(serializer.serialize(data)).toEqual({
                });
            });
        });

        // 作成中
        xdescribe('DamageData', function(){
            it('シリアライズ', function(){
                expect(serializer.serialize(data)).toEqual({
                });
                });
        });
        
    });
}