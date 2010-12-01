/**
 * Title データの管理を行う
 */
mabi.TitleStore = function(){
    var this_ = this;
    mabi.Store.call(this, {resourceName: 'titles'});

    // TODO 以下のものもサーバから取得する
    $.each([
        {
            name: 'アルケミマスター',
            effects: {
                // 他は省略
                waterAlchemyDamage: 10,
                fireAlchemyDamage: 10,
                windAlchemyDamage: 10,
                earthAlchemyDamage: 10
            }
        },
        {
            name: 'ウォーターアルケミマスター',
            effects: {
                // 他は省略
                waterAlchemyEfficiency: 0.10 * 0.1
            }
        },
        {
            name: 'ファイアアルケミマスター',
            effects: {
                // 他は省略
                fireAlchemyEfficiency: 0.10 * 0.1
            }
        },
        {
            name: 'ヒートバスターマスター',
            effects: {
                // 他は省略
            }
        }

    ], function(i, v){
        var a = new mabi.TitleClass(v);
        this_.add(a);
    });
};

util.extend(mabi.TitleStore, mabi.Store);

// ----------------------------------------------------------------------
// override

mabi.TitleStore.prototype.createElement = function(dto){
    var e = new mabi.TitleClass(
	{
	    id: dto.id,
	    name: dto.name,
	    effects: dto.effects
	});
    return e;
};

