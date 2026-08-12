(function (c) {
  c.scouting = {
    evaluateChapterId:"draft",
    leagues:[
      {id:"cpbl",name:"中華職棒",anyStatAtLeast:70,baseThreshold:47,yearDiscount:1.7,offerText:"投入中華職棒選秀",score:[{source:"overall",weight:.62},{source:"fame",weight:.5},{source:"logFans",weight:4},{source:"money",weight:.002,max:6},{source:"hiddenLuck",weight:1},{source:"performance",weight:1}],effects:{careerPath:"cpbl",money:420,fame:6,fans:3500},result:"能力與實戰報告達標，國內球隊把你列入選秀名單。"},
      {id:"npb",name:"日本職棒",anyStatAtLeast:80,baseThreshold:53,yearDiscount:2,offerText:"接受日本職棒球團邀請",score:[{source:"contact",weight:.3},{source:"fielding",weight:.28},{source:"speed",weight:.12},{source:"health",weight:.08},{source:"fame",weight:.38},{source:"pitchCount",weight:2.2},{source:"hiddenLuck",weight:1},{source:"performance",weight:1}],effects:{careerPath:"npb",money:520,contact:4,fielding:4},result:"球團看中你的完成度，邀請你進入二軍養成體系。"},
      {id:"mlb",name:"美國職棒",anyStatAtLeast:90,baseThreshold:58,yearDiscount:2.2,offerText:"接受美國職棒球團邀請",score:[{source:"power",weight:.25},{source:"speed",weight:.3},{source:"fielding",weight:.2},{source:"contact",weight:.08},{source:"fame",weight:.45},{source:"logFans",weight:3},{source:"hiddenLuck",weight:1},{source:"performance",weight:1}],effects:{careerPath:"mlb",money:650,fame:5,spirit:4},result:"實戰報告通過審核，你從發展聯盟開始旅外生涯。"}
    ]
  };
})(window.V47_CONFIG);
