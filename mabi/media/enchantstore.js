/**
 * Enchant データの管理を行う
 */
mabi.EnchantStore = function(){
    this.elements_ = [];
};

/**
 * 初期化を行う
 * 
 * データをロードするため、処理は非同期に行う
 */
mabi.EnchantStore.prototype.initialize = function(){
    return this.load();
};

// ----------------------------------------------------------------------
// private

mabi.EnchantStore.prototype.load = function(){
    var this_ =  this;
    var cmd = new util.AsyncCommand(
	function(){
	    var options = {
		url: '/enchants.json',
		callbackParameter: 'callback',
		data: {
		    'max-results': 10000
		},
		success: function(json){
		    for(var i = 0; i < json.entry.length; i++){
			this_.addEnchantJson(json.entry[i]);
		    }
		    cmd.onSuccess();
		},
		error: function(){alert('エンチャントデータの読み込みに失敗しました');}
	    };
	    $.jsonp(options);
	});
    cmd.execute();
    return cmd;
};

/**
 * サーバから受信したデータをローカルに保存する
 */
mabi.EnchantStore.prototype.addEnchantJson = function(json){
    var effects = [];
    var es = new mabi.Enchant(
    {
	name: json.names[0],
	effects: json.effects,
	rank: json.rank,
	type: json.root == 'p' ? 'prefix' : 'suffix'
    });
    this.elements_.push(es);
};

// ----------------------------------------------------------------------
// 開発用

mabi.EnchantStore.prototype.find = function(name){
    for(var i = 0; i < this.elements_.length; i++){
	var a = this.elements_[i];
	if(a.name() == name){
	    return a;
	}
    }
    throw 'error:' + name;
};