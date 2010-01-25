var weapons = {};

weapons.columns = [
  'name',
  'proficiency',
  'attack_min',
  'attack_max',
  'critical',
  'durability',
  'upgrades_text',
  'balance',
  'cost'
];

weapons.toDataTablesJson = function(json){
  var data = [];
  for(var i = 0; i < json.length; ++i){
    var o = json[i];
    data.push([
	      o.name,
	      o.proficiency,
	      o.attack_min,
	      o.attack_max,
	      o.critical,
	      o.durability,
	      o.upgrades_text
	     ]);
  }

  return {
    "iTotalRecords": 500,
    "iTotalDisplayRecords": json.length,
    "aaData": data
  };
};

weapons.serverData = function(sSource, aoData, fnCallback){
  var params = {
  };

  for(var i = 0; i < aoData.length; ++i){
    var a = aoData[i];
    switch(a.name){
    case 'iSortCol_0':
      params.orderby = weapons.columns[parseInt(a.value)];
      break;
    case 'iSortDir_0':
      params.sortorder = a.value == 'asc' ? 'ascending' : 'descending';
      break;
    case 'iDisplayLength':
      params['max-results'] = a.value;
      break;
    }
  }

  $.getJSON(sSource, params, function(json){
	      fnCallback(weapons.toDataTablesJson(json));
	    });
};

weapons.ready = function(){
  weapons.table = $('table.weapons').dataTable(
    {
      "bServerSide": true,
      "sAjaxSource": '/mabi/weapons.json',
      "fnServerData": weapons.serverData,
      "sPaginationType": "full_numbers",
      "sDom": 'rtp',
      "bAutoWidth": false,
      "bLengthChange": false,
      "iDisplayLength": 20
    });
};


$(document).ready(weapons.ready);
