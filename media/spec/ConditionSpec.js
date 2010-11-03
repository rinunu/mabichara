describe("Condition", function() {
	     var character;
	     var condition;

	     beforeEach(function() {
			    character = new mabi.Character();
			    condition = new mabi.Condition(character);
			});

	     it('Character に設定したパラメータを取得できる', function() {
		    character.setParam('int', 100);
		    expect(condition.param('int')).toEqual(100);
		});
	 });
