// 作成中

describe("組み込み装備", function() {
    function equipment(name){
        return dam.equipments.find(name);
    }
    
    function es(name){
        var a = dam.enchants.find({name: name});
        if(!a) throw 'error' + name;
    }
    
    beforeEach(function() {
        
    });

    it('代表的な装備とエンチャントの組み合わせを作成できる/できない', function(){
        expect(equipment('万能鍋').canEnchant(es('料理人の'))).toBeTruthy();
        expect(equipment('万能鍋').canEnchant(es('深海の'))).toBeTruthy();
        expect(equipment('万能鍋').canEnchant(es('ハード'))).toBeFalsy();
    });
});


// 特徴的なエンチャント
// マイト: 斧、鈍器
// ハーモニー: 管楽器や弦楽器
// スイート: 武器と楽器
// タイタニック: 両手斧
// 茹でた: コックの帽子
// 光る: 靴
// ストライダー: 金属製のブーツ
// 野菜: 巨大な料理道具
// おいしい: 巨大クッキングナイフ, 巨大おたま
// ほろ苦い: 巨大生地用麺棒
// 料理人の: 料理用道具

// OK 料理人の 万能鍋
// OK 深海の 万能鍋
// OK レイヴンサマナー 裁縫キット(右手 or 両手に貼れるみたい)
// NG 精密な 裁縫キット


    
/*
 * エンチャント可能・不可のテストを行う
 */


// 釣竿
// スマッシュの両手剣補正はない
// OK 武器ES
// OK デッドリー(両手)
// NG マングース(両手) OK になってそう
// NG フェネック(両手) => OK になった？
// OK 黄玉(鉄)
// OK 精密な(武器)

// Lロッド
// NG デバイド

// ツルハシ
// OK デバイド

// 楽器
// NG 武器

// ウッドプレートキャノン
// OK ウッドニードル
// グローブ
// NG 平和
// NG 害
// OK ハード(鉄)

// キルステン
// OK ハード(鉄)

// ボーンマリン(鎧以外)
// OK ハード

// ボーンマリン(鎧)
// NG ハード

// 弓
// ウッドニードル

// 裁縫キット
// OK レイヴンサマナー(右手・両手)
// NG 精密な(武器)

// 楽器
// OK レイヴンサマナー

// キッチンナイフ
// OK レイヴンサマナー

// 万能おたま
// OK レイヴンサマナー


// ガーディアングローブ
// OK 銀キツネ(鉄)
// OK 豊富な(手袋)

// コレス忍者グローブ
// OK 銀キツネ(鉄)
// OK 豊富な

// 同じ武器のみの「」は裁縫キットには貼り付けられない。 同じ「武器にエンチャント可能」の表記でも「Weapon(武器)」と「右手でもてるもの」の2種類があるようですね。釣竿はまた特殊みたいだけど(精密なが貼り付けられる)。

// ショートボウに木の針は貼れる?
// Wiki には貼れないと書いてあるが
// ググルと 木の針 ショートボウがでてくる

// 鋼鉄針、ウッドプレートキャノンに貼れるんじゃない?

// 手袋

