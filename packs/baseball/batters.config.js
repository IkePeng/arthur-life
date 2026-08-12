(function (c) {
  c.batters = [
    {id:"slugger",name:"強打者",contact:.105,patience:.015,fast:.045,homeRunAdjustment:.035,quotes:["別躲了，丟進來吧。","這球我一定要送出去。","投進來，我在等你的直球。"]},
    {id:"patient",name:"選球型",contact:-.01,patience:.105,quotes:["我不急，先看你敢不敢投好球。","壞球我一顆都不追。","滿球數也沒關係，我比你更有耐心。"]},
    {id:"fastball_hunter",name:"直球型",contact:.035,fast:.105,breaking:-.025,quotes:["你的直球，我已經抓到節奏了。","再來一顆快的。","測速再快，也得經過我的棒子。"]},
    {id:"breaking_hunter",name:"變化球型",contact:.025,fast:-.02,breaking:.1,quotes:["那顆變化球，我看得很清楚。","別以為低球能騙到我。","我就在等你最有自信的球。"]},
    {id:"aggressive",name:"積極型",contact:-.045,patience:-.055,quotes:["第一顆就來決勝負吧。","不用試探，我準備好了。","只要進來我就會出棒。"]},
    {id:"contact",name:"纏鬥型",contact:.04,patience:.035,foul:.09,quotes:["想三振我？你還得再投幾顆。","我會一直纏到你失投。","上一球沒抓到，下一球不會了。"]},
    {id:"slump",name:"低潮型",contact:-.075,patience:.005,quotes:["手感不好，但我不能退。","只要一支安打就能重新開始。","隊友都回來了，現在輪到我。"]}
  ];
  c.lineupProfiles = [
    {spot:1,role:"開路先鋒",contactAdjustment:.018,patienceAdjustment:.015,homeRunChance:.035,preferredTypes:["contact","patient","aggressive"]},
    {spot:2,role:"推進型打者",contactAdjustment:.006,patienceAdjustment:.020,homeRunChance:.025,preferredTypes:["contact","patient"]},
    {spot:3,role:"最強巧打者",contactAdjustment:.045,patienceAdjustment:.010,homeRunChance:.110,preferredTypes:["contact","fastball_hunter","slugger"]},
    {spot:4,role:"四棒主砲",contactAdjustment:.035,patienceAdjustment:.005,homeRunChance:.220,preferredTypes:["slugger","fastball_hunter"]},
    {spot:5,role:"中心打線",contactAdjustment:.025,patienceAdjustment:0,homeRunChance:.160,preferredTypes:["slugger","breaking_hunter"]},
    {spot:6,role:"長打伏兵",contactAdjustment:0,patienceAdjustment:-.005,homeRunChance:.110,preferredTypes:["aggressive","slugger"]},
    {spot:7,role:"下位打線",contactAdjustment:-.015,patienceAdjustment:0,homeRunChance:.070,preferredTypes:["aggressive","slump"]},
    {spot:8,role:"守備型打者",contactAdjustment:-.040,patienceAdjustment:.005,homeRunChance:.040,preferredTypes:["slump","patient"]},
    {spot:9,role:"第二開路",contactAdjustment:-.035,patienceAdjustment:.012,homeRunChance:.025,preferredTypes:["contact","patient","slump"]}
  ];
})(window.V47_CONFIG);
