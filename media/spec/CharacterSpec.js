describe("Character", function() {
	     var character;

	     beforeEach(function() {
			    character = new mabi.Character();
			});

	     it('パラメータを設定できる', function() {
		    character.setParam('int', 100);
		    expect(character.param('int')).toEqual(100);
		});
	 });