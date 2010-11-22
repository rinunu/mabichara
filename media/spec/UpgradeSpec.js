describe('Upgrade', function(){
    var base, upgrade;
    beforeEach(function(){
        base = new mabi.UpgradeClass({ug: 1});
        upgrade = base.create();
    });

    it('ug を取得できること', function(){
        expect(upgrade.ug()).toEqual(1);
    });

});
