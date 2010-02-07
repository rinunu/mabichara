var mabi = {
  enchants : {}
};

/**
 * サーバからエンチャントデータを取得する
 */
mabi.enchants.getEnchants = function(params, callback){
  // var url = 'http://mabichara.appspot.com/mabi/enchants.json?callback=?';
  var url = '/mabi/enchants.json?callback=?';
  $.getJSON(url, params, function(json){
	      callback(json);
	    });
};

/* ---------------------------------------------------------------------- */

/**
 * リクエストの管理を行う
 *
 * リクエストした順番にレスポンスが返されることを保証する(古いレスポンスは破棄する)
 *
 * リクエストが大量に発生しないようにする。
 */
mabi.requester = {
  THROTTLE_PERIOD: 500,

  next_id: 0,

  /**
   * 最後に処理したレスポンスの ID
   */
  last_response_id: -1,

  /**
   * 処理中のリクエスト
   */
  requests: [],

  /**
   * 処理待ちのリクエスト
   */
  wait_request: null,

  timer: null,

  /**
   * リクエストを行う
   *
   * @param requestFunc function(callback) リクエストを行う関数。 渡される callback をリクエスト完了時に呼び出す必要がある。
   * callback はリクエストの結果を1つだけ受け取る。
   * @param callback function(result) リクエスト完了時に処理を行う関数。
   */
  request: function(requestFunc, callback){
    var request = {
      id: this.next_id++,
      requestFunc: requestFunc,
      callback: callback
    };

    this.wait_request = request; // 古いリクエストは破棄

    if(this.timer){
      clearTimeout(this.timer);
    }
    // 処理中のリクエストがある場合には、新しいリクエストの実行を遅らせる
    this.timer = setTimeout(this.onTimeout, this.THROTTLE_PERIOD * (this.requests.length + 1));
  },

  /**
   * 処理中の件数を返す
   */
  getRequestCount: function(){
    var i = this.requests.length;
    if(this.wait_request){
      ++i;
    }
    return i;
  },

  /**
   * サーバへ問い合わせを行う
   */
  onTimeout: function(){
    var _this =	mabi.requester;
    _this.timer = null;

    var request = _this.wait_request;
    _this.wait_request = null;
    _this.requests.push(request);
    // console.info('開始: ' + request.id);
    request.requestFunc(function(result){
			  // 古いリクエストの情報を破棄する
			  _this.requests = $.grep(_this.requests, function(a){return a.id > request.id;});

			  if(request.id <= _this.last_response_id){
			    // console.info('破棄: ' + request.id);
			    return;
			  }

			  // console.info('処理: ' + request.id);
			  _this.last_response_id = request.id;
			  request.callback(result);
			});
  }

};

/* ---------------------------------------------------------------------- */
/* Enchant View */

mabi.ev = {
  // 最後に入力したエンチャント名
  latestName: '',

  // 検索条件
  conditions: {},

  /**
   * テーブルの列名から DataTables 内での列インデックスへ変換する
   */
  nameToIndexMap: {},

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
};

/**
 * サーバから返された JSON を DataTables 形式の JSON へ変換する
 */
mabi.ev.toDataTablesJson = function(json){
  var data = [];
  for(var i = 0; i < json.length; ++i){
    var o = json[i];
    data.push([
		o.root,
		o.rank,
		[o.names, o.wiki],
		o.equipment_text || '',
		[o.effects, o.effect_texts],
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

mabi.ev.serverData = function(sSource, aoData, fnCallback){
  mabi.ev.spinner.show();

  var params = {
  };

  for(var name in mabi.ev.conditions){
    params[name] = mabi.ev.conditions[name];
  }

  for(var i = 0; i < aoData.length; ++i){
    var a = aoData[i];

    switch(a.name){
    case 'iSortCol_0':
      params.orderby = mabi.ev.indexToConditionNameMap[parseInt(a.value)];
      break;
    case 'sSortDir_0':
      params.sortorder = a.value == 'asc' ? 'ascending' : 'descending';
      break;
    case 'iDisplayLength':
      params['max-results'] = a.value;
      break;
    }
  }

  mabi.requester.request(function(callback){
			   mabi.enchants.getEnchants(params, callback);
			 },
			 function(json){
  			   fnCallback(mabi.ev.toDataTablesJson(json));
			   // console.info(mabi.requester.getRequestCount());
			   if(mabi.requester.getRequestCount() == 0){
  			     mabi.ev.spinner.hide();
			   }

			   mabi.ev.updateColumnVisibility();
			 });
};

/**
 * 現在の検索条件にあわせ、カラムの表示/非表示を更新する
 */
mabi.ev.updateColumnVisibility = function(){
  mabi.ev.checkboxes.each(function(){
			    if(this.name == 'attack_max'){
			      mabi.ev.toggleColumn('attack_max', this.checked);
			      mabi.ev.toggleColumn('melee_attack_max', this.checked);
			      mabi.ev.toggleColumn('ranged_attack_max', this.checked);
			    }else{
			      mabi.ev.toggleColumn(this.name, this.checked);
			    }});
};

/**
 *
 */
mabi.ev.createNameToIndex = function(element){
  var ths = element.find('thead tr th');
  ths.each(function(index){
	     mabi.ev.nameToIndexMap[this.className] = index;
	   });
};

/**
 * エンチャントを検索する
 */
mabi.ev.searchEnchants = function(){
  mabi.ev.table.fnFilter('');
};

/**
 * 指定された列を表示/非表示にする
 *
 * @param name 列名称
 */
mabi.ev.toggleColumn = function(name, visibled){
  var table = mabi.ev.table;
  var head = table.find('thead tr');

  var index = mabi.ev.nameToIndexMap[name];
  if(index){
    table.fnSetColumnVis(index, visibled);
  }
};

/**
 * エンチャントリストを表示する
 */
mabi.showEnchantList = function(element){
  // todo element に関連づいているものにイベントをつける
  mabi.ev.condition_form = $('form.condition');
  mabi.ev.spinner = $('.spinner');

  mabi.ev.spinner.hide();

  mabi.ev.createNameToIndex(element);

  mabi.ev.name = mabi.ev.condition_form.find("input[name='name']");

  mabi.ev.condition_form.find("input[name='name']").keyup(
      function(){
	var name = 'name';
	delete mabi.ev.conditions[name];
	if(this.value){
	  mabi.ev.conditions[name] = this.value;
	}
	mabi.ev.searchEnchants();
      });

  mabi.ev.condition_form.find('select').change(
      function(){
	delete mabi.ev.conditions[this.name];
	if(this.value){
	  mabi.ev.conditions[this.name] = this.value;
	}
	mabi.ev.searchEnchants();
      });

  $('.option_button').click(function(){
			      $('div.option').toggle('normal');
			      return false;
			    });

  mabi.ev.checkboxes = mabi.ev.condition_form.find(".effects input[type='checkbox']");
  mabi.ev.checkboxes.click(
      function(){
	var name = 'effects';
	delete mabi.ev.conditions[name];

	var checks = mabi.ev.condition_form.find(".effects input[type='checkbox'][checked]");
	var conds = [];
	checks.each(function(){
		      conds.push(this.value);
		    });
	if(conds.length >= 1){
	  mabi.ev.conditions[name] = conds.join(' ');
	}
	mabi.ev.searchEnchants();
      });

  mabi.ev.table = $(element).dataTable(
    {
      "bServerSide": true,
      "fnServerData": mabi.ev.serverData,
      "sPaginationType": "full_numbers",
      "sDom": 'rtp',
      "bAutoWidth": false,
      "bLengthChange": false,
      "iDisplayLength": 20,
      "bJQueryUI": true,
      "aoColumns": [
	null,

	// ランク
	{
	  "fnRender": function(oObj){
	    var a = oObj.aData[oObj.iDataColumn];
	    switch(a){
	    case 10:
	      return 'A';
	    case 11:
	      return 'B';
	    case 12:
	      return 'C';
	    case 13:
	      return 'D';
	    case 14:
	      return 'E';
	    case 15:
	      return 'F';
	    default:
	      return a;
	    }
	  }
	},

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
	    var effects = oObj.aData[oObj.iDataColumn][0];
	    var effect_texts = oObj.aData[oObj.iDataColumn][1];
	    var list = [];
	    for(var i = 0; i < effects.length; ++i){
	      var up = true;
	      if(effects[i].min < 0){
		up = false;
	      }
	      if(effects[i].status == 'repair_cost'){
		up = !up;
	      }
	      var style_class =	up ? 'up' : 'down';
	      list.push('<li class="' + style_class + '">' + effect_texts[i] + '</li>');
	    }
	    return '<ul>' + list.join('\n') + '</ul>';
	  }},

	{ "bVisible": false, "asSorting": ['desc', 'asc']},
	{ "bVisible": false, "asSorting": ['desc', 'asc']},
	{ "bVisible": false, "asSorting": ['desc', 'asc']},

	// クリティカル
	{ "bVisible": false,
	  "asSorting": ['desc'],
	  "fnRender": function(oObj){
	    return oObj.aData[oObj.iDataColumn] + '%';
	  }
	},

	{ "bVisible": false, "asSorting": ['desc', 'asc']},
	{ "bVisible": false, "asSorting": ['desc', 'asc']},
	{ "bVisible": false, "asSorting": ['desc', 'asc']},
	{ "bVisible": false, "asSorting": ['desc', 'asc']},
	{ "bVisible": false, "asSorting": ['desc', 'asc']}
      ]
    });
};

