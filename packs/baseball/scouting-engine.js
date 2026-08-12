(function () {
  function context(state){
    const s=state.stats,career=state.careerPitching||{outs:0,runs:0,strikeouts:0,walks:0},careerEra=career.outs?career.runs*27/career.outs:9.99;
    return {...s,overall:(s.power+s.contact+s.speed+s.fielding)/4,fame:state.fame,logFans:Math.log10(state.fans+10),money:state.money,pitchCount:state.pitches.length,hiddenLuck:(s.luck-35)*.22,performance:Math.max(-7,8-careerEra)+Math.min(8,(career.strikeouts-career.walks)*.25)};
  }
  function score(league,sources){return (league.score||[]).reduce((sum,t)=>sum+Math.min(t.max??Infinity,(sources[t.source]||0)*t.weight),0);}
  function grade(config,value){return (config.ratings?.grades||[]).find(x=>value>=x.min)?.id||"E";}
  function qualifies(config,current,required){const order=(config.ratings?.grades||[]).map(x=>x.id);return order.indexOf(current)<=order.indexOf(required);}
  function evaluate(config,state,year){
    const sources=context(state),overall=Math.round(sources.overall),overallGrade=grade(config,overall);
    const offers=(config.scouting?.leagues||[]).filter(league=>qualifies(config,overallGrade,league.minOverallGrade)&&score(league,sources)>=league.baseThreshold-year*league.yearDiscount);
    const leagues=config.scouting?.leagues||[],next=leagues.find(x=>!qualifies(config,overallGrade,x.minOverallGrade));
    const reached=leagues.filter(x=>qualifies(config,overallGrade,x.minOverallGrade));
    const targetText=next?`${reached.length?`已達 ${reached.at(-1).name} 的 ${reached.at(-1).minOverallGrade} 級門檻；`:`尚未達第一個職業門檻；`}下一個目標是 ${next.name} ${next.minOverallGrade} 級`:`所有職業聯盟的評價門檻都已達成`;
    return {overall,overallGrade,offers,targetText};
  }
  window.V47ScoutingEngine={evaluate};
})();
