// Skill はスキルそのものを表す SkillClass と、
// キャラクターが持つスキルを表す Skill からなる。
//
// Skill.param
// スキル特有の param をもつ。
// パッシブ効果に関しては Body の Stats と同様の param とする。
// スキル特有 param の一般的なものを以下に列挙する
// - damage: ダメージに関する数値。 スマッシュの倍率や魔法のダメージ
//
// SkillClass.flags には以下のものがある
// - 魔法属性
//   - ice
//   - lightning
//   - fire
// - bolt
// - 種別
//   - magic
//   - combat
//     - melee
//     - ranged
//   - alchemy
//   - life
//   - transformation
// - switch: 攻撃後、ダメージ発生までの間に持ち替え可能か(FBL など)
// - charge_bonus: 複数チャージ時にダメージボーナスが発生するか
//
describe('Skill', function() {
    var base;
    var skill;

    describe('SkillClass', function(){
        beforeEach(function(){
            base = new mabi.SkillClass({
                ranks: [{damage: 100, damage2: 200}]
            });
        });
    });

    describe('Skill', function(){
        var skill1, skill2;
        beforeEach(function(){
            base = new mabi.SkillClass({
                ranks: [
                    {damage: 11, damage2: 12},
                    {damage: 21, damage2: 22}
                ]
            });
            skill1 = base.create(1);
            skill2 = base.create(2);
        });
        
        it('base を取得できること', function(){
            expect(skill1.base()).toBe(base);
        });
        
        it('ランクを取得できること', function(){
            expect(skill1.rank()).toEqual(1);
            expect(skill2.rank()).toEqual(2);
        });
        
        it('ランク毎の情報を取得できること', function(){
            expect(skill1.param('damage')).toEqual(11);
            expect(skill2.param('damage2')).toEqual(22);
        });
        
    });
});
