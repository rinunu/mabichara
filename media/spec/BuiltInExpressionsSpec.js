
describe("各種計算式", function() {
	     var character;
	     var condition;
	     var expression;
	     var context;
	     var enemy;

	     beforeEach(function(){
			    character = new mabi.Character();
			    character.setParam('ice_magic_damage', 0.15); // アイスマスタリ1
			    character.setParam('fire_magic_damage', 0.15); // ファイアマスタリ1
			    character.setParam('lightning_magic_damage', 0.15); // ライトニングマスタリ1
			    character.setParam('bolt_magic_damage', 0.15); // ボルトマスタリ1
			    character.setParam('fused_bolt_magic_damage', 0.15); // ボルト魔法の合体1

			    enemy = new mabi.Element(
				{
				    effects:[
					{param: 'protection', min: 0.1}
				    ]});
			});

	     // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	     it('Wiki 例1', function() {
		    character.setParam('int', 600);
		    condition = new mabi.Condition(
			{
			    character: character,
			    weapon: dam.weapons.get('クラウンアイスワンド(150式)'),
			    title: dam.titles.get('マジックマスター')
			});
		    expression = new mabi.MagicDamage(dam.skills.get('アイスボルト').create(1), 1);

		    context = new mabi.Context({
					       condition: condition,
					       enemy: enemy});
		    expect(Math.floor(expression.value(context))).toEqual(181);
		});

	     // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	     it('Wiki 例2', function() {
		    character.setParam('int', 600);
		    condition = new mabi.Condition(
			{
			    character: character,
			    weapon: dam.weapons.get('フェニックスファイアワンド(245式)'),
			    title: dam.titles.get('マジックマスター')
			});
		    expression = new mabi.MagicDamage(dam.skills.get('ファイアボール').create(1), 5);

		    context = new mabi.Context({
					       condition: condition,
					       enemy: enemy});
		    expect(Math.floor(expression.value(context))).toEqual(3410);
		});

	     // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	     it('Wiki 例3', function() {
		    character.setParam('int', 600);
		    condition = new mabi.Condition(
			{
			    character: character,
			    weapon: dam.weapons.get('フェニックスファイアワンド(245式 S3)'),
			    title: dam.titles.get('マジックマスター')
			});
		    expression = new mabi.MagicDamage(dam.skills.get('ファイアボール').create(1), 5);

		    context = new mabi.Context({
					       condition: condition,
					       enemy: enemy});
		    expect(Math.floor(expression.value(context))).toEqual(3424);
		});

	     // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	     it('Wiki 例4', function() {
		    character.setParam('int', 600);
		    condition = new mabi.Condition(
			{
			    character: character,
			    weapon: dam.weapons.get('ファイアワンド(S3)'),
			    title: dam.titles.get('マジックマスター')
			});

		    expression = new mabi.FusedBoltMagicDamage(
			dam.skills.get('ファイアボルト').create(1),
			dam.skills.get('ライトニングボルト').create(1), 5);

		    context = new mabi.Context({
					       condition: condition,
					       enemy: enemy});
		    expect(Math.floor(expression.value(context))).toEqual(1864);
		});
	 });
