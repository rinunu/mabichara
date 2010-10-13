
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

    this.elementTypes_ = [];

    $table.delegate('.editable', 'click', util.bind(this, this.onClick));
};

mabi.ElementsView.prototype.setModel = function(model){
    console.assert(!this.model_);
    this.model_ = model;
    util.Event.bind(this.model_, this, {addChild: util.bind(this, this.onAddElements)});

    this.createTable();
    this.refreshValues();
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
	    this_.addElement(element, true);
	});
};

/**
 * 要素を展開して表示すべきか調べる
 */
mabi.ElementsView.prototype.shouldExpand = function(element){
    var result = true;
    $.each(this.elementTypes_, function(i, v){
	       if(element instanceof v.type){
		   result = false;
		   return false;
	       }
	       return true;
	   });
    return result;
};

/**
 * 1 Element 分の行を追加する
 * 
 * @param 追加するカラムの最初のインデックス
 */
mabi.ElementsView.prototype.addElement = function(element, first){
    var this_ = this;

    this.addRow(element, first);
    if(this.shouldExpand(element)){
	element.eachChild(
    	    function(element, slotId){
    		this_.addElement(element, false);
    	    });
    }
};

/**
 * 1行追加する
 * 
 * @param Element を構成する行のうち、最初の行を追加する際に true とする。
 */
mabi.ElementsView.prototype.addRow = function(element, first){
    var $tbody = $('tbody', this.$table_);
    var $tr = $('<tr/>').appendTo($tbody);
    $tr.data('element', element);
    for(var i = 0; i < this.columns_.length; i++){
	var column = this.columns_[i];
	var $td = null;
	if(column.colspan){
	    if(first){
		$td = $('<td/>');
		$td.attr('rowspan', element.childrenLength() + 1);
	    }
	}else{
	    if(!this.shouldExpand(element)){ // 展開可能要素は値を表示しない
		$td = $('<td/>');
	    }
	}

	if($td){
	    $td.attr('id', this.cellId(element, column));
	    $td.text('-');
	    $td.appendTo($tr);
	}
    }
};

/**
 * 1 Element 分の行を削除する
 */
mabi.ElementsView.prototype.removeElement = function(element){
    var this_ = this;
    var $tbody = $('tbody', this.$table_);
};

/**
 * テーブル全体の数値を更新する
 */
mabi.ElementsView.prototype.refreshValues = function(){
    var this_ = this;
    this.model_.eachChild(
    	function(element){
    	    this_.refreshElement(element);
    	});
};

/**
 * Element 1つ分の表示を更新する
 */
mabi.ElementsView.prototype.refreshElement = function(element){
    console.assert(element instanceof mabi.Element);
    var this_ = this;

    this.refreshRow(element);
    if(this.shouldExpand(element)){
	element.eachChild(
    	    function(element, slotId){
    		this_.refreshElement(element);
    	    });
    }
};

mabi.ElementsView.prototype.refreshRow = function(element){
    console.assert(element instanceof mabi.Element);
    for(var i = 0; i < this.columns_.length; i++){
	var column = this.columns_[i];
	this.refreshCell(element, column);
    }
};

/**
 * セルの値を更新する
 * 
 * セルに紐づいている Element の内容が変わった際に使用する
 */
mabi.ElementsView.prototype.refreshCell = function(element, column){
    console.assert(element instanceof mabi.Element);
    console.assert(column);

    var $td = this.td(element, column);
    if($td.length == 0){
	// その値を表示するセルがない場合もあるため
	// 例えば エンチャントの slot を表示するセルはない場合もある
	return;
    }

    var c = new mabi.ContextualElement(element, null, this.model_);

    if(column.render){
	column.render($td, c);
    }else{
	var value = column.value(c);
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
 * 指定した内容を表示する行の class を取得する
 */
mabi.ElementsView.prototype.rowClass = function(element){
    return '' + this.id_ + '_' + element.id();
};

/**
 * 特定のセル(td)を取得する
 * 
 * 存在しない場合は空を返す
 */
mabi.ElementsView.prototype.td = function(element, column){
    var $td = $('#' + this.cellId(element, column));
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
    var $dom = $(child).closest('tr');
    if($dom.length == 0){
        return null;
    }
    return $dom.data('element');
};

// ----------------------------------------------------------------------
// 設定

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

/**
 * Element のタイプごとの設定を追加する
 * 
 * @param type: Element のサブクラスのいずれか
 * @param options {
 * }
 * 現在追加の設定は持たない。
 * ただし、この設定が行われた Element のみ、画面に表示する。
 */
mabi.ElementsView.prototype.addElementType = function(type, options){
    options = options || {};
    options.type = type;
    this.elementTypes_.push(options);
};

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
	     value: function(c){
		 var slot = c.element().slot();
		 return SLOTS[slot].label;
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
