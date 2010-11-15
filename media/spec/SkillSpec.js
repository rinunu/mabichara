/**
 * Skill はスキルそのものを表す SkillClass と、
 * キャラクターが持つスキルを表す Skill からなる。
 *
 * SkillClass.flags には以下のものがある
 * - 魔法属性
 *   - ice
 *   - lightning
 *   - fire
 * - bolt
 * - 種別
 *   - magic
 *   - melee
 *   - ranged
 */
describe('Skill', function() {
    var base;
    var skill;

    describe('SkillClass', function(){
        
        beforeEach(function(){
            base = new mabi.SkillClass({
                flags: ['melee'],
                ranks: [{damage: 100, damage2: 200}]
            });
        });

        it('フラグを取得できること', function(){
            expect(base.is('melee')).toBeTruthy();
            expect(base.is('magic')).toBeFalsy();
        });

    });

    describe('Skill', function(){
        var skill1, skill2;
        beforeEach(function(){
            base = new mabi.SkillClass({
                flags: ['magic'],
                ranks: [
                    {damage: 11, damage2: 12},
                    {damage: 21, damage2: 22}
                ]
            });
            skill1 = base.create(1);
            skill2 = base.create(2);
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
