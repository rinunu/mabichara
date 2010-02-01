var mabi = {
  enchants: {
    conditions: {}
  }
};

mabi.enchants.indexToConditionNameMap = [
  'root',
  'rank',
  'name',
  'equipment',
  'effects',
  'attack_max',
  'melee_attack_max',
  'ranged_attack_max',
  'critical',
  'life_max',
  'mana_max',
  'stamina_max',
  'defence',
  'protection'
];

mabi.enchants.toDataTablesJson = function(json){
  var data = [];
  for(var i = 0; i < json.length; ++i){
    var o = json[i];
    data.push([
		o.root,
		o.rank,
		[o.names, o.wiki],
		o.equipment_text || '',
		o.effect_texts,
		o.attack_max,
		o.melee_attack_max,
		o.ranged_attack_max,
		o.critical,
		o.life_max,
		o.mana_max,
		o.stamina_max,
		o.defence,
		o.protection
	     ]);
  }

  return {
    "iTotalRecords": json.length,
    "iTotalDisplayRecords": json.length,
    "aaData": data
  };
};

mabi.enchants.serverData = function(sSource, aoData, fnCallback){
  var params = {
  };

  for(var name in mabi.enchants.conditions){
    params[name] = mabi.enchants.conditions[name];
  }

  for(i = 0; i < aoData.length; ++i){
    var a = aoData[i];

    switch(a.name){
    case 'iSortCol_0':
      params.orderby = mabi.enchants.indexToConditionNameMap[parseInt(a.value)];
      break;
    case 'sSortDir_0':
      params.sortorder = a.value == 'asc' ? 'ascending' : 'descending';
      break;
    case 'iDisplayLength':
      params['max-results'] = a.value;
      break;
    }
  }

  $.getJSON(sSource, params, function(json){
	      fnCallback(mabi.enchants.toDataTablesJson(json));
	    });
};

/**
 * エンチャントリストを表示する
 */
mabi.enchants.showEnchantList = function(element){
  // todo element に関連づいているものにイベントをつける
  mabi.enchants.condition_form = $('form.condition');

  mabi.enchants.condition_form.find("input[name='name']").keyup(
      function(){
	delete mabi.enchants.conditions[this.name];
	if(this.value){
	  mabi.enchants.conditions[this.name] = this.value;
	}
	mabi.enchants.table.fnFilter('');
      });
  mabi.enchants.condition_form.find('select').change(
      function(){
	delete mabi.enchants.conditions[this.name];
	if(this.value){
	  mabi.enchants.conditions[this.name] = this.value;
	}
	mabi.enchants.table.fnFilter('');
      });

  mabi.enchants.condition_form.find(".effects2 input[type='checkbox']").click(
      function(){
	var name = 'effects';
	var table = mabi.enchants.table;
	var head = table.find('thead tr');

// 	if(this.name == 'attack_max'){
// 	  console.info(table.find("th.attack_max"));
// 	  console.info(head.index(head.find("th.attack_max")));
// 	  table.fnSetColumnVis(table.fnGetPosition(head.index("th.attack_max")), this.checked);
// // 	  table.fnSetColumnVis(my.columns['melee_attack_max'], this.checked);
// // 	  table.fnSetColumnVis(my.columns['ranged_attack_max'], this.checked);
// 	}else{
// 	  if(this.name && my.columns[this.className]){
// // 	    table.find("th[='" + this.name + "']");

// // 	    table.fnSetColumnVis(my.columns[this.className], this.checked);
// 	  }
// 	}




	delete mabi.enchants.conditions[name];

	var checks = mabi.enchants.condition_form.find(".effects2 input[type='checkbox'][checked]");
	var conds = [];
	checks.each(function(){
		      conds.push(this.value);
		    });
	mabi.enchants.conditions[name] = conds.join(' ');
	mabi.enchants.table.fnFilter('');
      });

  mabi.enchants.table = $(element).dataTable(
    {
      "bServerSide": true,
      "sAjaxSource": '/mabi/enchants.json',
      "fnServerData": mabi.enchants.serverData,
      "sPaginationType": "full_numbers",
      "sDom": 'rtp',
      "bAutoWidth": false,
      "bLengthChange": false,
      "iDisplayLength": 20,
      "bJQueryUI": true,
      "aoColumns": [
	null, null,
	// スクロール名
	{ "bSortable": false,
	  "fnRender": function(oObj){
	    var list = [];
	    var names = oObj.aData[oObj.iDataColumn][0];
	    var wiki = oObj.aData[oObj.iDataColumn][1];
	    for(var i = 0; i < names.length; ++i){
	      list.push('<li>' + names[i] + '</li>');
	    }
	    var a = '<a href="' + wiki + '">wiki</a>';
	    return '<ul>' + list.join('\n') + '</ul>' + a;
	  }},
	null,
	// 性能
	{ "fnRender": function(oObj){
	    var list = [];
	    var effects = oObj.aData[oObj.iDataColumn];
	    for(var i = 0; i < effects.length; ++i){
	      list.push('<li>' + effects[i] + '</li>');
	    }
	    return '<ul>' + list.join('\n') + '</ul>';
	  }},

	{ "bVisible": false },
	{ "bVisible": false },
	{ "bVisible": false },
	{ "bVisible": false },
	{ "bVisible": false },
	{ "bVisible": false },
	{ "bVisible": false },
	{ "bVisible": false },
	{ "bVisible": false }
      ]
    });
};

