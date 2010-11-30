describe('Effect', function(){
    var subject;

});

// 
// condition: 以下のいずれかの形式
// 
// lv >=
// exploration_lv >=
// age >=
// 
// title =
// support_race =(種族・種族支持)
// 
// skill "スキル和名" >=
// 
// = deadly(デッドリー状態の場合)
// = potion_poisoned(ポーション中毒の場合)
// = poisoned(毒に侵された場合)
// = protective_wall(防護壁を召還中の時)
// = golem(ゴーレムを使役中の時)
// op: +
// 
// ----
// param(効果対象):
// 
// Statusの各項目
// repair_cost
// 
// ----
// min がマイナス、 max がプラスというケースを表現するため、 op は + のみとする。

