
describe('Element', function() {
    beforeEach(function(){
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
