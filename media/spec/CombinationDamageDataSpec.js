
describe("CombinationDamageData", function() {
    var data;
    beforeEach(function(){
	data = new mabi.CombinationDamageData();
    });

    /**
     * レコードを生成する
     */
    function record(body, equipmentSet, mob, expression){
	return {body: body, equipmentSet: equipmentSet, mob: mob, expression: expression};
    }

    it('設定した値を元に records を生成できる', function(){
	var bodies = [
	    new mabi.Body(), new mabi.Body()
	];
	var expressions = [
	    new mabi.Expression(function(){}),
	    new mabi.Expression(function(){})
	];
	var mobs = [
	    mabi.ElementBuilder.mob({}),
	    mabi.ElementBuilder.mob({})
	];
	var equipmentSets = [
	    new mabi.EquipmentSet(),
	    new mabi.EquipmentSet()
	];

	$.each(bodies, function(i, v){data.addBody(v);});
	$.each(expressions, function(i, v){data.addExpression(v);});
	$.each(mobs, function(i, v){data.addMob(v);});
	$.each(equipmentSets, function(i, v){data.addEquipmentSet(v);});
	
	var records = data.records();

	// 以下の順番は実装依存
	expect(records[0]).toEqual(
	    record(bodies[0], equipmentSets[0], mobs[0], expressions[0]));
	expect(records[1]).toEqual(
	    record(bodies[0], equipmentSets[0], mobs[0], expressions[1]));

	expect(records[2]).toEqual(
	    record(bodies[0], equipmentSets[0], mobs[1], expressions[0]));
	expect(records[3]).toEqual(
	    record(bodies[0], equipmentSets[0], mobs[1], expressions[1]));

	expect(records[4]).toEqual(
	    record(bodies[0], equipmentSets[1], mobs[0], expressions[0]));
	expect(records[5]).toEqual(
	    record(bodies[0], equipmentSets[1], mobs[0], expressions[1]));

	expect(records[6]).toEqual(
	    record(bodies[0], equipmentSets[1], mobs[1], expressions[0]));
	expect(records[7]).toEqual(
	    record(bodies[0], equipmentSets[1], mobs[1], expressions[1]));

	expect(records[8]).toEqual(
	    record(bodies[1], equipmentSets[0], mobs[0], expressions[0]));
	expect(records[9]).toEqual(
	    record(bodies[1], equipmentSets[0], mobs[0], expressions[1]));

	expect(records[10]).toEqual(
	    record(bodies[1], equipmentSets[0], mobs[1], expressions[0]));
	expect(records[11]).toEqual(
	    record(bodies[1], equipmentSets[0], mobs[1], expressions[1]));

	expect(records[12]).toEqual(
	    record(bodies[1], equipmentSets[1], mobs[0], expressions[0]));
	expect(records[13]).toEqual(
	    record(bodies[1], equipmentSets[1], mobs[0], expressions[1]));

	expect(records[14]).toEqual(
	    record(bodies[1], equipmentSets[1], mobs[1], expressions[0]));
	expect(records[15]).toEqual(
	    record(bodies[1], equipmentSets[1], mobs[1], expressions[1]));


    });

});