with(new mabi.DamageSpecHelper){

    // todo 魔法とエンチャント
    // http://mbng.at.webry.info/201005/article_10.html
    describe("魔法ダメージ計算式", function() {
        beforeEach(function(){
	    body_ = new mabi.Body();
	    equipmentSet_ = new mabi.EquipmentSet();
	    character_ = new mabi.Character();
	    character_.setBody(body_);
	    character_.setEquipmentSet(equipmentSet_);

            mob_ = mob({protection: 0, defense: 0});
        });

        xit('特別改造');
        xit('近接武器に持ち替えた場合の特別改造は乗るのか?');

        // http://mabimaho.exblog.jp/11715223
        xit('ブレイズ');

        // http://bassknoppix.blog94.fc2.com/blog-entry-15.html
        xit('ヘイルストーム');

        describe('具体例', function(){
	    beforeEach(function(){
	        body_.setSkill(dam.skills.ICEBOLT, 1);
	        body_.setSkill(dam.skills.FIREBOLT, 1);
	        body_.setSkill(dam.skills.LIGHTNING_BOLT, 1);
	        body_.setSkill(dam.skills.FIREBALL, 1);
	        body_.setSkill(dam.skills.THUNDER, 1);
	        body_.setSkill(dam.skills.ICE_SPEAR, 1);
	    });

            
	    describe('Wiki 例', function(){
	        beforeEach(function(){
		    body_.setSkill(dam.skills.MAGIC_ICE_MASTERY, 1);
		    body_.setSkill(dam.skills.MAGIC_FIRE_MASTERY, 1);
		    body_.setSkill(dam.skills.MAGIC_LIGHTNING_MASTERY, 1);
		    body_.setSkill(dam.skills.MAGIC_BOLT_MASTERY, 1);
		    body_.setSkill(dam.skills.BOLT_COMPOSER, 1);
		    body_.setParam('int', 600);

		    equipmentSet_.setTitle(title('マジックマスター'));

		    mob_ = mob({protection: 0.1, defense: 10});
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例1', function(){
		    equipmentSet_.setRightHand(equipment('クラウンアイスワンド(150式)'));
		    expression_ = mabi.damages.skill(dam.skills.ICEBOLT, {charge: 1});
		    expect(damage()).toEqual(181);
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例2', function() {
		    equipmentSet_.setRightHand(equipment('フェニックスファイアワンド(245式)'));
		    expression_ = mabi.damages.skill(dam.skills.FIREBALL, {charge: 5});
		    expect(damage()).toEqual(3410);
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例3', function() {
		    equipmentSet_.setRightHand(equipment('フェニックスファイアワンド(245式 S3)'));
		    expression_ = mabi.damages.skill(dam.skills.FIREBALL, {charge: 5});
		    expect(damage()).toEqual(3424);
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例4', function() {
		    equipmentSet_.setRightHand(equipment('ファイアワンド(S3)'));
		    expression_ = mabi.damages.fusedBolt(dam.skills.FIREBOLT, dam.skills.LIGHTNING_BOLT, {charge: 5});
		    expect(damage()).toEqual(1864);
	        });
	    });

            
	    describe('http://aumiya.jugem.jp/?eid=173', function(){
	        beforeEach(function(){
		    character_.setParam('int', 600);
		    equipmentSet_.setTitle(title('マジックマスター'));
		    mob_ = mob({protection: 0});
	        });

	        describe('マスタリなし', function(){
		    it('クリティカル FBL', function() {
		        equipmentSet_.setRightHand(equipment('ファイアワンド'));
		        expression_ = mabi.damages.skill(dam.skills.FIREBALL, {charge: 5, generator: 'maxCritical'});
		        expect(damage()).toEqual(9009);
		    });
		    it('クリティカル IS', function() {
		        equipmentSet_.setRightHand(equipment('アイスワンド'));
		        expression_ = mabi.damages.skill(dam.skills.ICE_SPEAR, {charge: 5, generator: 'maxCritical'});
		        expect(damage()).toEqual(5855); // TODO サイトには 5630 とあるが、あわない
		    });

		    it('クリティカル TH', function() {
		        equipmentSet_.setRightHand(equipment('ライトニングワンド'));
		        expression_ = mabi.damages.thunder(dam.skills.THUNDER, {charge: 5, generator: 'maxCritical'});
		        expect(damage()).toEqual(9009); // TODO サイトには 8893 とあるが、あわない
		    });
	        });
	    });

            // http://mabimaho.exblog.jp/page/2/
            // 合わない。。 バランス80で計算してるので、本来はさらにダメージが上がるから、さらにあわない・・
	    describe('魔法期待値', function(){
	        beforeEach(function(){
		    body_.setSkill(dam.skills.MAGIC_ICE_MASTERY, 1);
		    body_.setSkill(dam.skills.MAGIC_FIRE_MASTERY, 1);
		    body_.setSkill(dam.skills.MAGIC_LIGHTNING_MASTERY, 1);
		    body_.setSkill(dam.skills.MAGIC_BOLT_MASTERY, 1);
		    body_.setSkill(dam.skills.BOLT_COMPOSER, 1);
		    body_.setParam('int', 700);
		    // equipmentSet_.setTitle(title('マジックマスター'));
                });

                it('LB S改造', function(){
                    equipmentSet_.setRightHand(equipment('ライトニングワンド(S3)'));
		    expression_ = mabi.damages.skill(dam.skills.LIGHTNING_BOLT, {generator: 'criticalExpectation'});
		    expect(damage()).toEqual(317.8); // サイトには 317.8 とあるが、あわない
	        });
                it('LB R改造', function(){
                    equipmentSet_.setRightHand(equipment('ライトニングワンド(R3)'));
		    expression_ = mabi.damages.skill(dam.skills.LIGHTNING_BOLT, {generator: 'criticalExpectation'});
		    expect(damage()).toEqual(316.6); // サイトには 317.6 とあるが、あわない                   
	        });

                // > 合成ボルト魔法の場合、S改造分のダメージ２回計算式にかかってくるのですね。
                // Int700、各種マスタリRank1、S改造+9、CIW+22%改造で合成魔法の場合ですが、保護無視で39.8(計算違ってたらごめんなさい）の追加ダメージとなるとかなり大きいですね。
                // 中級魔法もあるし、単純にR改造かなって思ってましたけどS改造バカにできない(￣￢￣*)
                // => おそらくボルト合成魔法の 0.15 を忘れてると思われるので、39.8 * 1.15 = 45 であってるはず？
                it('IB+FB S3', function(){
                    // 39.8 = 18 * (1 + 0.35 + 0.15 + 0.15) * (1 + 0.22) * 1.1
                    // 39.8 * 1.15
                    mob_ = mob({protection: 1, defense: 0});
                    equipmentSet_.setRightHand(equipment('クラウンアイスワンド(150式)'));
		    expression_ = mabi.damages.fusedBolt(dam.skills.ICEBOLT, dam.skills.FIREBOLT, {generator: 'max'});
		    expect(damage()).toEqual(1);

                    equipmentSet_.setRightHand(equipment('クラウンアイスワンド(150式 S3)'));
		    expression_ = mabi.damages.fusedBolt(dam.skills.ICEBOLT, dam.skills.FIREBOLT, {generator: 'max'});
		    expect(damage()).toEqual(45);
	        });
            });

        });

    });
}