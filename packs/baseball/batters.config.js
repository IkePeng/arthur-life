(function (c) {
  c.batters = [
    {id:"slugger",name:"強打者",contact:.105,patience:.015,fast:.045,homeRunAdjustment:.035,quotes:["外野手可以退到觀眾席了，這球會飛很遠。","球僮，準備拿一顆新球吧。","這座球場對我來說太小了。","你只要想好，球飛出去時要不要回頭看。"]},
    {id:"patient",name:"選球型",contact:-.01,patience:.105,quotes:["我不急，先看你敢不敢投好球。","投準一點，我可不想站在這裡揮空氣。","別浪費時間投壞球了。","捕手可以往前蹲一點，反正他的球沒尾勁。"]},
    {id:"fastball_hunter",name:"直球型",contact:.035,fast:.105,breaking:-.025,quotes:["你的直球怎麼像在倒帶？","再來一顆快的，剛才那顆還不夠。","測速再快，也得經過我的棒子。","把最好的直球拿出來，不然我連汗都流不到。"]},
    {id:"breaking_hunter",name:"變化球型",contact:.025,fast:-.02,breaking:.1,quotes:["剛才那顆是滑球，還是你滑倒了？","那顆變化球，我看得很清楚。","這就是你賭上一切的決勝球嗎？我收下了。","別以為低球能騙到我。"]},
    {id:"aggressive",name:"積極型",contact:-.045,patience:-.055,quotes:["來啊！第一顆就決勝負。","別躲了，把球投進來！","只要進來我就會出棒。","下一球，我會把它轟到大氣層外。"]},
    {id:"contact",name:"纏鬥型",contact:.04,patience:.035,foul:.09,quotes:["想三振我？你還得再投幾顆。","我會一直纏到你失投。","就憑這種半吊子的球，也想三振我？","別讓我太無聊，拿出真正的決勝球。"]},
    {id:"slump",name:"低潮型",contact:-.075,patience:.005,quotes:["手感不好，但打你應該夠了。","只要一支安打就能重新開始。","你的眼神在害怕啊，投手。","今天就拿你找回手感。"]}
  ];
  c.batterTrashTalk = {
    chance:.72,
    control:["你找不到好球帶嗎？","別躲了，把球投進來！","投準一點好嗎？","四壞也算你的本事嗎？"],
    strike:["就這樣而已嗎？","這顆只是讓你運氣好。","下一球我就抓到了。","別得意，勝負還沒結束。"],
    twoStrikes:["兩好球又怎樣？你還差最後一顆。","想三振我？太天真了！","來吧，讓我看看你的決勝球。","你的眼神在害怕啊，投手。"],
    foul:["我會一直纏到你失投。","差一點，下一球就是我的。","用球數快撐不住了吧？","你的決勝球我已經看懂了。"],
    hit:["我早就知道你會投這顆。","外野手站得還不夠遠。","就說了，這座球場太小。","下一次記得投遠一點。"],
    general:["來啊！","把你最好的球拿出來。","別讓我太無聊。","你只有這點本事嗎？"],
    byType:{
      slugger:["球僮，先準備下一顆球。","外野手可以再退十步。"],
      patient:["我有一整晚可以等你投好球。","急的是你，不是我。"],
      fastball_hunter:["再投直球，我保證讓它回不來。","你的直球已經沒有秘密了。"],
      breaking_hunter:["滑球再多轉一點，也許我才會揮空。","這種變化幅度騙不了我。"],
      aggressive:["不用配球，直接來！","下一顆就分勝負。"],
      contact:["你今天不可能三振我。","我會把你的用球數磨光。"],
      slump:["再差的手感，也打得到這種球。","就拿你當我的復健賽。"]
    }
  };
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
