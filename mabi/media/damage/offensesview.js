
/**
 * Character, Attack 等の組み合わせを作成するビュー
 */
mabi.OffensesView = function($element){
    var this_ = this;
    console.assert($element instanceof jQuery);
    this.$element_ = $element;

    this.$body_ = $element.find('select.body');
    this.$protectors_ = $element.find('select.protector');
    this.$weapons_ = $element.find('select.weapon');
    this.$expression_ = $element.find('select.expression');
    this.$offenses_ = $element.find('select.condition');

    $element.find('a.edit').click(function(){
        alert('未実装');
    });

    $element.find('button.add').click(function(){
        this_.addOffenses();
    });
    $element.find('button.remove').click(function(){
        this_.offenses_.remove(this_.$offenses_.binding('selectedItems'));
    });
};

/**
 * ビューを表示する
 *
 * 初期値として offenses を設定する。
 */
mabi.OffensesView.prototype.show = function(offenses){
    var this_ = this;
    var $element = this.$element_;
    this.offenses_ = new mabi.Collection;
    $.each(offenses, function(i, offense){
        this_.offenses_.push(offense);
    });

    $.each([
        [this.$body_, dam.parts.bodies],
        [this.$protectors_, dam.parts.protectors],
        [this.$weapons_, dam.parts.weapons],
        [this.$expression_, dam.parts.expressions]
    ], function(i, v){
        v[0].binding({source: v[1]});
    });
    this.$offenses_.binding({source: this.offenses_});

    // 見た目の定義
    $('select', $element).binding('itemTemplate', function(item){
        if(item instanceof mabi.Element){
            return item.name();
        }else if(item instanceof mabi.Expression){
            return item.name();
        }else{ // item = offense
            var a = [];
            $.each(['body', 'protectors', 'weapons', 'expression'], function(i, v){
                a.push(item[v].name());
            });
            return a.join('/');
        }
    });
};

/**
 * offenses を取得する
 */
mabi.OffensesView.prototype.data = function(){
    var result = [];
    this.offenses_.each(function(i, v){
        result.push(v);
    });
    return result;
};

// ----------------------------------------------------------------------
// private

/**
 * 入力欄から offenses へ追加する
 */
mabi.OffensesView.prototype.addOffenses = function(){
    var this_ = this;
    var names = ['body', 'protectors', 'weapons', 'expression'];

    var source = []; // combination 作成用ソース
    try{
        $.each(names, function(i, name){
                var $element = this_['$' + name + '_'];
            var selected = $element.binding('selectedItems');
            if(selected.length == 0){
                throw 'すべての条件を選択してください';
            }
            source.push([name, selected]);
        });
    }catch(a){
        alert(a);
        return;
    }

    dam.combination(source, function(map){
        this_.offenses_.push($.extend({}, map));
    });
};