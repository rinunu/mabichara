describe("Expression", function() {
    var character;
    var body;
    var expression;

    beforeEach(function() {
	body = new mabi.Body();
	character = new mabi.Character();
	character.setBody(body);
    });
    
    it('計算を実行できる', function() {
	expression = new mabi.Expression(function(){return 100;});
	var context = {}
	expect(expression.value(context)).toEqual(100);
    });
    
    it('Context を元に計算を実行できる', function() {
	body.setParam('int', 1);
	var context = {character: character};
	expression = new mabi.Expression(function(c){return c.character.param('int') + 100;});
	expect(expression.value(context)).toEqual(101);
    });
});
