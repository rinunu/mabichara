describe("組み込みタイトル", function() {
	     var weapon;
	     beforeEach(function() {
			});

	     it('マジックマスター', function() {
		    weapon = dam.titles.get('マジックマスター');
		    expect(weapon.param('magic_damage')).toEqual(0.05);
		});
	 });
