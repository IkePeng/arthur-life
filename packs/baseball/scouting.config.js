(function (c) {
  c.scouting = {
    evaluateChapterId:"draft",
    leagues:[
      {id:"cpbl",name:"中華職棒",minOverallGrade:"B",baseThreshold:47,yearDiscount:1.7,offerText:"投入中華職棒選秀",signingBonus:{currency:"TWD",unit:"萬元",bands:{B:[100,300],A:[300,450],S:[450,570],SS:[520,650]}},score:[{source:"overall",weight:.62},{source:"fame",weight:.5},{source:"logFans",weight:4},{source:"money",weight:.002,max:6},{source:"hiddenLuck",weight:1},{source:"performance",weight:1}],effects:{careerPath:"cpbl",fame:6,fans:3500},result:"綜合評價與實戰報告通過審核，國內球隊把你列入選秀名單。"},
      {id:"npb",name:"日本職棒",minOverallGrade:"A",baseThreshold:53,yearDiscount:2,offerText:"接受日本職棒球團邀請",signingBonus:{currency:"JPY",twdRate:.1968,unit:"萬元",bands:{A:[590,1200],S:[1200,1970],SS:[1970,2950]}},score:[{source:"contact",weight:.3},{source:"fielding",weight:.28},{source:"speed",weight:.12},{source:"health",weight:.08},{source:"fame",weight:.38},{source:"pitchCount",weight:2.2},{source:"hiddenLuck",weight:1},{source:"performance",weight:1}],effects:{careerPath:"npb",contact:4,fielding:4},result:"球團看中你的完成度，邀請你進入二軍養成體系。"},
      {id:"mlb",name:"美國職棒",minOverallGrade:"S",baseThreshold:58,yearDiscount:2.2,offerText:"接受美國職棒球團邀請",signingBonus:{currency:"USD",twdRate:31.9,unit:"萬元",bands:{S:[3200,18000],SS:[18000,29500]}},score:[{source:"power",weight:.25},{source:"speed",weight:.3},{source:"fielding",weight:.2},{source:"contact",weight:.08},{source:"fame",weight:.45},{source:"logFans",weight:3},{source:"hiddenLuck",weight:1},{source:"performance",weight:1}],effects:{careerPath:"mlb",fame:5,spirit:4},result:"實戰報告通過審核，你從發展聯盟開始旅外生涯。"}
    ]
  };
})(window.V47_CONFIG);
