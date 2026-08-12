(function () {
  const empty=()=>({games:0,outs:0,runs:0,earnedRuns:0,hits:0,walks:0,strikeouts:0,wins:0,losses:0});
  const normalize=value=>Object.assign(empty(),value||{});
  function add(target,match,won){
    target.games++;
    ["outs","runs","earnedRuns","hits","walks","strikeouts"].forEach(k=>target[k]+=(match[k]||0));
    target[won?"wins":"losses"]++;
  }
  window.V47StatsLedger={
    ensure(state){
      state.statistics=state.statistics||{currentSeason:empty(),career:empty(),seasons:[]};
      state.statistics.currentSeason=normalize(state.statistics.currentSeason);
      state.statistics.career=normalize(state.statistics.career);
      state.statistics.seasons=Array.isArray(state.statistics.seasons)?state.statistics.seasons:[];
      return state.statistics;
    },
    recordMatch(state,match,won){
      const statistics=this.ensure(state);
      add(statistics.currentSeason,match,won);
      add(statistics.career,match,won);
    },
    closeSeason(state,meta={}){
      const statistics=this.ensure(state),season=statistics.currentSeason;
      if(!season.games)return;
      statistics.seasons.push({...season,...meta,era:season.outs?season.earnedRuns*27/season.outs:null});
      statistics.currentSeason=empty();
    }
  };
})();
