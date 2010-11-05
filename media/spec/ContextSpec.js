describe('Context', function() {
    var skill;
    var context;
    beforeEach(function() {
    });

    function character(int_){
	var character = new mabi.Character();
	character.setParam('int', int_);
	return character;
    }

    it('eachColumn できる', function() {
	context = new mabi.Context();
	context.setRowFields([dam.fields.CHARACTER]);
	context.setColumnFields([dam.fields.EXPRESSION]);

	var cs = [character(0), character(1)];
	context.addCharacter(cs[0]);
	context.addCharacter(cs[1]);

	var es = [new mabi.Expression(function(c){}),
		  new mabi.Expression(function(c){})];
	context.addExpression(es[0]);
	context.addExpression(es[1]);

	var columns = [];
	context.eachColumn(function(i, v){columns.push([i, v]);})
	expect(columns).toEqual([[0, [es[0]]], [1, [es[1]]]]);
    });
    
    it('eachColumn 再帰できる', function() {
	context = new mabi.Context();
	context.setColumnFields([dam.fields.EXPRESSION, dam.fields.CHARACTER]);

	var cs = [character(0), character(1)];
	context.addCharacter(cs[0]);
	context.addCharacter(cs[1]);

	var es = [new mabi.Expression(function(c){}),
		  new mabi.Expression(function(c){})];
	context.addExpression(es[0]);
	context.addExpression(es[1]);

	var columns = [];
	context.eachColumn(function(i, v){columns.push([i, v]);})
	expect(columns).toEqual(
	    [[0, [es[0], cs[0]]],
	     [1, [es[0], cs[1]]],
	     [2, [es[1], cs[0]]],
	     [3, [es[1], cs[1]]]
	    ]);
    });
    
    it('update で DataTable を更新できる', function() {
	context = new mabi.Context();
	context.addCharacter(character(0));
	context.addCharacter(character(1));
	context.addCharacter(character(2));

	context.addExpression(new mabi.Expression(function(c){
	    return c.condition.param('int') * 1;
	}));
	context.addExpression(new mabi.Expression(function(c){
	    return c.condition.param('int') * 2;
	}));

	context.setRowFields([dam.fields.CHARACTER]);
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
