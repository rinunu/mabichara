/**
 * 些細な子たち
 * (ファイル数が多いと開発時に重たいのでまとめる)
 */

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

/**
 * Editor を管理する
 * 
 * Element のタイプと Editor を紐付ける
 */
mabi.EditorManager = function(){
    
};

mabi.EditorManager.prototype.initialize = function(){
};

/**
 * element を編集する画面を表示する
 */
mabi.EditorManager.prototype.edit = function(element){
    var editor;
    if(element instanceof mabi.NoEnchantedEquipment){
	editor = mabi.equipmentView;
    }else if(element instanceof mabi.Equipment){
	editor = mabi.equipmentView;
    }else if(element instanceof mabi.Title){
	editor = mabi.titleView;
    }else if(element instanceof mabi.Enchant){
	editor = mabi.enchantView;
    }else{
	console.assert(false);
    }
    editor.edit(element);
}
