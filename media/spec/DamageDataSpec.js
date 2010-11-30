describe('DamageData', function(){
    // 1編集単位を表す。
    // 1つの表やグラフに表示するデータの集まりである。
    // DataSource, 表示設定を持つ。

    var data;
    var bodies, weapons, protectors, titles, expressions, mobs;

    describe('DataSource からデータを取得し、表示設定を元に DataTable の形で提供する', function(){
        beforeEach(function(){
            data = new mabi.DamageData;
            data.setDamageSource(dataSource({bodies: [
                new mabi.Body({effects: {str: 1}}),
                new mabi.Body({effects: {str: 3}})
            ]}));
            data.setRowFields([
                dam.fields.BODY, dam.fields.WEAPONS,
                dam.fields.PROTECTORS, dam.fields.MOB]);
	    data.setColumnFields([dam.fields.EXPRESSION]);
        });

        it('基本', function(){
	    var table = data.table();
	    expect(row(table, 0)).toEqual([1, 2]);
	    expect(row(table, 1)).toEqual([3, 6]);
        });
        
        it('DataSource を変更すると、DataTable に反映される', function(){
	    var table = data.table();

            data.setDamageSource(dataSource({bodies: [
                new mabi.Body({effects: {str: 5}}),
                new mabi.Body({effects: {str: 7}})
            ]}));
            table = data.table();
            
	    expect(row(table, 0)).toEqual([5, 10]);
	    expect(row(table, 1)).toEqual([7, 14]);
        });
        
        it('表示設定を変更すると、DataTable に反映される', function(){
            var table = data.table();

            data.setRowFields([dam.fields.EXPRESSION]);
            data.setColumnFields([
                dam.fields.BODY, dam.fields.WEAPONS,
                dam.fields.PROTECTORS, dam.fields.MOB]);
            table = data.table();
            
	    expect(row(table, 0)).toEqual([1, 3]);
	    expect(row(table, 1)).toEqual([2, 6]);
        });
    });

    // ----------------------------------------------------------------------
    // ヘルパー

    /**
     * Condition を作成する
     */
    function condition(body, weapons, protectors, title, expression, mob){
        return new mabi.Condition({
            body: body,
            weapons: weapons,
            protectors: protectors,
            title: title,
            expression: expression,
            mob: mob
        });
    }

    function dataSource(options){
        options = options || {};
        
        bodies = options.bodies || [
            new mabi.Body({effects: {str: 1}}),
            new mabi.Body({effects: {str: 2}})
        ];
        weapons = [
            new mabi.EquipmentSet
        ];
        expressions = [
            new mabi.Expression(function(c){
	        return c.character.param('str') * 1;
	    }),
	    new mabi.Expression(function(c){
	        return c.character.param('str') * 2;
	    })];
        titles = [new mabi.Title];
        protectors = [
            new mabi.EquipmentSet
        ];
        mobs = [
            new mabi.Mob
        ];
        return {
            records: function(){
                return [
                    condition(bodies[0], weapons[0], protectors[0], titles[0],
                              expressions[0], mobs[0]),
                    condition(bodies[0], weapons[0], protectors[0], titles[0],
                              expressions[1], mobs[0]),
                    condition(bodies[1], weapons[0], protectors[0], titles[0],
                              expressions[0], mobs[0]),
                    condition(bodies[1], weapons[0], protectors[0], titles[0],
                              expressions[1], mobs[0])
                ];
            }
        };
    }

    /**
     * 1行取得する
     */
    function row(table, row){
        var l = table. getNumberOfColumns();
        var result = [];
        for(var i = 1; i < l; i++){
            result.push(table.getValue(row, i));
        }
        return result;
    }
});
