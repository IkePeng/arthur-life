(function () {
  function pitchProfile(config,pitch,stats){
    const pitchMap=Object.fromEntries((config.pitches||[]).map(x=>[x.name,x]));
    const fast=/直球|火球/.test(pitch),elite=/160km|火球入魂/.test(pitch),breaker=/曲球|滑球|指叉|SFF|變速|切球/.test(pitch);
    const influence=config.matchBalance?.attributeInfluence||{},speedRule=influence.speedToContact||{base:.56,perPoint:-.0024},moveRule=influence.movementToContact||{breakingPerPoint:-.0012};
    const quality=stats.power*.24+stats.speed*.27+stats.fielding*.29+(fast?stats.power*.1+stats.speed*.08:stats.fielding*.18)+stats.contact*.02;
    let hit=(speedRule.base??.56)+stats.speed*(speedRule.perPoint??-.0024)+(breaker?stats.fielding*(moveRule.breakingPerPoint??-.0012):0),k=.075+quality*.0018,ballAdjustment=0,groundBallAdjustment=0,homeRunMultiplier=1;
    const profile=pitchMap[pitch]?.profile;
    if(profile){hit+=profile.hitAdjustment;k+=profile.strikeoutAdjustment;ballAdjustment=profile.ballAdjustment||0;groundBallAdjustment=profile.groundBallAdjustment||0;homeRunMultiplier=profile.homeRunMultiplier??1;}
    else if(elite){hit-=.035;k+=.105;ballAdjustment=.045;}else if(/指叉|SFF/.test(pitch)){hit-=.065;k+=.075;ballAdjustment=.085;}else if(/滑球|曲球/.test(pitch)){hit-=.055;k+=.055;ballAdjustment=.075;}else if(/變速/.test(pitch)){hit-=.06;k+=.04;ballAdjustment=.065;}else if(/伸卡|二縫線|切球/.test(pitch)){hit-=.035;k-=.015;ballAdjustment=.035;}else if(/四縫線/.test(pitch)){hit+=.085;k+=.018;ballAdjustment=-.04;}else if(fast){hit+=.035;k+=.018;}
    return {quality,hit:Math.max(.21,Math.min(.56,hit)),k:Math.max(.07,Math.min(.44,k)),ballAdjustment,groundBallAdjustment,homeRunMultiplier,breaker};
  }
  function controlStrikeRate(config,control){const rule=config.matchBalance?.controlToStrikeRate||{intercept:.10,perPoint:.01,min:.10,max:.99};return Math.max(rule.min??.10,Math.min(rule.max??.99,(rule.intercept??.10)+control*(rule.perPoint??.01)));}
  function liveRisk(config,pitch,batter,match,stats){
    const x=pitchProfile(config,pitch,stats),fast=/四縫線|直球|火球/.test(pitch),breaking=/曲球|滑球|指叉|SFF|變速|伸卡|切球/.test(pitch),balance=config.matchBalance||{};
    const fatigue=(match.inning-1)*(balance.fatigue?.perInning??.012)+(batter.batters-1)*(balance.fatigue?.perBatter??.003);
    const countCfg=balance.count||{},hittersCount=(batter.balls>=2&&batter.strikes<2?(countCfg.hittersCount??.045):0)+(batter.balls===3&&batter.strikes===1?(countCfg.threeOne??.035):0),pitchersCount=batter.strikes===2&&batter.balls<3?(countCfg.pitchersCount??-.055):0,fullCount=batter.balls===3&&batter.strikes===2?(countCfg.fullCount??.018):0,count=hittersCount+pitchersCount+fullCount;
    const matchup=fast?(batter.fast||0):breaking?(batter.breaking||0):0,hidden=(50-stats.spirit)/900-(stats.luck-35)/1300,healthPenalty=Math.max(0,(70-stats.health)/450);
    const hit=Math.max(balance.battingAverage?.min??.19,Math.min(balance.battingAverage?.max??.64,x.hit+batter.contact+(batter.dailyForm||0)+matchup+fatigue+count+hidden+healthPenalty));
    const powerHit=balance.attributeInfluence?.powerToHitOnContact||{},powerGround=balance.attributeInfluence?.powerToGroundBall||{},powerHr=balance.attributeInfluence?.powerToHomeRun||{};
    const hitOnContact=Math.max(powerHit.min??.20,Math.min(powerHit.max??.52,(powerHit.base??.50)+stats.power*(powerHit.perPoint??-.0027)));
    const ground=Math.max(powerGround.min??.18,Math.min(powerGround.max??.78,(powerGround.base??.30)+stats.power*(powerGround.perPoint??.002)+x.groundBallAdjustment));
    const hrMultiplier=Math.max(powerHr.minMultiplier??.45,Math.min(powerHr.maxMultiplier??1.20,(powerHr.baseMultiplier??1.25)+stats.power*(powerHr.perPoint??-.006)))*x.homeRunMultiplier;
    const homeRun=Math.max(.005,Math.min(.30,(batter.homeRunChance??.08)*hrMultiplier));
    const countSituation=batter.balls===3&&batter.strikes===2?"滿球數":hittersCount?"打者有利球數":pitchersCount?"投手有利球數":"球數平衡",situation=batter.lineupRole?`第 ${batter.lineupSpot} 棒 ${batter.lineupRole} · ${countSituation}`:countSituation;
    const baseBallChance=1-controlStrikeRate(config,stats.contact),protectZone=batter.balls===3?-.04:0;
    return {hit,hitOnContact,ground,homeRun,ball:Math.max(balance.ballChance?.min??.05,Math.min(balance.ballChance?.max??.85,baseBallChance+x.ballAdjustment+fatigue+healthPenalty+protectZone)),miss:x.k-(batter.contact||0)*.35,note:situation};
  }
  function createBatter(config,random,previous={}){
    const types=config.batters||[],batterNumber=(previous.batters||0)+1,lineupSpot=((batterNumber-1)%9)+1,lineup=(config.lineupProfiles||[]).find(x=>x.spot===lineupSpot),preferred=(lineup?.preferredTypes||[]).map(id=>types.find(x=>x.id===id)).filter(Boolean),type=preferred.length&&random()<.65?preferred[Math.floor(random()*preferred.length)]:types[Math.floor(random()*types.length)],dailyForm=(random()-.5)*.08;
    if(!type)throw new Error("batters.config.js：沒有可用的打者類型");
    return {...type,balls:0,strikes:0,outs:previous.outs||0,runners:previous.runners||[false,false,false],inherited:previous.inherited||[false,false,false],runs:previous.runs||0,earnedRuns:previous.earnedRuns||0,hits:previous.hits||0,walks:previous.walks||0,ks:previous.ks||0,errors:previous.errors||0,batters:batterNumber,pitches:previous.pitches||0,dailyForm,lineupSpot,lineupRole:lineup?.role||`${lineupSpot} 棒`,contact:(type.contact||0)+(lineup?.contactAdjustment||0),patience:(type.patience||0)+(lineup?.patienceAdjustment||0),homeRunChance:Math.max(.01,Math.min(.32,(lineup?.homeRunChance??.08)+(type.homeRunAdjustment||0))),quote:type.quotes[Math.floor(random()*type.quotes.length)]};
  }
  window.V47BaseballMatchEngine={pitchProfile,liveRisk,createBatter,controlStrikeRate};
})();
