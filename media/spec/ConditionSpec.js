/**
 * ダメージを計算するための条件
 */
describe('Condition', function() {
    var condition;
    var weapons;
    var protectors;
    var body;
    var expression;
    var mob;
    
    beforeEach(function(){
        weapons = new mabi.EquipmentSet();
        weapons.addChild(new mabi.EquipmentClass({effects: {str:1}}).create());
        
        protectors = new mabi.EquipmentSet();
        protectors.addChild(new mabi.EquipmentClass({effects: {str:3}}).create());
        
        body = new mabi.Body({effects: {str: 5}});
        expression = new mabi.Expression(function(c){
            console.log('value!', c.character, c.mob);
            return c.character.str() + c.mob.str();
        });
        mob = new mabi.Mob({effects: {str:7}});

        condition = new mabi.Condition({
            weapons: weapons,
            protectors: protectors,
            body: body,
            expression: expression,
            mob: mob
        });
    });

    it('weapons を取得できること', function(){
        expect(condition.weapons()).toBe(weapons);
    });

    it('protectors を取得できること', function(){
        expect(condition.protectors()).toBe(protectors);
    });

    it('body を取得できること', function(){
        expect(condition.body()).toBe(body);
    });

    it('expression を取得できること', function(){
        expect(condition.expression()).toBe(expression);
    });

    it('mob を取得できること', function(){
        expect(condition.mob()).toBe(mob);
    });

    it('設定された条件から、ダメージを計算できること', function(){
        expect(condition.value()).toEqual(1 + 3 + 5 + 7);
    });

});