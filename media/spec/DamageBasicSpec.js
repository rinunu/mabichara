with(new mabi.DamageSpecHelper){
    // ダメージ計算機
    // http://lab.lowreal.net/test/mabinogi/damage.html
    describe("基本の計算式", function() {
        beforeEach(function(){
	    body_ = new mabi.Body();
	    equipmentSet_ = new mabi.EquipmentSet();
	    character_ = new mabi.Character();
	    character_.setBody(body_);
	    character_.setEquipmentSet(equipmentSet_);

            mob_ = mob({protection: 0, defense: 0});
        });

        it('ダメージがマイナスの場合は1とする', function(){
	    mob_ = mob({protection: 0.1, defense: 100});
            equipmentSet_.setRightHand(rightHandWeapon({damageMax: 1}));
            
            expression_ = mabi.damages.attack();
	    expect(damage()).toEqual(1);
        });

        // 期待値を求める(バランス計算は行わず、 80% 固定とする)
        //
        // クリを含まない期待値 a = (max - min) * 0.75 + min
        // クリを含む期待値は「a * 0.7 + {a + (max * クリ倍率)} * 0.3」となる
        // 
        // http://mabinogi.wikiwiki.jp/index.php?%A5%B9%A5%C6%A1%BC%A5%BF%A5%B9%2F%A5%D0%A5%E9%A5%F3%A5%B9
        // http://lab.lowreal.net/test/mabinogi/damage.html
        // http://www.mabinogi.jp/6th/community/knowledgeContent.asp?ty=&c1=&c2=&lv=0&od=&ix=19117&p=
        describe('期待値', function(){
            it('バランス80%、クリ30% 時の期待値', function(){
		equipmentSet_.setRightHand(rightHandWeapon({damageMin: 10, damageMax: 100}));
                expression_ = mabi.damages.attack({generator: 'criticalExpectation'});
		expect(damage()).toEqual(122); // 結果は上記計算機より(ただし小数点切り捨て)
            });
            
            xit('魔法のバランスは100%までいく');
        });

        // http://akiwing.blog48.fc2.com/blog-entry-112.html
        // http://akiwing.blog48.fc2.com/blog-category-2.html
        // http://mabimaho.exblog.jp/11715223
        // http://aumiya.jugem.jp/?eid=203
        // http://aumiya.jugem.jp/?eid=206
        
        xit('スキルを持っていない場合、ダメージ計算は失敗する');
        xit('スキルランクによるダメージ変化');

    });
}