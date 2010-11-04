describe("Expression", function() {
	     var condition;
	     var character;
	     var expression;
	     var context;

	     beforeEach(function() {
			    character = new mabi.Character();
			    condition = new mabi.Condition({character: character});
			});

	     it('計算を実行できる', function() {
		    expression = new mabi.Expression(function(){return 100;});
		    expect(expression.value(condition)).toEqual(100);
		});

	     it('Context を元に計算を実行できる', function() {
		    character.setParam('int', 1);
		    context = {condition: condition, mob: {}};
		    expression = new mabi.Expression(function(c){return c.condition.param('int') + 100;});
		    expect(expression.value(context)).toEqual(101);
		});
	 });
