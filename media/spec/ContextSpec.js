/**
 * アプリの文脈を表す
 * 
 * ビューの表示は Context を元に行う。
 * Context を共有するビューは同じデータを表示することとなる。
 */
describe('Context', function() {
    var skill;
    var context;
    beforeEach(function() {
    });

    function body(int_){
	var body = new mabi.Body();
	body.setParam('int', int_);
	return body;
    }

    it('update で DataTable を更新できる', function() {
	var data = new mabi.CombinationDamageData();
	data.addBody(body(0));
	data.addBody(body(1));
	data.addBody(body(2));
	data.addWeapons(new mabi.EquipmentSet);
        data.addProtectors(new mabi.EquipmentSet);
	data.addMob(new mabi.Mob);

	data.addExpression(new mabi.Expression(function(c){
	    return c.character.param('int') * 1;
	}));
	data.addExpression(new mabi.Expression(function(c){
	    return c.character.param('int') * 2;
	}));

	context = new mabi.Context;
	context.setDamageData(data);
	context.setRowFields([
            dam.fields.BODY, dam.fields.WEAPONS,
            dam.fields.PROTECTORS, dam.fields.MOB]);
	context.setColumnFields([dam.fields.EXPRESSION]);
	context.update();

	var table = context.table();
	expect(table.getValue(0, 1)).toEqual(0);
	expect(table.getValue(0, 2)).toEqual(0);

	expect(table.getValue(1, 1)).toEqual(1);
	expect(table.getValue(1, 2)).toEqual(2);

	expect(table.getValue(2, 1)).toEqual(2);
	expect(table.getValue(2, 2)).toEqual(4);
    });
});
