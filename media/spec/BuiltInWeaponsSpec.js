describe("組み込み武器", function() {
	     var weapon;
	     beforeEach(function() {
			});

	     it('クラウンアイスワンド(150式)', function() {
		    weapon = dam.weapons.get('クラウンアイスワンド(150式)');
		    expect(weapon.param('weapon_magic_damage')).toEqual(0.22);
		});
	 });
