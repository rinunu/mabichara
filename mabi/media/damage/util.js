
/**
 * select を初期化する
 */
dam.initializeSelect = function($select, items){
    $select.empty();
    items.each(
	function(i, item){
	    $('<option />').text(item.name()).appendTo($select);
	});
};

/**
 * 組み合わせを生成、各組み合わせごとに fn を呼び出す
 * 
 * fn の引数はマップである。
 * 
 * @param i seed のインデックス。 これ以降の seed について組み合わせを生成する(ユーザは使用しない)
 * @param map 現在の組み合わせ結果(ユーザは使用しない)
 */
dam.combination = function(seed, fn, i, map){
    i = i === undefined ? 0 : i;
    map = map || {};
    var param = seed[i][0];
    var values = seed[i][1];
    if(i == seed.length - 1){
	$.each(values, function(j, value){
		   map[param] = value;
		   fn(map);
	       });
    }else{
	$.each(values, function(j, value){
		   map[param] = value;
		   dam.combination(seed, fn, i + 1, map);
	       });
    }
};

