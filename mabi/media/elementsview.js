
/**
 * Element のリストを表示するビュー
 * 
 * model: 表示する Element を子供にもつ Element.
 * この model の1つの子どもが1行として表示される。
 * 
 * @param options {
 * }
 * 
 * ソート(部位、)
 * 
 * 折りたたみ表示(render の切り替え？)
 */
mabi.ElementsView = function($table, options){
    options = options || {};

    this.id_ = mabi.ElementsView.nextId_++;

    this.$table_ = $table;

    this.columns_ = [];
};

mabi.ElementsView.prototype.setModel = function(model){
    console.assert(!this.model_);
    this.model_ = model;
    util.Event.bind(this.model_, this, {addChild: util.bind(this, this.onAddElements)});

    this.createTable();
    this.refreshValues();
};

/**
 * 表示する列を追加する
 * 
 * @param options {
 * id: 
 * label: 
 * render: カラムのセルの描画を行う function(optional).
 * value: Element から表示する値を取得する function.
 *   function(contextualElement)
 * colspan: 
 * }
 */
mabi.ElementsView.prototype.addColumn = function(options){
    this.columns_.push(options);
};

mabi.ElementsView.prototype.showColumn = function(options){
};

mabi.ElementsView.prototype.hideColumn = function(options){
};

// todo 展開する・しないの設定

// ----------------------------------------------------------------------
// private

/**
 * 各 ElementsView の識別子生成用
 */
mabi.ElementsView.nextId_ = 0;

// 設定
(function(){
     var i;

     var SLOTS = {
	 title: {label: 'タイトル'},
	 right_hand: {label: '右手'},
	 left_hand: {label: '左手'},
	 head: {label: '頭'},
	 accessory1: {label: 'アクセサリー1'},
	 accessory2: {label: 'アクセサリー2'},
	 body: {label: '体'},
	 hand: {label: '手'},
	 foot: {label: '足'},
	 robe: {label: 'ローブ'}
     };
     for(i in SLOTS){
	 SLOTS[i].id = i;
     }

     mabi.EquipmentSetView.SLOTS = SLOTS;

     var renderName = function($parent, element){
	 if(element instanceof mabi.EquipmentSet){
	     element.eachChild(
		 function(equipment){
		     renderName($parent, equipment);
		 });
	 }else if(element instanceof mabi.Equipment){
	     var $div = $('<div/>').appendTo($parent);
	     var a = ['prefix', 'suffix', 'equipment'];
	     for(var i = 0; i < a.length; i++){
		 var e = element.child(a[i]);
		 if(e){
		     renderName($div, e);
		 }
	     }
	 }else{
	     $('<span class="element"/>').text(element.name()).
		 appendTo($parent);
	 }
     };

     /**
      * 表示できる列の情報
      */
     var COLUMNS = {
	 slot:{
	     label: '部位',
	     colspan: true,
	     value: function(c, slotId){
		 return SLOTS[slotId].label;
	     }
	 },
	 name:{
	     label: '名前',
	     render: function($td, c){
		 $td.empty();
		 renderName($td, c.element());
	     },
	     class_: 'editable'
	 },
	 attack_max_ranged:{
	     label: '最大(弓)',
	     value: function(c){
		 return c.param('attack_max') + c.param('dex') / 2.5;
	     }
	 },
	 critical_luck_will:{
	     label: 'クリ',
	     value: function(c){
		 return c.param('critical') + c.param('will') / 10.0 + c.param('luck') / 5.0;
	     }
	 },
	 attack_max_melee:{
	     label: '最大(近接)', 
	     value: function(c){
		 return c.param('attack_max') + c.param('str') / 2.5;
	     }
	 }
     };
    
     for(i in COLUMNS){
	 COLUMNS[i].id = i;
     }

     mabi.ElementsView.COLUMNS = COLUMNS;
})();

mabi.ElementsView.prototype.onAddElements = function(s, e, elements){
    this.addElement(elements[0].element, 0, elements[0].slot);
    this.refreshElement(elements[0].element, 0, elements[0].slot);
};

mabi.ElementsView.prototype.onRemoveElements = function(s, e, elements){
};

mabi.ElementsView.prototype.onRefreshElements = function(s, e, elements){
};

/**
 * テーブルを作成する
 */
mabi.ElementsView.prototype.createTable = function(){
    var this_ = this;
    this.model_.eachChild(
	function(element, slotId){
	    this_.addElement(element, 0);
	});
};

/**
 * 要素を展開して表示すべきか調べる
 */
mabi.ElementsView.prototype.shouldExpand = function(element){
    return element instanceof mabi.Equipment;
};

/**
 * 1 Element 分の行を追加する
 * 
 * @param 追加するカラムの最初のインデックス
 */
mabi.ElementsView.prototype.addElement = function(element, columnIndex){
    var this_ = this;
    var $tbody = $('tbody', this.$table_);
    var $tr = $('<tr/>').appendTo($tbody);

    for(var i = columnIndex; i < this.columns_.length; i++){
	var column = this.columns_[i];
	var $td = $('<td/>');
	$td.attr('id', this.cellId(element, column));
	$td.text('-');
	$td.appendTo($tr);
	if(column.colspan && this.shouldExpand(element)){
	    // これ以降 child element で処理をすすめる
	    $td.attr('rowspan', 4); // todo
	    element.eachChild(
    		function(element, slotId){
    		    this_.addElement(element, i + 1);
    		});
	    break;
	}
    }
};

/**
 * テーブル全体の数値を更新する
 */
mabi.ElementsView.prototype.refreshValues = function(){
    var this_ = this;
    this.model_.eachChild(
	function(element, slotId){
	    this_.refreshElement(element, 0, slotId);
	});
};

/**
 * 1 Element 分の数値を更新する
 */
mabi.ElementsView.prototype.refreshElement = function(element, columnIndex, slotId){
    console.assert(element instanceof mabi.Element);
    console.assert(typeof columnIndex == 'number');
    var this_ = this;

    for(var i = columnIndex; i < this.columns_.length; i++){
	var column = this.columns_[i];
	this.refreshCell(element, column, slotId);

	if(column.colspan && this.shouldExpand(element)){
	    // これ以降 child element で処理をすすめる
	    element.eachChild(
    		function(element, slotId){
    		    this_.refreshElement(element, i + 1, slotId);
    		});
	    break;
	}
    }
};

/**
 * テーブルの指定した数値セルの値を更新する
 */
mabi.ElementsView.prototype.refreshCell = function(element, column, slotId){
    console.assert(element instanceof mabi.Element);
    console.assert(column);
    var c = new mabi.ContextualElement(element, null, this.model_);

    var $td = this.td(element, column);
    if(column.render){
	column.render($td, c);
    }else{
	var value = column.value(c, slotId);
	if(value === null){
	    value = '-';
	}
	$td.text(value);
    }
    if(column.class_){
	$td.addClass(column.class_);
    }
};

/**
 * 指定した内容を表示するセルの ID を取得する
 */
mabi.ElementsView.prototype.cellId = function(element, column){
    return '' + this.id_ + '_' + element.id() + '_' + column.id;
};

/**
 * 特定のセル(td)を取得する
 */
mabi.ElementsView.prototype.td = function(element, column){
    var $td = $('#' + this.cellId(element, column));
    console.assert($td);
    return $td;
};


