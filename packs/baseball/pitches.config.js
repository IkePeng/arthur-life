(function (c) {
  const p=(id,name,family,description,hit,k,ball,ground,homeRun,extra={})=>({id,name,family,description,profile:{hitAdjustment:hit,strikeoutAdjustment:k,ballAdjustment:ball,groundBallAdjustment:ground,homeRunMultiplier:homeRun},...extra});
  c.pitches = [
    p("four_seam","四縫線直球","fastball","最容易投進好球帶；被咬中時飛球與長打風險較高。",.065,.018,-.04,-.08,1.18,{startingPitch:true}),
    p("fireball","火球直球","fastball","以強烈球威正面壓制，對身體負擔也較高。",.025,.07,.015,-.03,.82),
    p("two_seam","二縫線直球","fastball","帶有橫移與下沉，適合製造滾地球。",-.035,-.015,.035,.15,.78),
    p("cutter","切球","fastball","接近本壘前小幅橫移，能避開甜蜜點。",-.04,.015,.04,.08,.85),
    p("sinker","伸卡球","fastball","下沉軌跡大幅提高滾地球機率。",-.035,-.015,.035,.20,.70),
    p("power_sinker","高速伸卡球","fastball","保留球速的下沉球，兼具球威與滾地能力。",-.045,.005,.045,.22,.65),
    p("curve","曲球","breaking","大幅縱向變化，被打率低但較容易投成壞球。",-.055,.055,.075,.04,.78),
    p("slider","滑球","breaking","橫向急轉降低被打率，但控球難度較高。",-.055,.055,.075,.02,.76),
    p("reverse_slider","反向滑球","breaking","向反方向橫移，對特定打者特別有效。",-.06,.06,.085,.02,.72),
    p("changeup","變速球","offspeed","利用速差破壞打者節奏並減少強勁擊球。",-.06,.04,.065,.08,.72),
    p("lucky_changeup","幸運變速球","offspeed","難以預測的速差球，偶爾出現特別效果。",-.065,.05,.07,.10,.65),
    p("forkball","指叉球","breaking","在本壘前快速下墜，揮空與滾地率高但較難控制。",-.065,.075,.085,.16,.65),
    p("sff","SFF","breaking","較快速的指叉球，兼具下墜與速度。",-.06,.07,.08,.13,.68),
    p("revival_sinker","復活伸卡球","fastball","生涯後期重新開發的下沉球。",-.055,.025,.05,.20,.68),
    p("160_fireball","160km火球","fastball","頂級極速球，揮空率極高但風險與負荷也高。",-.045,.105,.045,-.03,.55)
  ];
  c.pitchLearning = {
    stat:"fielding",
    firstAt:50,
    every:10,
    lastAt:100,
    maxKnownPitches:10,
    choices:["二縫線直球","切球","伸卡球","高速伸卡球","曲球","滑球","反向滑球","變速球","指叉球","SFF"]
  };
})(window.V47_CONFIG);
