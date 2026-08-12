const $ = (s) => document.querySelector(s);

const statLabels = { power: "力量", contact: "打擊", speed: "速度", fielding: "守備", spirit: "心志", health: "健康" };
const chapters = [
  { name: "菜鳥的夏天", place: "青葉中學", age: 15 },
  { name: "甲子園之路", place: "海風高中", age: 17 },
  { name: "選秀之夜", place: "職業二軍", age: 20 },
  { name: "王牌的代價", place: "職業一軍", age: 25 },
  { name: "最後一局", place: "生涯暮年", age: 34 }
];

const events = [
  { icon:"🧢", tag:"春季 · 社團教室", title:"最後一個名額", text:"校隊只剩一個名額。教練把球放在桌上，說他不看過去，只看你接下來的選擇。", min:0, choices:[
    ["天還沒亮就到球場特訓", {power:3,contact:4,health:-2}, "手掌磨破了皮，但擊球聲一天比一天紮實。"],
    ["研究對手與自己的揮棒影片", {contact:3,fielding:2,spirit:2}, "你開始看到別人忽略的細節。"],
    ["拉著隊友一起自主訓練", {spirit:4,fame:2,power:1}, "你還不是先發，卻已經有人願意跟隨你。"]
  ]},
  { icon:"🌧️", tag:"梅雨季 · 室內練習場", title:"雨下個不停", text:"連續兩週大雨，球場積水。重要比賽將近，大家的情緒開始浮躁。", min:0, choices:[
    ["冒雨加練滑壘", {speed:5,health:-5}, "你練會了漂亮的滑壘，也染上小感冒。"],
    ["改練核心與柔軟度", {power:2,health:4}, "看似平淡的訓練，替你存下了漫長賽季的本錢。"],
    ["組織一場戰術會議", {fielding:3,spirit:3}, "休息室第一次有了真正的團隊氣氛。"]
  ]},
  { icon:"🔥", tag:"夏季 · 地區預賽", title:"兩出局，滿壘", text:"九局下半落後一分。觀眾席像海浪一樣咆哮，而你聽見自己的呼吸。", min:0, choices:[
    ["瞄準第一顆直球，全力揮擊", {power:5,fame:4,health:-2}, "球越過游擊手頭頂！大膽讓全場記住了你的名字。", .58],
    ["纏鬥，等投手犯錯", {contact:4,spirit:3,fame:2}, "第九球，你選到了四壞保送。冷靜也是一種英雄主義。", .74],
    ["出其不意短打", {speed:3,contact:2,fame:3}, "球沿著邊線滾動。你用速度逼出一次驚險的機會。", .65]
  ]},
  { icon:"📨", tag:"秋季 · 放學後", title:"遠方的邀請", text:"一所棒球名校寄來邀請，但那意味著離家，也意味著你可能只是板凳上的其中一人。", min:1, choices:[
    ["去更大的舞台競爭", {spirit:5,fame:3,health:-2}, "陌生城市的燈很亮，你告訴自己不能回頭。"],
    ["留在家鄉當球隊核心", {contact:3,fielding:3,fame:2}, "你選擇把熟悉的球場，打成自己的主場。"],
    ["先和家人好好談談", {spirit:3,health:3}, "理解沒有削弱野心，反而讓你走得更穩。"]
  ]},
  { icon:"🩹", tag:"冬季 · 防護室", title:"肩膀發出警訊", text:"檢查結果不算嚴重，但防護員明確告訴你：繼續硬撐，代價可能不只是幾場比賽。", min:1, choices:[
    ["完整休養，重新調整動作", {health:8,spirit:2,fame:-2}, "你錯過了一些掌聲，卻找回更長遠的未來。"],
    ["帶傷上場，不讓出先發", {fame:5,spirit:3,health:-8}, "你撐完了比賽。歡呼聲中，疼痛也更加清晰。", .52],
    ["轉向數據與技巧訓練", {contact:4,fielding:4,health:1}, "傷勢逼你成為更聰明的球員。"]
  ]},
  { icon:"📋", tag:"夏季 · 選秀會場", title:"球探的評語", text:"球探說你很有特色，但還不是完成品。最後一次測試，你能選擇展示什麼。", min:2, choices:[
    ["展示最有爆發力的一面", {power:6,fame:5,health:-2}, "測速槍與歡呼同時亮起。你的順位快速攀升。", .6],
    ["展示穩定與基本功", {contact:4,fielding:5,fame:2}, "沒有誇張的場面，但每位球探都在筆記本上畫了圈。", .78],
    ["坦白自己的弱點與改善計畫", {spirit:6,fame:3}, "你的誠實和成熟，讓一支球隊決定賭你的未來。"]
  ]},
  { icon:"🚌", tag:"漫長客場 · 深夜", title:"二軍的第 113 天", text:"沒有轉播、沒有滿場觀眾。只有顛簸的巴士、便利商店晚餐，和一張遲遲沒來的一軍通知。", min:2, choices:[
    ["每天多揮五百棒", {power:4,contact:3,health:-4}, "沒有人看見的努力，慢慢長成看得見的差距。"],
    ["向老將請教如何讀比賽", {contact:4,fielding:4,spirit:2}, "他沒有教你捷徑，只教你怎麼少繞一點遠路。"],
    ["經營社群記錄二軍生活", {fame:6,fans:1200,spirit:1}, "真實的日常意外打動了很多人。"]
  ]},
  { icon:"✨", tag:"一軍 · 初登場", title:"聚光燈亮起", text:"廣播唸出你的名字。從休息區走到打擊區只有幾十公尺，卻像走過了很多年。", min:2, choices:[
    ["享受這一刻，揮出自己的球", {power:4,spirit:5,fame:7,fans:3000}, "你沒有被燈光吞沒。第一支安打乾淨地落在草地上。", .64],
    ["照教練暗號確實執行", {contact:4,fielding:3,fame:4}, "你犧牲自己推進跑者，隊友在本壘迎接勝利。"],
    ["觀察守備站位，偷襲短打", {speed:5,contact:2,fame:5}, "全場愣了半秒，然後沸騰。", .68]
  ]},
  { icon:"📰", tag:"明星賽前 · 記者會", title:"一夜成名", text:"你登上了所有體育版頭條。代言與訪問湧入，但明天仍然有比賽。", min:3, choices:[
    ["接受高額代言", {money:1200,fame:6,spirit:-2}, "你的臉出現在城市各處，也開始理解名聲的重量。"],
    ["婉拒邀約，專心備戰", {contact:5,spirit:4,fame:-1}, "世界短暫安靜下來，你重新聽見球棒劃過空氣。"],
    ["把曝光留給整支球隊", {fame:4,fans:5000,spirit:3}, "你的隊友記住了這份情。"]
  ]},
  { icon:"🏟️", tag:"總冠軍賽 · 決勝局", title:"全場把希望交給你", text:"系列賽最後一戰。比分相同，兩出局。熟悉的情境，卻是你從未感受過的重量。", min:3, choices:[
    ["鎖定外角球，追求長打", {power:7,fame:10,fans:15000,health:-3}, "這一球飛了很久、很久。直到整座城市開始慶祝。", .55],
    ["相信多年磨練的直覺", {contact:6,spirit:6,fame:8}, "球棒與球相遇的瞬間，你知道答案對了。", .7],
    ["做出團隊最需要的選擇", {fielding:5,spirit:7,fame:6}, "不是每位英雄都站在聚光燈中央，但隊友都知道。", .82]
  ]},
  { icon:"👦", tag:"休賽季 · 河堤球場", title:"一個孩子的來信", text:"信上寫著，他因為看了你的比賽，第一次鼓起勇氣加入球隊。", min:3, choices:[
    ["親自去他的球隊上一堂課", {spirit:6,fans:7000,fame:4}, "那天你沒有擊出全壘打，卻改變了一個人的人生。"],
    ["送他一副簽名手套", {money:-100,spirit:3,fans:3000}, "幾年後，你在選秀名單上又看見了那個名字。"],
    ["成立偏鄉棒球計畫", {money:-600,fame:8,fans:12000,spirit:5}, "你種下的不是成績，而是一座座小小的球場。"]
  ]},
  { icon:"🌅", tag:"秋季 · 空蕩球場", title:"何時離開？", text:"身體恢復得比過去慢。記者反覆問你是否引退，而你獨自在清晨走進球場。", min:4, choices:[
    ["再拚最後一個賽季", {spirit:6,fame:5,health:-8}, "你知道每一場都可能是最後一場，所以看得格外清楚。", .5],
    ["在還能微笑時告別", {health:5,fame:8,spirit:5}, "你把球帽放在本壘板上。掌聲久久沒有停。"],
    ["轉任教練，培養下一代", {fielding:6,spirit:7,fame:4}, "你不再站上打擊區，卻在更多年輕人的揮棒裡延續。"]
  ]}
];

let state;
let soundOn = true;
let rng = Math.random;

function xmur3(str) { let h=1779033703^str.length; for(let i=0;i<str.length;i++) h=Math.imul(h^str.charCodeAt(i),3432918353),h=h<<13|h>>>19; return () => { h=Math.imul(h^h>>>16,2246822507); h=Math.imul(h^h>>>13,3266489909); return (h^h>>>16)>>>0; }; }
function mulberry32(a) { return () => { let t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
function setRng(seed) { rng = mulberry32(xmur3(seed)()); }
function randomSeed() { return Math.random().toString(36).slice(2,10); }

function beep(freq=420) {
  if (!soundOn) return;
  try { const ctx = new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.value=freq; g.gain.setValueAtTime(.035,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12); o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+.12); } catch {}
}

function newState() {
  return { name: $("#playerName").value.trim()||"無名小將", position:$("#position").value, seed:$("#seedInput").value||randomSeed(), chapter:0, turn:0, used:[], stats:{power:28,contact:30,speed:31,fielding:29,spirit:35,health:72}, fame:0,money:0,fans:12,timeline:["加入校隊"] };
}

function startGame(customState) {
  state = customState || newState();
  setRng(state.seed);
  $("#startScreen").classList.add("hidden"); $("#endingScreen").classList.add("hidden"); $("#gameScreen").classList.remove("hidden");
  save(); render(); showEvent();
}

function availableEvents() { let pool=events.map((e,i)=>({e,i})).filter(x=>x.e.min<=state.chapter && !state.used.includes(x.i)); if(!pool.length) { state.used=[]; pool=events.map((e,i)=>({e,i})).filter(x=>x.e.min<=state.chapter); } return pool; }

function showEvent() {
  const pool=availableEvents(); const pick=pool[Math.floor(rng()*pool.length)]; state.current=pick.i; state.used.push(pick.i); const e=pick.e;
  $("#eventIcon").textContent=e.icon; $("#eventKicker").textContent=e.tag; $("#eventTitle").textContent=e.title; $("#eventText").textContent=e.text;
  $("#resultBox").classList.add("hidden"); $("#nextBtn").classList.add("hidden");
  $("#choices").innerHTML=e.choices.map((c,i)=>`<button class="choice" data-i="${i}"><span class="choice-letter">${String.fromCharCode(65+i)}</span><span>${c[0]}</span></button>`).join("");
  document.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>choose(+btn.dataset.i)));
  save();
}

function choose(i) {
  const c=events[state.current].choices[i], effects={...c[1]}; let success=true;
  if(c[3]!==undefined) { const bonus=(state.stats.spirit-35)/200; success=rng()<c[3]+bonus; if(!success) Object.keys(effects).forEach(k=>effects[k]=Math.round(effects[k]*-.45)); }
  const parts=[];
  for(const [k,v] of Object.entries(effects)) {
    if(k in state.stats) state.stats[k]=Math.max(0,Math.min(99,state.stats[k]+v)); else state[k]=Math.max(0,(state[k]||0)+v);
    parts.push(`<span class="delta ${v<0?'negative':''}">${statLabels[k]||({fame:'名聲',money:'資金',fans:'粉絲'}[k])} ${v>0?'+':''}${v}</span>`);
  }
  $("#choices").innerHTML=""; $("#resultBox").innerHTML=`<strong>${success?'結果':'事與願違'}</strong><br>${success?c[2]:"結果沒有如你預期，但失敗也成了往後的養分。"}<br>${parts.join("")}`; $("#resultBox").classList.remove("hidden"); $("#nextBtn").classList.remove("hidden");
  if((effects.fame||0)>=6 || (effects.spirit||0)>=6) { const mark=events[state.current].title; if(!state.timeline.includes(mark)) state.timeline.push(mark); }
  beep(success?520:220); render(); save();
}

function nextTurn() {
  state.turn++;
  if(state.turn>=8) { state.turn=0; state.chapter++; state.timeline.push(chapters[Math.min(state.chapter,4)]?.name||"生涯終章"); state.stats.health=Math.min(99,state.stats.health+5); }
  if(state.chapter>=5) return endGame();
  render(); showEvent(); window.scrollTo({top:0,behavior:"smooth"}); beep(390);
}

function overallScore() { const s=state.stats; return Math.round((s.power+s.contact+s.speed+s.fielding+s.spirit+s.health)/6); }
function grade(n) { return n>=82?'S':n>=70?'A':n>=57?'B':n>=44?'C':n>=32?'D':'E'; }

function render() {
  const ch=chapters[state.chapter]; $("#displayName").textContent=state.name; $("#playerPosition").textContent=state.position; $("#careerLine").textContent=`${ch.age} 歲 · ${ch.place}`; $("#avatar").textContent=String((xmur3(state.name)()%99)+1).padStart(2,'0');
  $("#overall").textContent=grade(overallScore());
  $("#stats").innerHTML=Object.entries(state.stats).map(([k,v])=>`<div class="stat"><div class="stat-head"><span>${statLabels[k]}</span><b>${v}</b></div><div class="stat-track"><i style="width:${v}%"></i></div></div>`).join("");
  $("#fameValue").textContent=state.fame; $("#moneyValue").textContent=state.money+" 萬"; $("#fansValue").textContent=state.fans>=10000?(state.fans/10000).toFixed(1)+"萬":state.fans;
  $("#chapterLabel").textContent=`第${['一','二','三','四','五'][state.chapter]}章`; $("#seasonLabel").textContent=ch.name; $("#weekLabel").textContent=`第 ${state.turn+1} / 8 回合`; $("#progressBar").style.width=`${(state.turn+1)/8*100}%`;
  $("#timelineItems").innerHTML=state.timeline.slice(-8).map(x=>`<span class="timeline-item">● ${x}</span>`).join(""); $("#achievementCount").textContent=`${Math.max(0,state.timeline.length-1)} 個里程碑`;
}

function endGame() {
  localStorage.removeItem("baseballLifeSave"); $("#gameScreen").classList.add("hidden"); $("#endingScreen").classList.remove("hidden");
  const o=overallScore(); let ending;
  if(state.fame>=38&&o>=62) ending=["🏆","時代的名字","你把天賦、選擇與漫長的努力熬成了一段傳奇。多年以後，人們仍用你的名字形容那些不肯放棄的球員。"];
  else if(state.stats.spirit>=65) ending=["🌱","照亮球場的人","紀錄終會被改寫，但你帶給隊友與後輩的勇氣留了下來。你的棒球人生，在許多人身上繼續延長。"];
  else if(state.money>=1500) ending=["💎","球場風雲兒","你不只征服球場，也懂得把握聚光燈。退役後的生活依然熱鬧，邀約從未停過。"];
  else ending=["🧢","無悔的九局","你未必成為歷史課本上的名字，卻認真打完每一個屬於自己的打席。這已經是一場漂亮的比賽。"];
  $("#endingIcon").textContent=ending[0]; $("#endingTitle").textContent=ending[1]; $("#endingText").textContent=ending[2];
  $("#finalStats").innerHTML=`<div><span>生涯評價</span><b>${grade(o)}</b></div><div><span>名聲</span><b>${state.fame}</b></div><div><span>球迷</span><b>${state.fans}</b></div><div><span>里程碑</span><b>${state.timeline.length-1}</b></div>`;
  window.scrollTo({top:0,behavior:"smooth"}); beep(680);
}

function save() { localStorage.setItem("baseballLifeSave",JSON.stringify(state)); }
function resetToStart() { localStorage.removeItem("baseballLifeSave"); state=null; $("#gameScreen").classList.add("hidden"); $("#endingScreen").classList.add("hidden"); $("#startScreen").classList.remove("hidden"); $("#seedInput").value=randomSeed(); window.scrollTo({top:0,behavior:"smooth"}); }

$("#randomSeed").addEventListener("click",()=>$("#seedInput").value=randomSeed());
$("#startBtn").addEventListener("click",()=>startGame());
$("#nextBtn").addEventListener("click",nextTurn);
$("#restartBtn").addEventListener("click",()=>{ if(confirm("確定要放棄目前生涯，重新開始嗎？")) resetToStart(); });
$("#newLifeBtn").addEventListener("click",resetToStart);
$("#continueBtn").addEventListener("click",()=>{ try{startGame(JSON.parse(localStorage.getItem("baseballLifeSave")));}catch{resetToStart();} });
$("#soundBtn").addEventListener("click",e=>{soundOn=!soundOn;e.currentTarget.classList.toggle("off",!soundOn);beep();});
$("#shareBtn").addEventListener("click",async()=>{ const text=`⚾ 逸群的野球｜${state.name}\n${state.position} · 生涯評價 ${grade(overallScore())}\n名聲 ${state.fame}｜球迷 ${state.fans}\n命運種子：${state.seed}`; try{await navigator.clipboard.writeText(text);$("#copyHint").textContent="生涯卡已複製！";}catch{$("#copyHint").textContent=text;} });

const params=new URLSearchParams(location.search); $("#seedInput").value=params.get("seed")||randomSeed();
if(localStorage.getItem("baseballLifeSave")) $("#continueBtn").classList.remove("hidden");
