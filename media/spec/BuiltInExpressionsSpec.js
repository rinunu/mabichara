
describe("各種計算式", function() {
    var character;
    var body;
    var expression;
    var context;
    var title;
    var mob;
    var equipmentSet;

    beforeEach(function(){
	body = new mabi.Body();
	body.setSkill(dam.skills.ICEBOLT, 1);
	body.setSkill(dam.skills.FIREBOLT, 1);
	body.setSkill(dam.skills.LIGHTNING_BOLT, 1);
	body.setSkill(dam.skills.FIREBALL, 1);
	body.setSkill(dam.skills.THUNDER, 1);
	body.setSkill(dam.skills.ICE_SPEAR, 1);

	equipmentSet = new mabi.EquipmentSet();

	character = new mabi.Character();
	character.setBody(body);
	character.setEquipmentSet(equipmentSet);

	context = {
	    character: character
	};
    });


    describe('Wiki 例', function(){
	beforeEach(function(){
	    body.setSkill(dam.skills.MAGIC_ICE_MASTERY, 1);
	    body.setSkill(dam.skills.MAGIC_FIRE_MASTERY, 1);
	    body.setSkill(dam.skills.MAGIC_LIGHTNING_MASTERY, 1);
	    body.setSkill(dam.skills.MAGIC_BOLT_MASTERY, 1);
	    body.setSkill(dam.skills.BOLT_COMPOSER, 1);
	    body.setParam('int', 600);

	    equipmentSet.setTitle(dam.titles.MAGIC_MASTER);

	    mob = mabi.ElementBuilder.mob({protection: 0.1});

	    context.mob = mob;
	});
	
	// http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	it('Wiki 例1', function(){
	    equipmentSet.setRightHand(dam.weapons.get('クラウンアイスワンド(150式)'));
	    expression = new mabi.MagicDamage(dam.skills.ICEBOLT, {charge: 1});
	    expect(Math.floor(expression.value(context))).toEqual(181);
	});
	
	// http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	it('Wiki 例2', function() {
	    equipmentSet.setRightHand(dam.weapons.get('フェニックスファイアワンド(245式)'));
	    expression = new mabi.MagicDamage(dam.skills.FIREBALL, {charge: 5});
	    expect(Math.floor(expression.value(context))).toEqual(3410);
	});
	
	// http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	it('Wiki 例3', function() {
	    equipmentSet.setRightHand(dam.weapons.get('フェニックスファイアワンド(245式 S3)'));
	    expression = new mabi.MagicDamage(dam.skills.FIREBALL, {charge: 5});
	    expect(Math.floor(expression.value(context))).toEqual(3424);
	});
	
	// http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	it('Wiki 例4', function() {
	    equipmentSet.setRightHand(dam.weapons.get('ファイアワンド(S3)'));
	    expression = new mabi.FusedBoltMagicDamage(dam.skills.FIREBOLT, dam.skills.LIGHTNING_BOLT, {charge: 5});
	    expect(Math.floor(expression.value(context))).toEqual(1864);
	});
    });

    describe('http://aumiya.jugem.jp/?eid=173', function(){
	beforeEach(function(){
	    character.setParam('int', 600);
	    equipmentSet.setTitle(dam.titles.MAGIC_MASTER);
	    mob = mabi.ElementBuilder.mob({protection: 0});
	    context.mob = mob;
	});

	describe('マスタリなし', function(){
	    it('クリティカル FBL', function() {
		equipmentSet.setRightHand(dam.weapons.get('ファイアワンド'));
		expression = new mabi.MagicDamage(dam.skills.FIREBALL, {charge: 5, critical: true});
		expect(Math.floor(expression.value(context))).toEqual(9009);
	    });
	    it('クリティカル IS', function() {
		// あわない。。
		equipmentSet.setRightHand(dam.weapons.get('アイスワンド'));
		expression = new mabi.MagicDamage(dam.skills.ICE_SPEAR, {charge: 5, critical: true});
		expect(Math.floor(expression.value(context))).toEqual(5630);
	    });

	    it('クリティカル TH', function() {
		// あわない。。
		equipmentSet.setRightHand(dam.weapons.get('ライトニングワンド'));
		expression = new mabi.ThunderDamage(dam.skills.THUNDER, {charge: 5, critical: true});
		expect(Math.floor(expression.value(context))).toEqual(8893);
	    });
	});
    });

});
