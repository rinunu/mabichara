describe("Body", function() {
    var body;
    
    beforeEach(function() {
	body = new mabi.Body();
    });
    
    it('パラメータを設定できる', function() {
	body.setParam('int', 100);
	expect(body.param('int')).toEqual(100);
    });

    describe('スキルを持っているとき', function(){
        var skillBase;
        beforeEach(function() {
            skillBase = dam.skills.MAGIC_ICE_MASTERY;
	    body.setSkill(skillBase, 1);
        });

        it('持っているスキルを取得できる', function() {
	    var skill = body.skill(skillBase);
            
	    expect(skill.rank()).toEqual(1);
	    expect(body.param('ice_magic_damage')).toEqual(0.15);
        });
        
        it('パッシブ効果が追加される', function() {
	    expect(body.param('ice_magic_damage')).toEqual(0.15);
        });
        
        it('同じスキルを追加しても何も起こらないこと', function(){
            body.setSkill(skillBase, 1);
            expect(body.param('ice_magic_damage')).toEqual(0.15);
        });
    
        it('スキルを削除できること', function(){
	    body.removeSkill(skillBase);

            expect(body.skill(skillBase)).toBeNull();
            expect(body.param('ice_magic_damage')).toEqual(0);
        });

    });

});