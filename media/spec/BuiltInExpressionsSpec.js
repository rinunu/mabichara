
describe("各種計算式", function() {
	     var character;
	     var condition;
	     var expression;
	     var context;
	     var title;
	     var mob;

	     var MAGIC_MASTER;
			    
	     var ICEBOLT;
	     var FIREBOLT;
	     var LIGHTNING_BOLT;
	     
	     var ICE_SPEAR;
	     var FIREBALL;
	     var THUNDER;
	     
	     beforeEach(function(){
			    MAGIC_MASTER = dam.titles.get('マジックマスター');
			    ICEBOLT = dam.skills.get('アイスボルト').create(1);
			    FIREBOLT = dam.skills.get('ファイアボルト').create(1);
			    LIGHTNING_BOLT = dam.skills.get('ライトニングボルト').create(1);
			    ICE_SPEAR = dam.skills.get('アイススピア').create(1);
			    FIREBALL = dam.skills.get('ファイアボール').create(1);
			    THUNDER = dam.skills.get('サンダー').create(1);
			});

	     describe('Wiki 例', function(){
			  beforeEach(function(){
					 character = new mabi.Character();
					 character.setParam('int', 600);
					 character.setParam('ice_magic_damage', 0.15); // アイスマスタリ1
					 character.setParam('fire_magic_damage', 0.15); // ファイアマスタリ1
					 character.setParam('lightning_magic_damage', 0.15); // ライトニングマスタリ1
					 character.setParam('bolt_magic_damage', 0.15); // ボルトマスタリ1
					 character.setParam('fused_bolt_magic_damage', 0.15); // ボルト魔法の合体1
					 title = MAGIC_MASTER;
					 
					 mob = new mabi.Element(
					     {
						 effects:[
						     {param: 'protection', min: 0.1}
						 ]});
				     });
			  
			  // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
			  it('Wiki 例1', function() {
				 condition = new mabi.Condition(
				     {
					 character: character,
					 weapon: dam.weapons.get('クラウンアイスワンド(150式)'),
					 title: title
				     });
				 expression = new mabi.MagicDamage(ICEBOLT, 1);
				 
				 context = {
				     condition: condition,
				     mob: mob
				 };
				 expect(Math.floor(expression.value(context))).toEqual(181);
			     });
			  
			  // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
			  it('Wiki 例2', function() {
				 condition = new mabi.Condition(
				     {
					 character: character,
					 weapon: dam.weapons.get('フェニックスファイアワンド(245式)'),
					 title: title
				     });
				 expression = new mabi.MagicDamage(FIREBALL, 5);
				 
				 context = {
				     condition: condition,
				     mob: mob
				 };
				 expect(Math.floor(expression.value(context))).toEqual(3410);
			     });
			  
			  // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
			  it('Wiki 例3', function() {
				 condition = new mabi.Condition(
				     {
					 character: character,
					 weapon: dam.weapons.get('フェニックスファイアワンド(245式 S3)'),
					 title: title
				     });
				 expression = new mabi.MagicDamage(FIREBALL, 5);
				 
				 context = {
				     condition: condition,
				     mob: mob};
				 expect(Math.floor(expression.value(context))).toEqual(3424);
			     });
			  
			  // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
			  it('Wiki 例4', function() {
				 condition = new mabi.Condition(
				     {
					 character: character,
					 weapon: dam.weapons.get('ファイアワンド(S3)'),
					 title: title
				     });
				 expression = new mabi.FusedBoltMagicDamage(FIREBOLT, LIGHTNING_BOLT, 5);
				 context = {
				     condition: condition,
				     mob: mob};
				 expect(Math.floor(expression.value(context))).toEqual(1864);
			     });
		      });

	     describe('http://aumiya.jugem.jp/?eid=173', function(){
			  beforeEach(function(){
					 character = new mabi.Character();
					 character.setParam('int', 600);
					 mob = new mabi.Element(
					     {
						 effects:[
						     {param: 'protection', min: 0}
						 ]});
				     });

			  describe('マスタリなし', function(){
				       it('クリティカル FBL', function() {
					      condition = new mabi.Condition(
						  {
						      character: character,
						      weapon: dam.weapons.get('ファイアワンド'),
						      title: MAGIC_MASTER
						  });
					      expression = new mabi.MagicDamage(FIREBALL, 5, {critical: true});
					      context = {
						  condition: condition,
						  mob: mob
					      };
					      expect(Math.floor(expression.value(context))).toEqual(9009);
					  });
				       it('クリティカル IS', function() {
					       // あわない。。
					       condition = new mabi.Condition(
						   {
						       character: character,
						       weapon: dam.weapons.get('アイスワンド'),
						       title: MAGIC_MASTER
						   });
					       expression = new mabi.MagicDamage(ICE_SPEAR, 5, {critical: true});
					       context = {
						   condition: condition,
						   mob: mob
					       };
					       expect(Math.floor(expression.value(context))).toEqual(5630);
					   });

				       it('クリティカル TH', function() {
					       // あわない。。
					       condition = new mabi.Condition(
						   {
						       character: character,
						       weapon: dam.weapons.get('ライトニングワンド'),
						       title: MAGIC_MASTER
						   });
					       expression = new mabi.ThunderDamage(THUNDER, {charge: 5, critical: true});
					       context = {
						   condition: condition,
						   mob: mob
					       };
					       expect(Math.floor(expression.value(context))).toEqual(8893);
					   });
				   });
		      });

	 });
