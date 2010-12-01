with(new mabi.DamageSpecHelper){

    // todo 魔法とエンチャント
    // http://mbng.at.webry.info/201005/article_10.html
    describe("魔法ダメージ計算式", function() {
        var FFW, FFW_S3, FFW245, FFW245_S3,
            CIW, CIW150, CIW150_S3,
            LW, LW_S3, LW_R3;
        
        beforeEach(function(){
	    body_ = new mabi.Body();
	    equipmentSet_ = new mabi.EquipmentSet();
            mob_ = mob({protection: 0, defense: 0});

            FFW = equipment('フェニックスファイアワンド');
            FFW_S3 = FFW.clone().
                setEffects({sUpgradeMax: 9});
            FFW245 = FFW.clone().
                setEffects({weapon_magic_damage: -0.06});
            FFW245_S3 = FFW245.clone().
                setEffects({sUpgradeMax: 9});

            CIW = equipment('クラウンアイスワンド');
            CIW150 = CIW.clone().
                setEffects({weapon_magic_damage: 0.22});
            CIW150_S3 = CIW150.clone().
                setEffects({sUpgradeMax: 9});

            LW = equipment('ライトニングワンド');
            LW_S3 = LW.clone().
                setEffects({sUpgradeMax: 9});
            LW_R3 = LW.clone().
                setEffects({rUpgrade: 0.26});
        });

        xit('特別改造');
        xit('近接武器に持ち替えた場合の特別改造は乗るのか?');

        // http://mabimaho.exblog.jp/11715223
        xit('ブレイズ');

        // http://bassknoppix.blog94.fc2.com/blog-entry-15.html
        xit('ヘイルストーム');

        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1%2F%A5%A2%A5%A4%A5%B9%A5%DE%A5%B9%A5%BF%A5%EA
        xit('属性マスタリタイトル');

        describe('具体例', function(){
	    beforeEach(function(){
                set({
                    skills:{
                        'アイスボルト': 1,
                        'ファイアボルト': 1,
                        'ライトニングボルト': 1,
                        'ファイアボール': 1,
                        'サンダー': 1,
                        'アイススピア': 1
                    }
                });
	    });
            
	    describe('Wiki 例', function(){
	        beforeEach(function(){
                    set({
                        title: 'マジックマスター',
                        skills:{
                            'アイスマスタリ': 1,
                            'ファイアマスタリ': 1,
                            'ライトニングマスタリ': 1,
                            'ボルト魔法の合体': 1,
                            'ボルトマスタリ': 1
                        }
                    });
		    body_.setParam('int', 600);
		    mob_ = mob({protection: 0.1, defense: 10});
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例1', function(){
                    set({rightHand: CIW150});
		    expression_ = mabi.damages.skill(dam.skills.ICEBOLT, {charge: 1});
		    expect(damage()).toEqual(181);
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例2', function() {
		    set({rightHand: FFW245});
		    expression_ = mabi.damages.skill(dam.skills.FIREBALL, {charge: 5});
		    expect(damage()).toEqual(3410);
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例3', function() {
		    set({rightHand: FFW245_S3});
		    expression_ = mabi.damages.skill(dam.skills.FIREBALL, {charge: 5});
		    expect(damage()).toEqual(3424);
	        });
	        
	        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%AD%A5%EB%2F%CB%E2%CB%A1#vc1353e4
	        it('Wiki 例4', function() {
		    set({rightHand: FFW_S3});
		    expression_ = mabi.damages.fusedBolt(dam.skills.FIREBOLT, dam.skills.LIGHTNING_BOLT, {charge: 5});
		    expect(damage()).toEqual(1864);
	        });
	    });

            
	    describe('http://aumiya.jugem.jp/?eid=173', function(){
	        beforeEach(function(){
		    body_.setParam('int', 600);
		    set({title: 'マジックマスター'});
		    mob_ = mob({protection: 0});
	        });

	        describe('マスタリなし', function(){
		    it('クリティカル FBL', function() {
		        set({rightHand: equipment('ファイアワンド')});
		        expression_ = mabi.damages.skill(dam.skills.FIREBALL, {charge: 5, generator: 'maxCritical'});
		        expect(damage()).toEqual(9009);
		    });
		    it('クリティカル IS', function() {
		        set({rightHand: equipment('アイスワンド')});
		        expression_ = mabi.damages.skill(dam.skills.ICE_SPEAR, {charge: 5, generator: 'maxCritical'});
		        expect(damage()).toEqual(5855); // TODO サイトには 5630 とあるが、あわない
		    });

		    it('クリティカル TH', function() {
		        set({rightHand: equipment('ライトニングワンド')});
		        expression_ = mabi.damages.thunder(dam.skills.THUNDER, {charge: 5, generator: 'maxCritical'});
		        expect(damage()).toEqual(9009); // TODO サイトには 8893 とあるが、あわない
		    });
	        });
	    });

            // http://mabimaho.exblog.jp/page/2/
            // 合わない。。 バランス80で計算してるので、本来はさらにダメージが上がるから、さらにあわない・・
	    describe('魔法期待値', function(){
	        beforeEach(function(){
                    set({
                        skills:{
                            'アイスマスタリ': 1,
                            'ファイアマスタリ': 1,
                            'ライトニングマスタリ': 1,
                            'ボルト魔法の合体': 1,
                            'ボルトマスタリ': 1
                        }
                    });
		    body_.setParam('int', 700);
                });

                it('LB S改造', function(){
                    set({rightHand: LW_S3});
		    expression_ = mabi.damages.skill(dam.skills.LIGHTNING_BOLT, {generator: 'criticalExpectation'});
		    expect(damage()).toEqual(317.8); // サイトには 317.8 とあるが、あわない
	        });
                it('LB R改造', function(){
                    set({rightHand: LW_R3});
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
                    set({rightHand: CIW150});
		    expression_ = mabi.damages.fusedBolt(dam.skills.ICEBOLT, dam.skills.FIREBOLT, {generator: 'max'});
		    expect(damage()).toEqual(1);

                    set({rightHand: CIW150_S3});
		    expression_ = mabi.damages.fusedBolt(dam.skills.ICEBOLT, dam.skills.FIREBOLT, {generator: 'max'});
		    expect(damage()).toEqual(45);
	        });
            });

        });

    });
}