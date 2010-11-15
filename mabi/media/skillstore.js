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
	 ['ice', 'bolt'],
	 [
	     [{param: 'damage_max', min: 80}]
	 ]],
	['ファイアボルト', 'FIREBOLT',
	 ['fire', 'bolt', 'charge_bonus'],
	 [
	     [{param: 'damage_max', min: 120}]
	 ]],
	['ライトニングボルト', 'LIGHTNING_BOLT',
	 ['lightning', 'bolt'],
	 [
	     [{param: 'damage_max', min: 150}]
	 ]],
	['ファイアボール', 'FIREBALL',
	 ['fire'],
	 [
	     [{param: 'damage_max', min: 2400}]
	 ]],
	['アイススピア', 'ICE_SPEAR',
	 ['ice', 'charge_bonus'],
	 [
	     [{param: 'damage_max', min: 240}]
	 ]],
	['サンダー', 'THUNDER',
	 ['lightning'],
	 [
	     [{param: 'damage_max', min: 400}]
	 ]],

	['アイスマスタリ', 'MAGIC_ICE_MASTERY',
	 [],
	 [
	     [{param: 'ice_magic_damage', min: 0.15}]
	 ]],
	['ファイアマスタリ', 'MAGIC_FIRE_MASTERY',
	 [],
	 [
	     [{param: 'fire_magic_damage', min: 0.15}]
	 ]],
	['ライトニングマスタリ', 'MAGIC_LIGHTNING_MASTERY',
	 [],
	 [
	     [{param: 'lightning_magic_damage', min: 0.15}]
	 ]],
	['ボルトマスタリ', 'MAGIC_BOLT_MASTERY',
	 [],
	 [
	     [{param: 'bolt_magic_damage', min: 0.15}]
	 ]],
	['ボルト魔法の合体', 'BOLT_COMPOSER',
	 [],
	 [
	     [{param: 'fused_bolt_magic_damage', min: 0.15}]
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