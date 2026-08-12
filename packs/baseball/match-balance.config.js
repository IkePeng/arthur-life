(function (c) {
  c.matchBalance = {
    battingAverage:{min:.19,max:.64},
    ballChance:{min:.05,max:.85},
    controlToStrikeRate:{intercept:.10,perPoint:.01,min:.10,max:.99},
    fatigue:{perInning:.012,perBatter:.003},
    count:{hittersCount:.045,threeOne:.035,pitchersCount:-.055,fullCount:.018},
    hook:{hits:3,runs:3,walks:3,trouble:5,baseChance:.30}
  };
})(window.V47_CONFIG);
