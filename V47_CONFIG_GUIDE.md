# 《逸群的野球》v47 設定檔編輯指南

遊戲內容集中在 `packs/baseball/`。編輯後重新整理網頁即可測試，不需要改 `game.js`。

## 最常編輯的檔案

| 想改的內容 | 檔案 |
|---|---|
| 七個角色、能力值區間、圖片、先天球種與特殊能力 | `characters.config.js` |
| 八個生涯章節、年齡、場地與球場背景 | `chapters.config.js` |
| 32 個固定主線關卡 | `story-events.config.js` |
| 每年重複使用與幸運加開的養成事件 | `events.config.js` |
| 戀愛、婚姻、外遇、博士與七位角色專屬機緣 | `opportunities.config.js` |
| 球威、控球、球速、變化球及隱藏數值 | `stats.config.js` |
| 特殊能力的名稱與說明 | `abilities.config.js` |
| 球種說明、被打率、三振率與壞球率 | `pitches.config.js` |
| 打者類型、能力傾向與對白 | `batters.config.js` |
| 被打率上下限、球數差異、疲勞與換投門檻 | `match-balance.config.js` |
| 三好、四壞、三出局與九局制 | `baseball-rules.config.js` |
| 每年回合、技能點、30 歲後衰退與強制退休 | `progression.config.js` |
| 強化成功率範圍 | `training.config.js` |
| 中職、日職、美職的能力與球探評分門檻 | `scouting.config.js` |

## 寫一個關卡

主線與大部分機緣沿用下面格式：

```js
{
  icon: "⚾",
  tag: "第一章 · 夏季",
  title: "關卡標題",
  text: "玩家會看到的故事內容。",
  choices: [
    ["選項文字", {power: 4, health: -2}, "成功後的結果文字。", 0.65],
    ["另一個選項", {pitch: "滑球"}, "你學會了新的球種。"]
  ]
}
```

第四個數字是成功機率，可以省略；省略時必定套用效果。`health`、`spirit`、`luck` 仍會影響遊戲，但畫面不顯示。

常用效果：

- `power` 球威、`contact` 控球、`speed` 球速、`fielding` 變化球。
- `health` 健康、`spirit` 心志、`luck` 運氣，三者皆為隱藏數值。
- `pitch: "球種名稱"` 學會球種；名稱必須存在於 `pitches.config.js`。
- `ability: "特殊能力"` 取得能力；名稱應先放入 `abilities.config.js`。
- `fame`、`fans`、`money` 會影響球探與邀約，但不直接顯示給玩家。
- `careerPath` 可指定 `cpbl`、`npb`、`mlb` 或 `amateur`。
- `relationship` 可指定 `single`、`dating` 或 `married`。

## 調整角色能力

每位角色的 `initialStats` 都是隨機區間，例如：

```js
power: {min: 28, max: 34}
```

玩家取名後才會隨機抽到一位角色，再從每項區間各自抽出初始值。七位角色不能由玩家選擇。

## 安全檢查

啟動時驗證器會檢查角色、球種、特殊能力、章節、關卡選項與棒球基本規則。若設定寫錯，畫面頂部會直接顯示是哪一份資料與哪個欄位有問題，避免遊戲玩到中途才壞掉。
