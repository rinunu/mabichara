var mabi = {
  enchants: {
    // 最後に入力したエンチャント名
    latestName: '',

    // 検索条件
    conditions: {},
    THROTTLE_PERIOD: 500,

    /**
     * テーブルの列名から DataTables 内での列インデックスへ変換する
     */
    nameToIndexMap: {},

    /**
     * 処理中のサーバへのリクエスト件数
     */
    requests: 0,

    /**
     * テーブルの列の位置から、検索条件名を求める
     */
    indexToConditionNameMap: [
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
    ]
  }
};


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
  mabi.enchants.spinner.show();
  mabi.enchants.requests++;

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
	      mabi.enchants.requests--;
	      if(mabi.enchants.requests == 0){
  		mabi.enchants.spinner.hide();
	      }
	    });
};

/**
 *
 */
mabi.enchants.createNameToIndex = function(element){
  var ths = element.find('thead tr th');
  ths.each(function(index){
	     mabi.enchants.nameToIndexMap[this.className] = index;
	   });
};

/**
 * エンチャント名検索欄が変更されていたら、サーバへ問い合わせを行う
 */
mabi.enchants.onTimeout = function(){
  console.info('timeout');
  var value = mabi.enchants.name.val();
  if(mabi.enchants.latestName != value){
    console.info('search: ' + value);
    delete mabi.enchants.conditions['name'];
    if(value){
      mabi.enchants.conditions['name'] = value;
    }
    mabi.enchants.latestName = value;
    mabi.enchants.table.fnFilter('');
  }
};

/**
 * 指定された列を表示/非表示にする
 *
 * @param name 列名称
 */
mabi.enchants.toggleColumn = function(name, visibled){
  var table = mabi.enchants.table;
  var head = table.find('thead tr');

  table.fnSetColumnVis(mabi.enchants.nameToIndexMap[name], visibled);
};

/**
 * エンチャントリストを表示する
 */
mabi.enchants.showEnchantList = function(element){
  // todo element に関連づいているものにイベントをつける
  mabi.enchants.condition_form = $('form.condition');
  mabi.enchants.spinner = $('.spinner');

  mabi.enchants.spinner.hide();

  mabi.enchants.createNameToIndex(element);

  mabi.enchants.name = mabi.enchants.condition_form.find("input[name='name']");

  mabi.enchants.condition_form.find("input[name='name']").keyup(
      function(){
	clearTimeout(mabi.enchants.timer);
	mabi.enchants.timer = setTimeout(mabi.enchants.onTimeout, mabi.enchants.THROTTLE_PERIOD);
      });

  mabi.enchants.condition_form.find('select').change(
      function(){
	delete mabi.enchants.conditions[this.name];
	if(this.value){
	  mabi.enchants.conditions[this.name] = this.value;
	}
	mabi.enchants.table.fnFilter('');
      });

  $('.option_button').click(function(){
			      $('div.option').toggle('normal');
			      return false;
			    });

  mabi.enchants.condition_form.find(".effects2 input[type='checkbox']").click(
      function(){

	if(this.name == 'attack_max'){
	  mabi.enchants.toggleColumn('attack_max', this.checked);
	  mabi.enchants.toggleColumn('melee_attack_max', this.checked);
	  mabi.enchants.toggleColumn('ranged_attack_max', this.checked);
	}else{
	  mabi.enchants.toggleColumn(this.name, this.checked);
	}

	var name = 'effects';
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
	{ "bSortable": false,
	  "fnRender": function(oObj){
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

  mabi.enchants.timer = setTimeout(mabi.enchants.onTimeout, mabi.enchants.THROTTLE_PERIOD);
};

