describe("Character", function() {
	     var character;

	     beforeEach(function() {
			    character = new mabi.Character();
			});

	     it('パラメータを設定できる', function() {
		    character.setParam('int', 100);
		    console.log(character);
		    expect(character.param('int')).toEqual(100);
		});
	 });