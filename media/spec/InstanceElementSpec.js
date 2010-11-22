describe('InstanceElement', function(){
    describe('clone', function(){
        var clone, source, base;
        beforeEach(function(){
            base = new mabi.Element;
            source = new mabi.InstanceElement(base);
            clone = source.clone();
        });

        it('base は共有する', function(){
            expect(clone.base()).toBe(base);
        });
    });

});
