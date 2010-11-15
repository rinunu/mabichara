
/**
 * 二刀流できるかを確認できること
 */


describe('Equipment', function() {
    it('装備種別を取得できる', function(){
        var equipment = new mabi.EquipmentClass({flags: ['weapon']}).create();
        expect(equipment.is('weapon')).toBeTruthy();
        expect(equipment.is('foo')).toBeFalsy();
    });
});
