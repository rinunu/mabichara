
/**
 * Element のリストを表示するビュー
 * 
 * 
 * 機能
 * - todo ソート(部位、)
 * - Element 選択時に通知する
 * - todo 折りたたみ表示(render の切り替え？)
 * 
 * @param model: 表示する Element を子供にもつ Element.
 * 基本的に、この model の1つの子どもが1行として表示される。
 * 
 * 
 * table の構造
 * - tr = todo {data: 表示している Element}
 *   - td: {id: 表示している Element の id を元に決定, data: 表示している Element}
 */
mabi.ElementsView = function($table, options){
    options = options || {};

    this.id_ = mabi.ElementsView.nextId_++;

    this.$table_ = $table;

    this.columns_ = [];

    $table.delegate('.editable', 'click', util.bind(this, this.onClick));
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

// ----------------------------------------------------------------------
// event handler

mabi.ElementsView.prototype.onClick = function(event){
    var element = this.element(event.target);
    mabi.editorManager.edit(element);
};

mabi.ElementsView.prototype.onAddElements = function(s, e, elements){
    this.addElement(elements[0].element, 0, elements[0].slot);
    this.refreshElement(elements[0].element, 0, elements[0].slot);
};

mabi.ElementsView.prototype.onRemoveElements = function(s, e, elements){
    this.removeElement(elements[0].element);
};

mabi.ElementsView.prototype.onRefreshElements = function(s, e, elements){
};

// ----------------------------------------------------------------------

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
	    // これ以降の Column は child element の情報を表示する
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
 * 1 Element 分の行を削除する
 */
mabi.ElementsView.prototype.removeElement = function(element){
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
	    // これ以降の Column は child element の情報を表示する
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
 * 1 Element 分の表示を更新する
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
 * セルの値を更新する
 * 
 * セルに紐づいている Element が変更になった or 値が変わった際に使用する
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
    $td.data('element', element);
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

/**
 * 指定した Element の扱いに関する情報を取得する
 */
mabi.ElementsView.prototype.type = function(element){
    return element.constructor.elementsView || {};
};

/**
 * DOM 要素に紐づいた Element を取得する
 */
mabi.ElementsView.prototype.element = function(child){
    var $dom = $(child).closest('td');
    if($dom.length == 0){
        return null;
    }
    return $dom.data('element');
};

// ----------------------------------------------------------------------
// 設定

(function(){
     var i;

     // Element のタイプに情報を付加する
     mabi.Equipment.elementsView = {
	 shouldExpand: true
     };

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
