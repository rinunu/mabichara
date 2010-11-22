mabi.DefensesView = function($element){
    var this_ = this;
    console.assert($element instanceof jQuery);
    this.$element_ = $element;

    this.$mob_ = $element.find('select.mob');
    this.$defenses_ = $element.find('select.defenses');

    $element.find('button.add').click(function(){
        this_.addDefenses();
    });
    $element.find('button.remove').click(function(){
        this_.defenses_.remove(this_.$defenses_.binding('selectedItems'));
    });
};

/**
 * ビューを表示する
 *
 * 初期値として defenses を設定する。
 */
mabi.DefensesView.prototype.show = function(defenses){
    var this_ = this;
    var $element = this.$element_;
    this.defenses_ = new mabi.Collection;
    $.each(defenses, function(i, offense){
        this_.defenses_.push(offense);
    });

    this.$mob_.binding({source: dam.parts.mobs});
    this.$defenses_.binding({source: this.defenses_});

    // 見た目の定義
    $('select', $element).binding('itemTemplate', function(item){
        if(item instanceof mabi.Element){
            return item.name() + '(防御:' + item.defense() + ' 保護:' + item.protection() + ')';
        }else{ // item = defense
            item = item['mob'];
            return item.name() + '(防御:' + item.defense() + ' 保護:' + item.protection() + ')';
        }
    });
};

/**
 * defenses を取得する
 */
mabi.DefensesView.prototype.data = function(){
    var result = [];
    this.defenses_.each(function(i, v){
        result.push(v);
    });
    return result;
};

// ----------------------------------------------------------------------
// private

/**
 * 入力欄から defenses へ追加する
 */
mabi.DefensesView.prototype.addDefenses = function(){
    var this_ = this;
    var names = ['body', 'protectors', 'weapons', 'expression'];
    
    var selected = this.$mob_.binding('selectedItems');
    if(selected.length == 0){
        throw 'MOB を選択してください';
        return;
    }

    $.each(selected, function(i, v){
        this_.defenses_.push({mob: v});
    });
};