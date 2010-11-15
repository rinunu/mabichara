
/**
 * flags は以下の値の組み合わせ
 * - 装備種別: 1つだけもつ
 *   - weapon
 *     - edged(刀剣)
 *     - axe(斧)
 *     - blunt(鈍器)
 *     - knuckle
 *     - rangedWeapon
 *       - crossbow
 *     - wand
 *     - cylinder
 *     - staff
 *   - shield(鍋・簡易テーブル含む)
 *   - head
 *     - headgear(帽子)
 *       - cookcap
 *     - helmet
 *   - hand
 *     - glove(手袋)
 *     - gauntlet(鉄扱い?)
 *   - foot
 *     - shoes
 *     - armorboots(鉄扱い?)
 *   - clothing
 *     - clothing
 *     - magicalClothing
 *   - armor
 *     - lightArmor
 *     - heavyArmor
 *   - accessory
 *   - robe
 *   - cooking
 *     - ?(キッチンナイフ)
 *     - ?(万能おたま)
 *   - ?(裁縫キット)
 *   - instrument(楽器)
 *     - percussion?(打楽器)
 *     - wind(管楽器)
 *     - string(弦楽器 ウクレレ等)
 *
 * - サブ種別
 *   - twohand
 *
 * - 属性: 複数指定可能(ウッドプレートキャノンなど)
 *   - steel
 *   - leather
 *   - wood
 * 
 * ※flags は ES の貼りつけ部位から決定した
 * http://mabinogi.wikiwiki.jp/index.php?%A5%A8%A5%F3%A5%C1%A5%E3%A5%F3%A5%C8#b71dfa3f
 *
 */
describe('Equipment', function() {
    it('装備種別を取得できる', function(){
        var equipment = new mabi.EquipmentClass({flags: ['weapon']}).create();
        expect(equipment.is('weapon')).toBeTruthy();
        expect(equipment.is('foo')).toBeFalsy();
    });
});
