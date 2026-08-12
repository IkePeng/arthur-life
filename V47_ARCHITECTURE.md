# 《逸群的野球》v47 軟體架構規格

狀態：v47 已實作並接入遊戲；內容與數值可由 `packs/baseball/` 設定檔持續擴充。

## 1. v47 的核心目標

1. 保留目前已滿意的畫面、版型、圖片與手機體驗。
2. 角色、章節、機緣、能力、球種、對戰平衡與球探條件皆由設定檔調整。
3. 遊戲流程集中由單一 Flow Controller 管理，不讓畫面或事件自行跳頁。
4. 玩家狀態、單季成績、生涯成績與歷史紀錄集中保存。
5. 棒球規則與人生養成分離；未來可替換成籃球、賽車、演藝圈等主題包。
6. 所有設定在遊戲啟動時驗證；錯誤要指出檔名、資料 ID 與欄位。

## 2. 三層架構

```text
┌─────────────────────────────────────────────┐
│ Presentation｜目前滿意的畫面                │
│ index.html / styles.css / assets / renderers │
└──────────────────┬──────────────────────────┘
                   │ 使用統一 ViewModel，不碰規則
┌──────────────────▼──────────────────────────┐
│ Core Engine｜與棒球無關                     │
│ Flow / Event / Effect / State / RNG / Save  │
└──────────────────┬──────────────────────────┘
                   │ 載入一個主題包
┌──────────────────▼──────────────────────────┐
│ Baseball Pack｜棒球內容與規則               │
│ 角色 / 關卡 / 機緣 / 球種 / 比賽 / 球探     │
└─────────────────────────────────────────────┘
```

原則：

- 畫面只負責顯示與傳送玩家操作。
- Core Engine 不知道「三振、選秀、中職」是什麼。
- Baseball Pack 不直接操作 HTML，也不直接存檔。
- 設定檔不寫自由 JavaScript 函式，只能使用已登記的條件與效果指令。

## 3. 建議目錄

```text
index.html
styles.css
assets/                         # 保留目前圖片

src/
  app.js                        # 啟動、載入設定、組裝模組
  core/
    flow-controller.js          # 唯一流程調度入口
    state-machine.js            # 階段轉移與合法性檢查
    event-engine.js             # 挑選關卡、機緣、冷卻、只發生一次
    condition-engine.js         # 解析 when 條件
    effect-engine.js            # 執行加點、受傷、獲得能力等效果
    rng.js                      # 全部機率的唯一亂數入口
    clock.js                    # 年齡、學年、球季、回合
    config-validator.js         # 啟動時檢查所有設定
  state/
    player-state.js             # 玩家目前狀態
    stats-ledger.js             # 單場、單季、生涯累積
    save-repository.js          # 存檔介面
    local-save-repository.js    # 手機本機存檔實作
    migrations.js               # v46 → v47 舊存檔轉換
  domain/
    match-engine-interface.js   # 各種主題對戰的共同介面
  ui/
    view-model.js               # 將狀態整理成畫面資料
    screen-router.js            # 決定顯示哪張卡片
    render-start.js
    render-event.js
    render-match.js
    render-skills.js
    render-ending.js

packs/
  baseball/
    manifest.config.js          # 主題名稱、版本、採用的設定檔
    stats.config.js             # 球威、控球、球速等基礎能力定義
    characters.config.js        # 7 個角色與初始範圍
    chapters.config.js          # 年齡、學年、每年回合、球場背景
    events.config.js            # 主線關卡
    opportunities.config.js     # 偶遇、戀愛、博士、角色專屬機緣
    abilities.config.js         # 天賦、強心臟等特殊能力
    training.config.js          # 基礎能力強化、點數與失敗率
    progression.config.js       # 年齡成長、老化、健康與退休
    scouting.config.js          # 球探、選秀、職業邀約
    baseball-rules.config.js    # 三好四壞、三出局、局數等
    pitches.config.js           # 球種特性與學習條件
    batters.config.js           # 打者類型、台詞與傾向
    match-balance.config.js     # 被打率、好球率、換投與角色分工
    baseball-match-engine.js    # 執行棒球對戰規則
```

設定檔使用 `*.config.js` 的純資料物件。原因是目前遊戲也會從本機檔案開啟，這比需要網路讀取的 JSON 更穩定；但每份設定仍要通過驗證器，不允許在設定中放函式。

## 4. 七個初始角色設定

`characters.config.js` 每個角色包含：

```js
{
  id: "bird_18",
  jersey: 18,
  name: "資本雄厚",
  image: "assets/solid-bird-pitcher.webp",
  description: "你的起跑線，在別人的終點前。",
  initialStats: {
    power:  { min: 28, max: 38 },
    control:{ min: 28, max: 38 },
    speed:  { min: 28, max: 38 },
    break:  { min: 20, max: 32 }
  },
  hiddenStats: {
    health:{ min: 45, max: 65 },
    mind:  { min: 35, max: 55 },
    luck:  { min: 35, max: 55 }
  },
  startingPitches: ["four_seam"],
  startingAbilities: ["wealthy_family"],
  exclusiveEventIds: ["origin_18_buy_team"],
  modifiers: [
    { target: "training.cost", operation: "multiply", value: 0.5 }
  ]
}
```

玩家只輸入名字；引擎從 7 個角色隨機抽取一個，再依 min/max 產生能力。

## 5. 基礎能力、特殊能力與球種設定

這三種資料必須分開，不能再混成同一個「技能」陣列：

| 類型 | 例子 | 是否有分數 | 如何成長 |
|---|---|---:|---|
| 基礎能力 `stats` | 球威、控球、球速、變化球 | 0～99 | 使用技能點強化，可能失敗 |
| 特殊能力 `abilities` | 天賦、強心臟、一球入魂 | 通常沒有 | 劇情、成就、角色背景取得 |
| 球種 `pitches` | 四縫線、滑球、指叉球 | 熟練度可選配 | 學習事件、練習與比賽使用 |

### 5.1 基礎能力設定 `stats.config.js`

每一項基礎能力都有自己的顯示、上下限、強化公式與對戰用途：

```js
{
  id: "control",
  name: "控球",
  shortDescription: "影響投進好球帶與邊角的能力。",
  fullDescription: "控球越高，好球率越穩定，四壞保送機率越低。",
  min: 0,
  max: 99,
  visible: true,
  allocation: {
    enabled: true,
    costPerAttempt: 1,
    baseSuccessRate: 0.90,
    difficultyAfter: [
      { value: 50, penalty: 0.03 },
      { value: 70, penalty: 0.10 },
      { value: 90, penalty: 0.22 }
    ]
  },
  matchBindings: ["pitch.zoneChance", "pitch.edgeChance", "pitch.walkChance"]
}
```

隱藏的健康、心智、運氣也放在此檔，但設為 `visible: false`、`allocation.enabled: false`，玩家不能直接查看或配點。

### 5.2 特殊能力設定 `abilities.config.js`

每個特殊能力是一筆獨立資料，包含說明、取得方法、觸發條件與效果：

```js
{
  id: "one_pitch_soul",
  name: "一球入魂",
  category: "pitching",
  rarity: "legendary",
  icon: "🔥",
  shortDescription: "連續使用四縫線直球後覺醒。",
  fullDescription: "連續投出 20 顆四縫線直球即可取得；兩好球後再投四縫線，必定造成三振。",
  visibleBeforeUnlock: false,
  stackable: false,
  unlock: {
    all: [
      { path: "counters.consecutivePitch.four_seam", op: ">=", value: 20 }
    ]
  },
  triggers: [
    {
      on: "BEFORE_PITCH_RESULT",
      when: {
        all: [
          { path: "match.count.strikes", op: ">=", value: 2 },
          { path: "action.pitchId", op: "==", value: "four_seam" }
        ]
      },
      effects: [
        { op: "overrideMatchOutcome", value: "strikeout" }
      ]
    }
  ]
}
```

能力觸發時機必須從固定清單選擇，例如：

- `YEAR_START`
- `BEFORE_EVENT_ROLL`
- `BEFORE_TRAINING`
- `BEFORE_MATCH`
- `BEFORE_PITCH_RESULT`
- `AFTER_PITCH_RESULT`
- `SCOUT_EVALUATION`
- `YEAR_END`

這樣新增能力只需增加設定；只有全新種類的效果才需要擴充 Effect Engine。

### 5.3 球種設定 `pitches.config.js`

每一個球種都要有描述、分類、基礎特性、能力加成、取得條件與可選的熟練度：

```js
{
  id: "four_seam",
  name: "四縫線直球",
  family: "fastball",
  icon: "⚾",
  shortDescription: "容易投進好球帶，但被打中時較危險。",
  fullDescription: "以球速和球威正面壓制打者；好球率高於變化球，被打擊率也較高。",
  tags: ["fast", "straight", "starter_pitch"],
  base: {
    zoneChance: 0.64,
    swingMissChance: 0.10,
    contactChance: 0.54,
    hardHitChance: 0.20,
    groundBallChance: 0.32
  },
  scaling: [
    { stat: "speed", target: "swingMissChance", weight: 0.30 },
    { stat: "power", target: "contactChance", weight: -0.22 },
    { stat: "control", target: "zoneChance", weight: 0.36 }
  ],
  countModifiers: {
    behindInCount: { zoneChance: 0.05, contactChance: 0.03 },
    twoStrikes: { swingMissChance: 0.03 }
  },
  unlock: {
    startingPitch: true
  },
  mastery: {
    enabled: true,
    max: 100,
    gainPerUse: 0.2,
    levels: [
      { min: 30, bonuses: { zoneChance: 0.01 } },
      { min: 60, bonuses: { swingMissChance: 0.02 } },
      { min: 90, bonuses: { contactChance: -0.03 } }
    ]
  }
}
```

球種數值的職責劃分：

- `pitches.config.js`：描述單一球種本身的個性與能力縮放。
- `batters.config.js`：打者對不同球種的優勢／弱點。
- `match-balance.config.js`：全遊戲共同的難度、疲勞、球數與壘況修正。
- `baseball-rules.config.js`：三好四壞、三出局等固定棒球規則。

建議第一階段把所有球種放在同一份 `pitches.config.js`，每個球種一筆資料。若未來超過約 30 種，再拆成 `pitches/fastballs.config.js`、`pitches/breaking.config.js` 等分類檔，不要一顆球種一個檔案。

## 6. 關卡與機緣設定

主線關卡與偶發機緣使用同一資料格式，因此能共用條件、選項與效果。

```js
{
  id: "hs_y1_tryout",
  type: "story",                // story / random / relationship / origin
  stage: "high_school",
  year: 1,
  title: "第一次高中測試",
  text: "教練把球交給你。",
  when: {
    all: [
      { path: "player.age", op: ">=", value: 16 },
      { path: "flags.hs_tryout_done", op: "!=", value: true }
    ]
  },
  weight: 100,
  once: true,
  choices: [
    {
      id: "challenge_fastball",
      text: "用直球正面挑戰",
      outcomes: [
        {
          weight: 65,
          result: "測速槍亮起新紀錄。",
          effects: [
            { op: "add", path: "stats.speed", value: { min: 2, max: 5 } },
            { op: "set", path: "flags.hs_tryout_done", value: true }
          ]
        },
        {
          weight: 35,
          result: "你用力過猛，控球完全走樣。",
          effects: [
            { op: "add", path: "hidden.health", value: -3 },
            { op: "add", path: "stats.control", value: -1 }
          ]
        }
      ]
    }
  ]
}
```

支援的標準效果指令：

- `add`：數值增加或減少。
- `set`：設定狀態或旗標。
- `grant` / `remove`：獲得或失去球種、能力、物品。
- `injure` / `recover`：建立傷勢或復原。
- `schedule`：安排未來事件。
- `relationship`：改變戀愛／婚姻狀態。
- `retire`：觸發退休。

所有機率結果由 `outcomes.weight` 控制，不能在畫面程式內臨時亂數。

## 7. Flow Controller

Flow Controller 是唯一能切換階段的模組。標準年度流程：

```text
NEW_GAME
  → CREATE_PLAYER
  → YEAR_START
  → EVENT_LOOP
  → MATCH_ASSIGNMENT
  → MATCH_PLAY
  → MATCH_RESULT
  → SKILL_ALLOCATION
  → SCOUT_EVALUATION
  → YEAR_END
  → 下一年 / 下一階段 / 退休結局
```

建議狀態列舉：

```js
const GamePhase = {
  CREATE_PLAYER: "CREATE_PLAYER",
  YEAR_START: "YEAR_START",
  EVENT: "EVENT",
  MATCH_ASSIGNMENT: "MATCH_ASSIGNMENT",
  MATCH_PLAY: "MATCH_PLAY",
  MATCH_RESULT: "MATCH_RESULT",
  SKILL_ALLOCATION: "SKILL_ALLOCATION",
  SCOUT_EVALUATION: "SCOUT_EVALUATION",
  YEAR_END: "YEAR_END",
  ENDING: "ENDING"
};
```

畫面按鈕只會送出動作，例如 `CHOOSE_EVENT_OPTION`、`THROW_PITCH`、`ALLOCATE_POINT`。Flow Controller 驗證目前階段允許該動作後，再呼叫對應引擎並產生下一個狀態。

## 8. 玩家累積資料庫

GitHub Pages 是靜態網站，所以 v47 預設仍是「玩家自己的手機本機資料庫」，不會自動蒐集所有玩家資料。先定義 Repository 介面，日後若要跨手機同步，再增加雲端實作而不修改遊戲流程。

```js
{
  schemaVersion: 47,
  saveId: "uuid",
  createdAt: "ISO_DATE",
  updatedAt: "ISO_DATE",
  player: {
    name: "逸群",
    characterId: "bird_18",
    age: 16,
    stage: "high_school",
    year: 1,
    stats: { power: 42, control: 39, speed: 45, break: 31 },
    hidden: { health: 58, mind: 51, luck: 43 },
    pitches: ["four_seam"],
    abilities: ["wealthy_family"],
    injuries: [],
    relationship: { status: "single" }
  },
  progress: {
    phase: "EVENT",
    round: 2,
    flags: {},
    completedEvents: [],
    scheduledEvents: []
  },
  statistics: {
    currentGame: {},
    currentSeason: {},
    career: {},
    seasons: []
  },
  history: [],
  rngState: "..."
}
```

重要原則：

- 存「事實」，不要存可重新計算的文字或評分。
- 每完成一個選擇、每一球、每次配點後自動存檔。
- 存檔包含 `schemaVersion`，以 migrations 升級舊版本。
- 隱藏能力仍存在存檔，但 ViewModel 不提供給一般畫面。

## 9. 棒球對戰系統

對戰系統是 Baseball Pack 的專用模組，Core Engine 只認識以下介面：

```js
matchEngine.create(context)
matchEngine.getAvailableActions(matchState)
matchEngine.applyAction(matchState, action)
matchEngine.isFinished(matchState)
matchEngine.getResult(matchState)
```

`baseball-rules.config.js` 負責不可隨意改動的規則：

- 三好球三振、四壞球保送。
- 三出局攻守交換。
- 壘包推進、得分、責失分。
- 局數、先發／中繼／終結者登板位置。
- 安打、保送、失誤、雙殺、犧牲打與換投。

`match-balance.config.js` 負責可以反覆調整的平衡：

- 各球種好球率、揮空率、被打率。
- 球威、控球、球速、變化球、健康、心智的權重。
- 打者強度、球數、壘況與疲勞修正。
- 教練換投門檻與負面事件機率。

規則和機率分開，可避免為了調整被打率而破壞三出局邏輯。

## 10. 球探與職業邀約系統

球探每年只在 `SCOUT_EVALUATION` 階段執行一次。設定分成硬性資格與機率評分。

```js
{
  id: "cpbl",
  name: "中華職棒",
  evaluateAt: ["high_school_end", "college_year_end"],
  eligibility: {
    anyStatAtLeast: 70,
    healthAtLeast: 20
  },
  score: [
    { path: "stats.best", weight: 0.40 },
    { path: "statistics.season.eraScore", weight: 0.25 },
    { path: "statistics.season.kbbScore", weight: 0.15 },
    { path: "hidden.luck", weight: 0.10 },
    { path: "reputation", weight: 0.10 }
  ],
  invitationTable: [
    { minScore: 90, chance: 0.95, offerId: "cpbl_round_1" },
    { minScore: 75, chance: 0.65, offerId: "cpbl_late_round" },
    { minScore: 60, chance: 0.25, offerId: "cpbl_tryout" }
  ],
  fallbackEventId: "no_offer_continue_school"
}
```

邀約結果寫回玩家資料庫，但邀約文案與合約內容放在設定檔。

## 11. 未來替換主題

Core Engine、玩家資料 Repository 與大部分 UI 不變，只替換：

```text
packs/baseball/  → packs/basketball/
BaseballMatchEngine → BasketballMatchEngine
棒球圖片與文字 → 新主題資產與文案
```

通用欄位應使用 `stats`、`abilities`、`stages`、`events`、`match`；只有 Baseball Pack 裡可以出現 `pitch`、`inning`、`strikeout` 等棒球專有名詞。

## 12. v47 改版順序

1. 凍結 v46 的畫面與圖片，建立回歸測試。
2. 建立所有設定檔格式與 Config Validator。
3. 把 7 個角色、章節、事件搬入設定檔，遊戲行為先保持不變。
4. 建立 PlayerState、StatsLedger、存檔版本與 v46 遷移。
5. 建立 Effect Engine、Condition Engine、Event Engine。
6. 建立 Flow Controller，移除畫面內的流程判斷。
7. 抽出 Baseball Match Engine 與棒球平衡設定。
8. 抽出 Scouting Engine。
9. 完成手機／電腦回歸測試後才發布 v47。

## 13. 驗收標準

- 修改角色能力區間只需改 `characters.config.js`。
- 修改能力名稱、配點成功率與能力用途只需改 `stats.config.js`。
- 新增特殊能力只需在 `abilities.config.js` 增加一筆資料。
- 修改球種描述、好球率或能力縮放只需改 `pitches.config.js`。
- 新增關卡只需在 events 設定新增一筆，不改引擎。
- 新增球種只需改 pitches 與平衡設定。
- 調整中職／日職／美職門檻只需改 scouting 設定。
- 事件設定寫錯 ID 或效果路徑時，啟動即顯示明確錯誤。
- 同一個存檔重新載入後，事件、亂數與比賽狀態完全一致。
- 第三出局、四壞、三振、換投等棒球規則有自動測試。
- v46 舊存檔可升級或清楚提示不相容，不能無聲損壞。

## 14. 架構決策

建議採用此方案：

- 不更換目前 HTML/CSS 視覺。
- 不使用大型框架，維持 GitHub Pages 可直接部署。
- 使用資料型 `*.config.js` 加驗證器，兼顧可編輯性與本機開啟。
- Flow Controller 保持程式碼，流程順序與節點參數可設定；不把所有邏輯塞進設定檔。
- 棒球規則寫在 Baseball Match Engine，平衡數值寫在設定檔。
- 本機資料庫先用 Repository 封裝，預留未來雲端同步。
