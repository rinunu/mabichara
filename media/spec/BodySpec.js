describe("Body", function() {
    var body;
    
    beforeEach(function() {
	body = new mabi.Body();
    });
    
    it('パラメータを設定できる', function() {
	body.setParam('int', 100);
	expect(body.param('int')).toEqual(100);
    });
    
    it('スキルを追加できる', function() {
	expect(body.param('ice_magic_damage')).toEqual(0);
	body.setSkill(dam.skills.MAGIC_ICE_MASTERY, 1);
	var skill = body.skill(dam.skills.MAGIC_ICE_MASTERY);
	expect(skill.rank()).toEqual(1);
	expect(body.param('ice_magic_damage')).toEqual(0.15);
    });
});