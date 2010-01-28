var my = {};

// 構造: {絞り込み条件のキー : {各行のID : true} }
// このフィルタの中に入っているものは、画面に表示する
// 絞り込み条件のキーは input.id か input.value のどちらか
my.filters = {};

/**
 * カラム名とテーブル上のカラム位置の関連表
 */
my.columns = {};

/**
 * @param filterFunc bool function(es) 形式の関数。
 * false を返すと、その列はフィルタされる。 null を渡すとフィルタを解除する。
 */
my.updateFilter = function(filterName, filterFunc){
  delete my.filters[filterName];
  if(filterFunc){
    var filter = {};
    $(my.ess).each(function(){
		     var es = this;
		     if(filterFunc(es)){
		       filter[es.id] = true;
		     }
		   });
    my.filters[filterName] = filter;
  }
  my.tl.fnFilter("");
};

/**
 * my.columns を作成する
 */
my.makeColumns = function(table){
  var ths = $(table).find('thead th');
  var i = 0;
  ths.each(function(){
	     my.columns[this.className] = i;
	     ++i;
	   });
};

/**
 * メモリ上に ES リストを作る(todo サーバで作る)
 */
my.makeESList = function(){
  my.ess = [];
  var es_trs = $('table.enchants tbody tr');
  es_trs.each(function(){
		var es_tds = $(this).find('td');
		var es = {id: $(es_tds[0]).text(),
			  equipment: $(es_tds[1]).text(),
			  effects: $(es_tds[2]).text(),
			  root: $(es_tds[3]).text(),
			  name: $(es_tds[5]).text()
			 };
		my.ess.push(es);
	      });
};

$(document).ready(
  function(){

    $.fn.dataTableExt.afnFiltering.push(
      function(oSettings, aData, iDataIndex){
	var es_id = aData[0];
	for(i in my.filters){
	  var filter = my.filters[i];
	  if(!filter[es_id]){
	    return false;
	  }
	}
	return true;
    });

    $('input.name').keyup(
      function(){
	var name = this.value;
	if(name.length == 0){
	  my.updateFilter('name', null);
	}else{
	  my.updateFilter('name', function(es){ return es.name.indexOf(name) != -1; });
	}
      });

    $('select.root').change(
      function(){
	var root = this.value;
	if(root.length == 0){
	  my.updateFilter('root', null);
	}else{
	  my.updateFilter('root', function(es){ return root == es.root; });
	}
      });

    $('select.equipment').change(
      function(){
	if(!this.value){
	  my.updateFilter('equipment', null);
	}else{
	  var re = new RegExp(this.value);
	  my.updateFilter('equipment', function(es){ return re.test(es.equipment); });
	}
      });

    $('div.effects input').click(
      function(){
	if(this.className == 'attack_max'){
	  my.tl.fnSetColumnVis(my.columns['attack_max'], this.checked);
	  my.tl.fnSetColumnVis(my.columns['melee_attack_max'], this.checked);
	  my.tl.fnSetColumnVis(my.columns['ranged_attack_max'], this.checked);
	}else{
	  if(this.className && my.columns[this.className]){
	    my.tl.fnSetColumnVis(my.columns[this.className], this.checked);
	  }
	}

	if(!this.checked){
	  my.updateFilter(this.value, null);
	}else{
	  var re = new RegExp(this.value);
	  my.updateFilter(this.value, function(es){ return re.test(es.effects); });
	}
      });

    $('.option_button').click(function(){
				$('div.option').toggle('normal');
				return false;
			      });

    my.makeESList();
    my.makeColumns($('table.enchants'));

    my.tl = $('table.enchants').dataTable(
    {
      "bJQueryUI": true,
      "sPaginationType": "full_numbers",
      "sDom": 'rtp',
      "bAutoWidth": false,
      "bLengthChange": false,
      "iDisplayLength": 15,
      "aoColumns": [{ "bVisible": false },
		    { "bVisible": false },
		    { "bVisible": false },
		    null, null, null, null, null,
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


});
