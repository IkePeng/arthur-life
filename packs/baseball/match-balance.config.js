(function (c) {
  c.matchBalance = {
    battingAverage:{min:.19,max:.64},
    ballChance:{min:.05,max:.85},
    controlToStrikeRate:{intercept:.10,perPoint:.01,min:.10,max:.99},
    attributeInfluence:{
      speedToContact:{base:.56,perPoint:-.0024},
      movementToContact:{breakingPerPoint:-.0012},
      powerToHitOnContact:{base:.50,perPoint:-.0027,min:.20,max:.52},
      powerToGroundBall:{base:.30,perPoint:.002,min:.18,max:.78},
      powerToHomeRun:{baseMultiplier:1.25,perPoint:-.006,minMultiplier:.45,maxMultiplier:1.20}
    },
    fatigue:{perInning:.012,perBatter:.003},
    count:{hittersCount:.045,threeOne:.035,pitchersCount:-.055,fullCount:.018},
    hook:{hits:3,runs:3,walks:3,trouble:5,baseChance:.30}
  };
})(window.V47_CONFIG);
