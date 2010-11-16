describe("組み込み武器", function() {
	     var weapon;
	     beforeEach(function() {
			});

	     it('クラウンアイスワンド', function() {
		    weapon = dam.equipments.get('クラウンアイスワンド');
		    expect(weapon.param('weapon_magic_damage')).toBeFalsy();
		    expect(weapon.sUpgradeMax()).toBeFalsy();
		});

	     it('クラウンアイスワンド(150式)', function() {
		    weapon = dam.equipments.get('クラウンアイスワンド(150式)');
		    expect(weapon.param('weapon_magic_damage')).toEqual(0.22);
		    expect(weapon.sUpgradeMax()).toBeFalsy();
		});

	     it('クラウンアイスワンド(150式 S3)', function() {
		    weapon = dam.equipments.get('クラウンアイスワンド(150式 S3)');
		    expect(weapon.param('weapon_magic_damage')).toEqual(0.22);
		    expect(weapon.sUpgradeMax()).toEqual(9);
		});

	 });
