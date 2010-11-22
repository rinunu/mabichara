
describe('ReferenceElement', function(){
    it('clone 時、参照先は共有する', function(){
        var base = new mabi.Element;
        var reference = new mabi.ReferenceElement(base);
        var clone = reference.clone();
        expect(clone.base()).toBe(base);
    });
});
