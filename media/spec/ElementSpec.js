
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

});
