describe("組み込みスキル", function() {
	     var skill;
	     beforeEach(function() {
			});

	     it('アイスボルト', function() {
		    skill = dam.skills.get('アイスボルト').create(1);
		    expect(skill).toBeTruthy();
		    expect(skill.damageMax()).toEqual(80);
		    expect(skill.is('bolt')).toBeTruthy();
		    expect(skill.is('ice')).toBeTruthy();
		    expect(skill.is('fire')).toBeFalsy();
		});
	 });
