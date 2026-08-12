/*
  逸群的野球｜故事設定檔

  事件編號格式：章節-回合，例如 "4-1" 是第四章第一個故事。
  effects 可使用：
  power 球威、contact 控球、speed 球速、fielding 變化球、
  spirit 心志（隱藏）、health 健康（隱藏）、luck 運氣（隱藏）、fame 名聲、money 資金、fans 粉絲、
  pitch 獲得球種、careerPath 職業路線（mlb／npb／cpbl）。
  chance 是成功率，0.65 代表 65%；不填就是必定成功。

  只要把下方範例取消註解或新增事件，就能覆蓋遊戲原本故事。
*/
window.STORY_CONFIG = {
  chapterOverrides: {
    // 4: { name: "我的選秀之夜", place: "職業抉擇", age: 22 }
  },
  eventOverrides: {
    /*
    "4-1": {
      tag: "第四章 · 合約桌前",
      title: "三條職業道路",
      text: "請在這裡填入你想要的故事。",
      choices: [
        { text: "挑戰美國職棒", effects: { careerPath:"mlb", fame:5 }, result:"前往美國。", chance:0.65 },
        { text: "投入日本職棒", effects: { careerPath:"npb", contact:4 }, result:"前往日本。" },
        { text: "參加中華職棒選秀", effects: { careerPath:"cpbl", fans:3000 }, result:"留在台灣。" }
      ]
    }
    */
  },
  // 可新增自訂 15% 偶發人生事件；min 2 代表第三章以後才會出現。
  extraLifeEvents: [
    // { min:2, title:"自訂偶遇", text:"事件內容", choices:[{text:"選項",effects:{luck:3},result:"結果"}] }
  ],
  // 可覆蓋七個背景的專屬機緣，鍵值為球衣號碼 18、21、36、99、55、77、88。
  originOpportunityOverrides: {
    // "18": { title:"新的專屬機緣", text:"內容", choices:[{text:"選項",effects:{money:100},result:"結果"}] }
  }
};
