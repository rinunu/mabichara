// ダメージデータを offense と defense の形で保持する DamageData
//
// offense は body, 武器(equipmentSet), 防具(equipmentSet), expression からなる。
//
// defense は mob からなる。
describe('OffenseDefenseDamageData', function(){
    beforeEach(function(){
        this.addMatchers({
            toEqualRecord: function(body, weapons, protectors, title, expression, mob){
                return this.actual.body() == body &&
                    this.actual.weapons() == weapons &&
                    this.actual.protectors() == protectors &&
                    this.actual.expression() == expression &&
                    this.actual.title() == title &&
                    this.actual.mob() == mob;
            }
        });
    });

    it('records は設定した offense, defense の組み合わせとなる', function(){
        var body = new mabi.Body;
        var weapons = new mabi.EquipmentSet;
        var protectors = new mabi.EquipmentSet;
        var title = new mabi.Title;
        var expression = new mabi.Expression(function(){});
        
        var body2 = new mabi.Body;
        var weapons2 = new mabi.EquipmentSet;
        var protectors2 = new mabi.EquipmentSet;
        var title2 = new mabi.Title;
        var expression2 = new mabi.Expression(function(){});

        var mob = new mabi.Mob;
        var mob2 = new mabi.Mob;

        var data = new mabi.OffenseDefenseDamageData;
        data.setOffenses([
            {
                body: body,
                weapons: weapons,
                protectors: protectors,
                title: title,
                expression: expression
            },
            {
                body: body2,
                weapons: weapons2,
                protectors: protectors2,
                title: title2,
                expression: expression2
            }
        ]);
        data.setDefenses([{mob: mob}, {mob: mob2}]);

        var records = data.records();
        console.log(records);

        expect(records[0]).toEqualRecord(body, weapons, protectors, title, expression, mob);
        expect(records[1]).toEqualRecord(body, weapons, protectors, title, expression, mob2);
        expect(records[2]).toEqualRecord(body2, weapons2, protectors2, title2, expression2, mob);
        expect(records[3]).toEqualRecord(body2, weapons2, protectors2, title2, expression2, mob2);
    });


});
