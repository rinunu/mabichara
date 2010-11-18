/**
 * 先頭を大文字にする
 */
mabi.capitalize = function(s){
    return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
};