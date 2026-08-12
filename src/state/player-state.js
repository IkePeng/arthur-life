(function () {
  const roll=r=>r.min+Math.floor(Math.random()*(r.max-r.min+1));
  window.V47PlayerState={
    create(name,character,chapterRounds){
      const stats={};Object.entries(character.initialStats).forEach(([k,r])=>stats[k]=roll(r));
      return {schemaVersion:47,name:name||"無名小將",position:"投手",bird:character.id,origin:character.id,chapter:0,stageYear:0,age:13,turn:0,lastAgingAge:13,chapterRounds,used:[],usedLifeEvents:[],pitches:[...character.startingPitches],special:[...character.startingAbilities],stats,fame:character.fame||0,money:character.money||0,fans:character.fans||12,timeline:[`出生背景：${character.name}`,"開始國中養成"],relationship:"single",phase:"event",statistics:{currentSeason:{},career:{},seasons:[]}};
    },
    migrate(raw){if(!raw)return raw;if(raw.schemaVersion===47)return raw;raw.schemaVersion=47;raw.statistics=raw.statistics||{currentSeason:{...(raw.seasonPitching||{})},career:{...(raw.careerPitching||{})},seasons:[]};raw.migratedFrom=raw.migratedFrom||46;return raw;}
  };
})();
