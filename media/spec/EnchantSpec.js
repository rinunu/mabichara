describe('EnchantClass', function(){
    var subject;
    describe('type に prefix/suffix を保持する', function(){
        it('prefix', function(){
            subject = new mabi.EnchantClass({type: 'prefix', rank: 1});
            expect(subject.type()).toEqual('prefix');
        });
        it('suffix', function(){
            subject = new mabi.EnchantClass({type: 'suffix', rank: 1});
            expect(subject.type()).toEqual('suffix');
        });
    });

    it('rank にランクを保持する', function(){
        subject = new mabi.EnchantClass({type: 'suffix', rank: 3});
        expect(subject.rank()).toEqual(3);
    });

});
