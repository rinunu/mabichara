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
	data.addEquipmentSet(new mabi.EquipmentSet);
	data.addMob(new mabi.Element);

	data.addExpression(new mabi.Expression(function(c){
	    return c.character.param('int') * 1;
	}));
	data.addExpression(new mabi.Expression(function(c){
	    return c.character.param('int') * 2;
	}));

	context = new mabi.Context();
	context.setDamageData(data);
	context.setRowFields([dam.fields.BODY, dam.fields.EQUIPMENT_SET, dam.fields.MOB]);
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
