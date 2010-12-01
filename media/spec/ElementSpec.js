describe('Element', function() {
    // Element は様々なデータの基底になるクラスです。
    // 例えば Equipment、Enchant 等がこのクラスのサブクラスとなります。
    //
    // ■Element とサブクラスの役割分担
    // Element: 様々なデータを統一的に処理したい場合に、このインタフェースを使用します。
    // また、データを保持するのもこのクラスの役目です。 サブクラスは独自のデータを保持しないようにします。
    // これはシリアライズ、DB 処理などを Element に対してのみ実装すれば済むようにするためです。
    // (現在は統一できていません)
    //
    // サブクラス: 利用者がサブクラス特有の処理を行う際に、このサブクラスのインタフェースを使用します。
    // Element の保持しているデータへアクセスしやすくするためのヘルパーメソッドなどを持ちます。
    
    var subject;
    beforeEach(function(){
        subject = new mabi.Element;
    });

    describe('構築時', function(){
        it('effects をマップで指定できる', function(){
            var element = new mabi.Element({effects: {str: 100}});
            expect(element.param('str')).toEqual(100);
        });
        
        it('effects を配列で指定できる', function(){
            var element = new mabi.Element({effects: [{param: 'str', min: 100}]});
            expect(element.param('str')).toEqual(100);
        });
    });

    describe('基本プロパティ', function(){
        it('name で名前を取得できる', function(){
            subject = new mabi.Element({name: 'name0'});
            expect(subject.name()).toEqual('name0');
        });
        it('englishName で英語名を取得できる', function(){
            subject = new mabi.Element({englishName: 'name0'});
            expect(subject.englishName()).toEqual('name0');
        });
        xit('複数の名前');
    });


    describe('effects', function(){
        describe('addEffect で Effect を追加できる', function(){
            xit('Effect オブジェクトを指定して追加できる', function(){
            });
            xit('JSON を指定して追加できる', function(){
            });
        });

        describe('eachEffect で Effect を列挙できる', function(){
            it('自分と子供の Effect を列挙する', function(){
                var source = [
                    new mabi.Effect({param: 'str', min: 1}),
                    new mabi.Effect({param: 'str', min: 3}),
                    new mabi.Effect({param: 'dex', min: 5})
                ];
                subject.addEffect(source[0]);
                subject.addEffect(source[1]);

                var child = new mabi.Element();
                child.addEffect(source[2]);
                subject.addChild(child);
                
                var effects = [];
                subject.eachEffect(function(e){effects.push(e);});

                // 現状、順番は 子供 => 親となる
                expect(effects[0]).toEqual(source[2]);
                expect(effects[1]).toEqual(source[0]);
                expect(effects[2]).toEqual(source[1]);
            });
        });

    });

    describe('flags(effects のラッパー)', function(){
        describe('is でフラグをチェックできる', function(){
            it('effect の数値が 0 より大きい場合、フラグを持っているとみなす', function(){
                subject = new mabi.Element({
                    effects: {
                        flag0: 1,
                        flag1: 0,
                        flag2: -1
                    }
                });
                expect(subject.is('flag0')).toBeTruthy();
                expect(subject.is('flag1')).toBeFalsy();
                expect(subject.is('flag2')).toBeFalsy();
                expect(subject.is('flag10')).toBeFalsy();
            });
            it('flags 引数を使用してフラグを指定できる', function(){
                subject = new mabi.Element({
                    flags: ['flag0', 'flag1']
                });
                expect(subject.is('flag0')).toBeTruthy();
                expect(subject.is('flag1')).toBeTruthy();
            });
        });
        describe('addFlag でフラグを追加できる', function(){
            it('基本', function(){
                subject.addFlag('flag0');
                expect(subject.is('flag0')).toBeTruthy();
            });
            xit('なんども追加した場合');
        });

    });


    describe('flatten で子供を削除し、子供の Effect を親にマージした新しい Element を生成する', function(){
        var parent, flat;
        beforeEach(function(){
            parent = new mabi.Element({name: '親'});
            parent.addEffect({op: '+', param: 'str', min: 1});
            
            var child0 = new mabi.Element({name: '子供0'});
            child0.addEffect({op: '+', param: 'str', min: 3});
            child0.addEffect({op: '+', param: 'dex', min: 5});

            var child1 = new mabi.Element({name: '子供1'});
            child1.addEffect({op: '+', param: 'dex', min: 7});
            parent.addChild(child0);
            parent.addChild(child1);

            flat = parent.flatten();
        });

        it('子供が削除される', function(){
            expect(flat.childrenLength()).toEqual(0);
        });
        it('子供の効果が親にコピーされる', function(){
            expect(flat.param('str')).toEqual(4);
            expect(flat.param('dex')).toEqual(12);
        });
        it('ソースオブジェクトは変更されない', function(){
            expect(parent.childrenLength()).toEqual(2);
        });
    });

    describe('copyFrom', function(){
        var element;
        var copy;
        var slot1;
        beforeEach(function(){
            slot1 = new mabi.Element({name: 'slot1!'});
            element = new mabi.Element;
            element.addChild(slot1, 'slot1');
            copy = new mabi.Element;
            copy.copyFrom(element);
        });

        it('child がコピーされる', function(){
            expect(copy.child('slot1').name()).toEqual('slot1!');
            expect(copy.child('slot1').name()).toEqual('slot1!');
        });
        it('child は別のインスタンスになる', function(){
            expect(copy.child('slot1')).not.toBe(slot1);
        });

    });


    describe('clone', function(){
        describe('複製時', function(){
            var clone;
            var source;
            var child;
            beforeEach(function(){
                source = new mabi.Element({name: 'test', effects: {str: 100}});
                source.shared = {};
                source.addSharedProperties(['shared']);
                child = new mabi.Element({effects: {dex: 100}});
                source.addChild(child, 'child');
                clone = source.clone();
            });
            it('別のインスタンスになっていること', function(){
                expect(clone).not.toBe(source);
            });
            it('id は新規に割り振られること', function(){
                expect(clone.id()).not.toEqual(source.id());
            });
            it('Child も別のインスタンスになっていること', function(){
                expect(clone.child('child')).not.toBe(child);
            });
            it('同じ型になっていること', function(){
                expect(clone instanceof mabi.Element).toBeTruthy();
            });
            it('同じ name を持っていること', function(){
                expect(clone.name()).toEqual('test');
            });
            it('parent は null になること', function(){
                expect(clone.parent()).toBeNull();
            });
            it('同じ Effect を持っていること', function(){
                expect(clone.param('str')).toEqual(100);
            });
            it('同じ Child を持っていること', function(){
                expect(clone.child('child').param('dex')).toEqual(100);
            });
            it('共有プロパティは複製しないこと', function(){
                expect(clone.shared).toBe(source.shared);
            });
        });
    });


});
