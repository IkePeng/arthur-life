(function (c) {
  c.abilities = [
    {id:"菁英資源",name:"菁英資源",category:"origin",description:"高級訓練與私人資源降低訓練負擔。"},
    {id:"重球威壓",name:"重球威壓",category:"origin",description:"天生球威更強，正面對決更有壓制力。"},
    {id:"天賦",name:"天賦",category:"origin",description:"能力上限較高，較容易學會多種球路。"},
    {id:"耐傷",name:"耐傷",category:"origin",description:"恢復與保養能力較好，降低嚴重傷勢風險。"},
    {id:"強心臟",name:"強心臟",category:"origin",description:"危機時更穩定，也較不容易被教練提前換下。"},
    {id:"幸運星",name:"幸運星",category:"origin",description:"偶發機緣與重要判定更容易得到好結果。"},
    {id:"談判術",name:"談判術",category:"origin",description:"擅長利用人脈、合約與公關創造機會。"},
    {id:"一球入魂",name:"一球入魂",category:"pitching",hiddenUntilUnlocked:true,description:"連續投 200 顆四縫線直球後覺醒；兩好球後投四縫線必定三振。",unlock:{counter:"fourSeamStreak",pitch:"四縫線直球",atLeast:200},trigger:"BEFORE_PITCH_RESULT"},
    {id:"王建民",name:"王建民",category:"pitching",hiddenUntilUnlocked:true,description:"連續投 10 顆伸卡球後覺醒；伸卡球被打進場內時，一定轉化為滾地出局。",unlock:{counter:"sinkerStreak",pitch:"伸卡球",atLeast:10},trigger:"ON_BALL_IN_PLAY"},
    {id:"大谷翔平",name:"大谷翔平",category:"pitching",hiddenUntilUnlocked:true,description:"生涯累計投 50 顆滑球後覺醒；面對每位新打者時，第一球若選擇滑球必定是好球。",unlock:{counter:"sliderPitchCount",pitch:"滑球",atLeast:50},trigger:"BEFORE_PITCH_RESULT"}
  ];
})(window.V47_CONFIG);
