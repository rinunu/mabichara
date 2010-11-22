
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

    describe('clone', function(){
        describe('複製時', function(){
            var clone;
            var source;
            var child;
            beforeEach(function(){
                source = new mabi.Element({name: 'test', effects: {str: 100}});
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
        });
    });

});
