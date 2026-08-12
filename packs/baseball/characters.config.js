(function (c) {
  const base={power:{min:28,max:34},contact:{min:26,max:32},speed:{min:29,max:35},fielding:{min:21,max:28},spirit:{min:32,max:40},health:{min:68,max:78},luck:{min:32,max:40}};
  c.characters = [
    {id:"18",jersey:18,name:"資本雄厚",image:"assets/solid-bird-pitcher.webp?v=4",description:"家族資源雄厚 · 可取得直接合約 · 表現仍靠自己",initialStats:{...base,contact:{min:29,max:37},luck:{min:36,max:45}},money:3200,modifiers:{cost:.45},opportunityChapter:3,startingPitches:["四縫線直球"],startingAbilities:["菁英資源"]},
    {id:"21",jersey:21,name:"一招入魂",image:"assets/solid-bird-lefty-21.webp?v=4",description:"先天球威突出 · 正面壓制打者",initialStats:{...base,power:{min:49,max:57},speed:{min:38,max:46},contact:{min:21,max:27},fielding:{min:18,max:24},health:{min:64,max:72}},opportunityChapter:1,startingPitches:["四縫線直球","火球直球"],startingAbilities:["重球威壓"]},
    {id:"36",jersey:36,name:"天賦異稟",image:"assets/solid-bird-sidearm-36.webp?v=4",description:"先天掌握多種球路 · 球種養成較快",initialStats:{...base,fielding:{min:30,max:38},luck:{min:35,max:43}},modifiers:{training:1.25,cap:108},opportunityChapter:0,startingPitches:["四縫線直球","曲球","變速球","滑球"],startingAbilities:["天賦"]},
    {id:"99",jersey:99,name:"名門之後",image:"assets/solid-bird-closer-99.webp?v=4",description:"家族熟悉職業訓練 · 恢復與保養能力突出",initialStats:{...base,health:{min:88,max:99},contact:{min:29,max:37}},fame:10,fans:1800,modifiers:{scout:.1},opportunityChapter:2,startingPitches:["四縫線直球"],startingAbilities:["耐傷"]},
    {id:"55",jersey:55,name:"草莽野草",image:"assets/solid-bird-power-55.webp?v=4",description:"逆境中更能堅持 · 關鍵時刻不易動搖",initialStats:{...base,spirit:{min:56,max:66},health:{min:76,max:86},power:{min:31,max:38}},fans:900,modifiers:{adversity:1.28},opportunityChapter:1,startingPitches:["四縫線直球"],startingAbilities:["強心臟"]},
    {id:"77",jersey:77,name:"強運之子",image:"assets/solid-bird-calm-77.webp?v=4",description:"偶遇與關鍵判定更容易出現好結果",initialStats:{...base,luck:{min:62,max:72},spirit:{min:37,max:45}},modifiers:{luck:.12},opportunityChapter:3,startingPitches:["四縫線直球"],startingAbilities:["幸運星"]},
    {id:"88",jersey:88,name:"世故玩家",image:"assets/solid-bird-heavy-88.webp?v=4",description:"擅長談判與布局 · 能把人脈轉化為機會",initialStats:{...base,contact:{min:31,max:39},spirit:{min:36,max:44},luck:{min:48,max:58}},money:300,fame:7,fans:1200,modifiers:{business:1.55},opportunityChapter:3,startingPitches:["四縫線直球"],startingAbilities:["談判術"]}
  ];
})(window.V47_CONFIG);
