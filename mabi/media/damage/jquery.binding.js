
/**
 * <select> と JavaScript オブジェクトをバインディングする
 *
 * バインディング対象について
 * 以下の条件を満たす必要がある
 * - each(function(index, value)) をもつこと
 * -
 *
 * バインド
 * binding({source: MySource})
 *
 * 見た目の設定
 * JavaScript オブジェクトからテキストへ変換する関数を指定する
 * binding('itemTemplate', function(model){return text;})
 *
 * 対応している DOM
 * - select
 */
(function($){
    /**
     * $element を source で更新する
     */
    function update($element){
        var data = $element.data('binding');
        $element.empty();
        if(data.itemTemplate){
            data.source.each(function(i, v){
                $('<option />').text(data.itemTemplate(v)).
                    data('model', v).
                    appendTo($element);
            });
        }
    }
    
    var methods = {

        init: function(options) {
            var settings = {
            };
            options = $.extend(settings, options);
            return this.each(function(){
                var $this = $(this),
                    data = $this.data('binding');
                if(!data){
                    $this.data('binding', {
                        source: options.source
                    });
                    $(options.source).bind('change.binding', function(){update($this);});
                    update($this);
                }
            });
        },

        itemTemplate: function(itemTemplate){
            return this.each(function(){
                var $this = $(this),
                    data = $this.data('binding');
                data.itemTemplate = itemTemplate;
                update($this);
            });
        },
        
        destroy: function( ) {
            return this.each(function(){
                var $this = $(this),
                    data = $this.data('binding');
                $this.removeData('binding');
                $this.unbind('.binding');
            });
        },

        /**
         * 最初の要素の選択されているオブジェクトの配列を取得する
         */
        selectedItems: function(){
            var result = [];
            this.find('option:selected').each(function(){
                result.push($(this).data('model'));
            });
            return result;
        }
    };

    $.fn.binding = function(method){
        if(methods[method]){
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }else{
            $.error('Method ' +  method + ' does not exist on jQuery.binding');
            throw 'error';
        }
  };

})(jQuery);
