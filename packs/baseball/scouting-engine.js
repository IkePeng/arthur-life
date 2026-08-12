(function () {
  function context(state){
    const s=state.stats,career=state.careerPitching||{outs:0,runs:0,strikeouts:0,walks:0},careerEra=career.outs?career.runs*27/career.outs:9.99;
    return {...s,overall:(s.power+s.contact+s.speed+s.fielding)/4,fame:state.fame,logFans:Math.log10(state.fans+10),money:state.money,pitchCount:state.pitches.length,hiddenLuck:(s.luck-35)*.22,performance:Math.max(-7,8-careerEra)+Math.min(8,(career.strikeouts-career.walks)*.25)};
  }
  function score(league,sources){return (league.score||[]).reduce((sum,t)=>sum+Math.min(t.max??Infinity,(sources[t.source]||0)*t.weight),0);}
  function evaluate(config,state,year){
    const sources=context(state),bestAbility=Math.max(state.stats.power,state.stats.contact,state.stats.speed,state.stats.fielding);
    const offers=(config.scouting?.leagues||[]).filter(league=>bestAbility>=league.anyStatAtLeast&&score(league,sources)>=league.baseThreshold-year*league.yearDiscount);
    const leagues=[...(config.scouting?.leagues||[])].sort((a,b)=>a.anyStatAtLeast-b.anyStatAtLeast),next=leagues.find(x=>bestAbility<x.anyStatAtLeast);
    const targetText=next?`${leagues.some(x=>bestAbility>=x.anyStatAtLeast)?`已達 ${leagues.filter(x=>bestAbility>=x.anyStatAtLeast).at(-1).name} 門檻；`:`尚未達第一個職業門檻；`}距離 ${next.name} 還差 ${next.anyStatAtLeast-bestAbility} 點`:`所有職業聯盟的能力門檻都已達成`;
    return {bestAbility,offers,targetText};
  }
  window.V47ScoutingEngine={evaluate};
})();
