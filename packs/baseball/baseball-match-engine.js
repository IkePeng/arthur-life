(function () {
  function pitchProfile(config,pitch,stats){
    const pitchMap=Object.fromEntries((config.pitches||[]).map(x=>[x.name,x]));
    const fast=/直球|火球/.test(pitch),elite=/160km|火球入魂/.test(pitch),breaker=/曲球|滑球|指叉|SFF|變速|切球/.test(pitch);
    const quality=stats.power*.24+stats.speed*.27+stats.fielding*.29+(fast?stats.power*.1+stats.speed*.08:stats.fielding*.18)+stats.contact*.02;
    let hit=.49-quality*.00145,k=.075+quality*.0018,bb=.39-stats.contact*.0035;
    const profile=pitchMap[pitch]?.profile;
    if(profile){hit+=profile.hitAdjustment;k+=profile.strikeoutAdjustment;bb+=profile.ballAdjustment;}
    else if(elite){hit-=.035;k+=.105;bb+=.045;}else if(/指叉|SFF/.test(pitch)){hit-=.065;k+=.075;bb+=.085;}else if(/滑球|曲球/.test(pitch)){hit-=.055;k+=.055;bb+=.075;}else if(/變速/.test(pitch)){hit-=.06;k+=.04;bb+=.065;}else if(/伸卡|二縫線|切球/.test(pitch)){hit-=.035;k-=.015;bb+=.035;}else if(/四縫線/.test(pitch)){hit+=.085;k+=.018;bb-=.04;}else if(fast){hit+=.035;k+=.018;}
    return {quality,hit:Math.max(.21,Math.min(.56,hit)),k:Math.max(.07,Math.min(.44,k)),bb:Math.max(.14,Math.min(.46,bb)),breaker};
  }
  function liveRisk(config,pitch,batter,match,stats){
    const x=pitchProfile(config,pitch,stats),fast=/四縫線|直球|火球/.test(pitch),breaking=/曲球|滑球|指叉|SFF|變速|伸卡|切球/.test(pitch),balance=config.matchBalance||{};
    const fatigue=(match.inning-1)*(balance.fatigue?.perInning??.012)+(batter.batters-1)*(balance.fatigue?.perBatter??.003);
    const countCfg=balance.count||{},hittersCount=(batter.balls>=2&&batter.strikes<2?(countCfg.hittersCount??.045):0)+(batter.balls===3&&batter.strikes===1?(countCfg.threeOne??.035):0),pitchersCount=batter.strikes===2&&batter.balls<3?(countCfg.pitchersCount??-.055):0,fullCount=batter.balls===3&&batter.strikes===2?(countCfg.fullCount??.018):0,count=hittersCount+pitchersCount+fullCount;
    const matchup=fast?(batter.fast||0):breaking?(batter.breaking||0):0,hidden=(50-stats.spirit)/900-(stats.luck-35)/1300,healthPenalty=Math.max(0,(70-stats.health)/450);
    const hit=Math.max(balance.battingAverage?.min??.19,Math.min(balance.battingAverage?.max??.64,x.hit+batter.contact+(batter.dailyForm||0)+matchup+fatigue+count+hidden+healthPenalty));
    const situation=batter.balls===3&&batter.strikes===2?"滿球數":hittersCount?"打者有利球數":pitchersCount?"投手有利球數":"球數平衡";
    return {hit,ball:Math.max(balance.ballChance?.min??.14,Math.min(balance.ballChance?.max??.66,x.bb+(batter.patience||0)+(breaking?.08:fast?-.015:0)+fatigue+healthPenalty+(batter.balls===3?.055:0))),miss:x.k-(batter.contact||0)*.35,note:situation};
  }
  function createBatter(config,random,previous={}){
    const types=config.batters||[],type=types[Math.floor(random()*types.length)],dailyForm=(random()-.5)*.08;
    if(!type)throw new Error("batters.config.js：沒有可用的打者類型");
    return {balls:0,strikes:0,outs:previous.outs||0,runners:previous.runners||[false,false,false],inherited:previous.inherited||[false,false,false],runs:previous.runs||0,earnedRuns:previous.earnedRuns||0,hits:previous.hits||0,walks:previous.walks||0,ks:previous.ks||0,errors:previous.errors||0,batters:(previous.batters||0)+1,pitches:previous.pitches||0,dailyForm,...type,quote:type.quotes[Math.floor(random()*type.quotes.length)]};
  }
  window.V47BaseballMatchEngine={pitchProfile,liveRisk,createBatter};
})();
