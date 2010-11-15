/**
 * Skill の管理を行う
 *
 * インタフェースは Store と同様である。
 * todo Store による実装に変更する
 */
mabi.SkillStore = function(){
    this.super_.constructor.call(this);
};

util.extend(mabi.SkillStore, mabi.Elements);

mabi.SkillStore.prototype.load = function(){
    var this_ = this;
    var src = [
	['アイスボルト', 'ICEBOLT',
	 ['magic', 'ice', 'bolt'],
	 [
	     [{param: 'damageMax', min: 80}]
	 ]],
	['ファイアボルト', 'FIREBOLT',
	 ['magic', 'fire', 'bolt', 'charge_bonus'],
	 [
	     [{param: 'damageMax', min: 120}]
	 ]],
	['ライトニングボルト', 'LIGHTNING_BOLT',
	 ['magic', 'lightning', 'bolt'],
	 [
	     [{param: 'damageMax', min: 150}]
	 ]],
	['ファイアボール', 'FIREBALL',
	 ['magic', 'fire'],
	 [
	     [{param: 'damageMax', min: 2400}]
	 ]],
	['アイススピア', 'ICE_SPEAR',
	 ['magic', 'ice', 'charge_bonus'],
	 [
	     [{param: 'damageMax', min: 240}]
	 ]],
	['サンダー', 'THUNDER',
	 ['magic', 'lightning'],
	 [
	     [{param: 'damageMax', min: 400}]
	 ]],

	['アイスマスタリ', 'MAGIC_ICE_MASTERY',
	 ['magic'],
	 [
	     [{param: 'ice_magic_damage', min: 0.15}]
	 ]],
	['ファイアマスタリ', 'MAGIC_FIRE_MASTERY',
	 ['magic'],
	 [
	     [{param: 'fire_magic_damage', min: 0.15}]
	 ]],
	['ライトニングマスタリ', 'MAGIC_LIGHTNING_MASTERY',
	 ['magic'],
	 [
	     [{param: 'lightning_magic_damage', min: 0.15}]
	 ]],
	['ボルトマスタリ', 'MAGIC_BOLT_MASTERY',
	 ['magic'],
	 [
	     [{param: 'bolt_magic_damage', min: 0.15}]
	 ]],
	['ボルト魔法の合体', 'BOLT_COMPOSER',
	 ['magic'],
	 [
	     [{param: 'fused_bolt_magic_damage', min: 0.15}]
	 ]],

        // 近接
        ['スマッシュ', 'SMASH',
	 ['melee'],
	 [
	     {damage: 5}
	 ]]
    ];
    $.each(src, function(i, v){
	var a = new mabi.SkillClass({
	    name: v[0],
	    flags: v[2],
	    ranks: v[3]
	});
	this_.push(a);
	this_[v[1]] = a;
    });

    return (new util.TimerCommand).execute();
};