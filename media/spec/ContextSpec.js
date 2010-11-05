describe('Context', function() {
    var skill;
    var context;
    beforeEach(function() {
    });

    function condition(int_){
	var character = new mabi.Character();
	character.setParam('int', int_);
	return new mabi.Condition({
	    name: '',
	    character: character
	});
    }
    
    it('update で DataTable を更新できる', function() {

	context = new mabi.Context();

	var data = new mabi.Conditions;
	data.push(condition(0));
	data.push(condition(1));
	data.push(condition(2));
	context.setConditions(data);

	context.addColumn({name: 'c0', expression: new mabi.Expression(function(c){
	    return c.condition.param('int') * 1;
	})});
	context.addColumn({name: 'c1', expression: new mabi.Expression(function(c){
	    return c.condition.param('int') * 2;
	})});
	
	var table = context.table();
	expect(table.getValue(0, 1)).toEqual(0);
	expect(table.getValue(0, 2)).toEqual(0);

	expect(table.getValue(1, 1)).toEqual(1);
	expect(table.getValue(1, 2)).toEqual(2);

	expect(table.getValue(2, 1)).toEqual(2);
	expect(table.getValue(2, 2)).toEqual(4);
    });
});
