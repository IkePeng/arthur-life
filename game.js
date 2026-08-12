const $ = (s) => document.querySelector(s);

const birdRoster = {
  "18": { src:"assets/solid-bird-pitcher.webp?v=3", label:"資本雄厚", bonus:"家族資源雄厚 · 可取得直接合約 · 表現仍靠自己", money:3200, stats:{contact:3,luck:3}, cost:0.45, opportunityChapter:3, special:"菁英資源" },
  "21": { src:"assets/solid-bird-lefty-21.webp?v=3", label:"一招入魂", bonus:"先天球威突出 · 正面壓制打者", stats:{power:22,speed:9,contact:-5,fielding:-4,health:-3}, pitch:"火球直球", opportunityChapter:1, special:"重球威壓" },
  "36": { src:"assets/solid-bird-sidearm-36.webp?v=3", label:"天賦異稟", bonus:"先天掌握多種球路 · 球種養成較快", stats:{fielding:8,luck:3}, pitches:["曲球","變速球","滑球"], training:1.25, cap:108, opportunityChapter:0, special:"天賦" },
  "99": { src:"assets/solid-bird-closer-99.webp?v=3", label:"名門之後", bonus:"家族熟悉職業訓練 · 恢復與保養能力突出", fame:10, fans:1800, stats:{health:24,contact:3}, scout:.1, opportunityChapter:2, special:"耐傷" },
  "55": { src:"assets/solid-bird-power-55.webp?v=3", label:"草莽野草", bonus:"逆境中更能堅持 · 關鍵時刻不易動搖", fans:900, stats:{spirit:24,health:8,power:3}, adversity:1.28, opportunityChapter:1, special:"強心臟" },
  "77": { src:"assets/solid-bird-calm-77.webp?v=3", label:"強運之子", bonus:"偶遇與關鍵判定更容易出現好結果", stats:{luck:28,spirit:5}, luck:.12, opportunityChapter:3, special:"幸運星" },
  "88": { src:"assets/solid-bird-heavy-88.webp?v=3", label:"世故玩家", bonus:"擅長談判與布局 · 能把人脈轉化為機會", money:300, fame:7, fans:1200, stats:{contact:5,spirit:4,luck:15}, business:1.55, opportunityChapter:3, special:"談判術" }
};
let selectedBird = null;

const statLabels = { power: "球威", contact: "控球", speed: "球速", fielding: "變化球", spirit: "心志", health: "健康", luck:"運氣" };
const chapters = [
  { name: "菜鳥的夏天", place: "國中一年級 · 青葉中學", age: 13, intro:"你從一個連背號都沒有的新人開始。這三年，每一顆球都在替高中之路累積籌碼。", transition:"完成國中三年養成，收到高中球隊邀請" },
  { name: "甲子園之路", place: "高中二年級 · 海風高中", age: 17, intro:"國中畢業後，你離開熟悉的球場。高中更重的訓練、更強的打者，開始把天賦磨成真正能力。", transition:"高中畢業，球探報告與升學邀請同時寄達" },
  { name: "大學與國家隊", place: "大學棒球 · 國際賽舞台", age: 20, intro:"你選擇先完成大學養成。國際賽、木棒與長局數，將決定職業球探如何評價你。", transition:"完成大學養成，正式取得選秀與旅外資格" },
  { name: "命運的合約", place: "職業抉擇 · 球探與選秀", age: 22, intro:"畢業證書拿到手後，人生第一次不再有固定賽程。球探、經紀人與家人的意見，都在等你簽下名字。", transition:"簽下第一份職業合約，從新人身分開始競爭" },
  { name: "漫長的養成", place: "職業發展聯盟", age: 24, intro:"簽約不是抵達，只是另一段養成的開始。沒有轉播的比賽，仍會決定你能否升上最高層級。", transition:"通過發展聯盟考驗，獲得一軍登錄機會" },
  { name: "最高舞台", place: "職業一軍", age: 27, intro:"多年訓練濃縮成一通電話。你第一次穿上一軍球衣，也第一次發現站穩比登上更難。", transition:"完成第一個一軍階段，進入球隊核心競爭" },
  { name: "王牌的代價", place: "職業巔峰 · 傷病考驗", age: 30, intro:"你不再只是新人，而是被研究、被期待的主力。名聲、合約、家庭與傷勢同時進入人生。", transition:"走過巔峰與傷病，決定是否再次挑戰復出" },
  { name: "再一次上丘", place: "復出之路 · 生涯暮年", age: 36, intro:"身體已經不同，但你累積了年輕時沒有的經驗。最後的養成，是理解自己想留下什麼。", transition:"完成球員生涯" }
];
const chapterBackgrounds=["assets/baseball-campus.png","assets/chapter-2-night-stadium.webp","assets/chapter-3-scout-field.webp","assets/chapter-3-scout-field.webp","assets/baseball-campus.png","assets/chapter-4-pro-stadium.webp","assets/chapter-4-pro-stadium.webp","assets/chapter-5-sunset-field.webp"];

const extraRoundEvents=[
  {icon:"🎟️",title:"命運多給的一週",text:"原定賽程臨時延後，你意外多得到一段可以自由安排的時間。",choices:[["進牛棚修正控球",{contact:4,health:-2},"多出來的時間被你換成更穩定的放球點。"],["和捕手測試新配球",{fielding:4,spirit:2},"你找到一套讓打者更難猜的配球順序。"],["完整休息與恢復",{health:6,spirit:3},"你忍住加練的衝動，讓身體真正恢復。"]]},
  {icon:"🔭",title:"看台上的陌生球探",text:"一名沒有穿球隊制服的人連續看了三天練習。你不知道他為誰工作。",choices:[["用最快直球吸引注意",{power:4,speed:3,fame:2,health:-3},"測速數字讓球探多寫了一整頁。",.64],["展現完整球種與控球",{contact:4,fielding:4,fame:2},"他沒有鼓掌，離場前卻向教練要了你的資料。"],["照平常節奏不刻意表演",{spirit:4,health:2},"你沒有被目光打亂，反而投出最穩的一次練習。"]]},
  {icon:"🤝",title:"隊友的臨時邀約",text:"休息日，捕手約你去一座從沒去過的河堤球場。那裡聚集了很多不同層級的球員。",choices:[["和陌生打者實戰對決",{power:3,contact:3,health:-2},"沒有紀錄的對決，反而讓你敢嘗試新的球路。"],["觀察資深投手的握法",{fielding:5,pitch:"伸卡球"},"一個不起眼的握法，成了球種庫的新選項。",.58],["留下來和大家交朋友",{fans:500,fame:2,luck:2},"新的關係在往後替你帶來意外消息。"]]},
  {icon:"🌤️",title:"賽程中的空白",text:"你原本沒有預期會擁有這個回合。越是意外得到的時間，越能看出一名球員真正重視什麼。",choices:[["加強下肢與核心",{power:4,health:2},"你的踏步更穩，球到本壘前仍有力量。"],["研究下一場打者",{contact:4,spirit:2},"你提早看見對手的習慣。"],["陪家人度過一天",{spirit:5,luck:2},"離開球場一天，反而讓你更確定為何回來。"]]}
];

const legacyEvents = [
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

const events = [
  {icon:"🧢",tag:"第一章 · 四月入隊",title:"投手丘上的空位",text:"校隊只剩最後一個投手名額。教練把一顆舊球交給你：三球，讓我記住你的名字。",choices:[["全力投出最快直球",{speed:5,power:3,health:-2},"測速槍亮起，休息區傳來第一聲驚呼。",.62],["把三球都投進手套",{contact:5,spirit:2,pitch:"二縫線直球"},"沒有華麗的球速，卻讓教練點了點頭。"],["投出從沒成功過的曲球",{fielding:5,spirit:3,pitch:"曲球"},"第三球在本壘前猛然下墜。你得到了背號十八。",.55]]},
  {icon:"🎯",tag:"第一章 · 牛棚",title:"捕手阿拓的手套",text:"新搭檔阿拓說：球速不是全部。你若能相信我的手套，我也會相信你的球。",choices:[["每天加練外角低球",{contact:5,health:-2},"一百顆、兩百顆，白色手套成了你的座標。"],["和阿拓一起研究配球",{fielding:3,spirit:4},"你們開始用眼神就能交換暗號。"],["堅持用力量壓過打者",{power:5,speed:2,contact:-2},"你的直球很兇，也開始付出用球數的代價。"]]},
  {icon:"🌧️",tag:"第一章 · 雨中練習",title:"看不見終點的雨",text:"連日大雨讓球隊困在室內。學長說一年級投手最容易在沒人看見時放棄。",choices:[["對著牆練習投球動作",{contact:3,fielding:3},"沒有捕手，只有牆壁一次次把球還給你。"],["進行核心與下肢訓練",{power:4,health:3},"當球場放晴，你的踏步比以前更穩。"],["和隊友談談彼此的目標",{spirit:5,fame:2},"你第一次感覺自己真正屬於這支球隊。"]]},
  {icon:"⚾",tag:"第一章 · 練習賽",title:"第一次先發",text:"三局上，無人出局滿壘。教練走上投手丘，卻沒有伸手要球。",choices:[["用直球正面對決",{power:5,fame:3,health:-2},"三振！這是你第一次聽見全隊喊你的名字。",.62],["製造滾地球雙殺",{contact:4,fielding:3,spirit:2},"游擊手接球、踩壘、傳一壘，一次漂亮的脫困。"],["請阿拓決定下一球",{spirit:4,contact:3},"你學會了王牌不是獨自一個人。"]]},
  {icon:"🔥",tag:"第二章 · 夏季預賽",title:"王牌背號",text:"學長受傷，教練把一號球衣放到你的置物櫃。明天，你將扛起整支球隊。",choices:[["接下背號，承諾完投",{spirit:5,fame:4,health:-3},"球衣比想像中沉，但你沒有退後。"],["要求和學長輪流登板",{health:3,contact:4,pitch:"切球"},"你選擇讓球隊走得更遠，而不是讓自己最耀眼。"],["今晚獨自加練新球種",{fielding:6,health:-4,pitch:"變速球"},"那顆變速球，將成為夏天的秘密武器。",.58]]},
  {icon:"📹",tag:"第二章 · 情蒐室",title:"被看穿的直球",text:"下一場對手把你的投球影片逐格分析。球探說，你的出手點正在洩漏球路。",choices:[["徹底修改投球機制",{contact:5,power:2,health:-2},"一開始很彆扭，但你的動作終於不再說謊。"],["增加變速球比例",{fielding:5,spirit:2},"打者的揮棒開始總慢半拍。"],["相信最好的直球不怕被知道",{speed:5,power:4,health:-4},"他們知道你要投什麼，卻仍然碰不到。",.56]]},
  {icon:"🩹",tag:"第二章 · 八強賽前",title:"肘部的警訊",text:"醫生說只是輕微發炎，但明天就是全國八強。沒有人替你做決定。",choices:[["休息一場，相信隊友",{health:8,spirit:4,fame:-1},"你在板凳上喊到聲音沙啞，球隊替你守住了明天。"],["限制用球數後登板",{contact:3,fame:3,health:-3},"你投了五局，把領先交給牛棚。"],["隱瞞疼痛拚完投",{fame:7,spirit:4,health:-10},"你贏得比賽，卻不敢在賽後伸直手臂。",.5]]},
  {icon:"🏟️",tag:"第二章 · 全國決賽",title:"九局下，最後一球",text:"兩出局滿球數。阿拓比出暗號，這是你們四月時練過無數次的外角低球。",choices:[["相信阿拓的手套",{contact:6,spirit:6,fame:6},"球鑽進手套。短暫的安靜後，整座球場沸騰。"],["用最快直球決勝",{speed:6,power:5,fame:7,health:-4},"測速刷新紀錄，也把你送進所有球探的名單。",.6],["第一次投出秘密指叉球",{fielding:7,fame:8,spirit:3,pitch:"指叉球"},"打者的球棒從球上方掠過。你們成為全國冠軍。",.56]]},
  {icon:"📋",tag:"第三章 · 選秀測試",title:"球探席上的沉默",text:"傷後球速下降三公里。球探們沒有離開，但筆記本翻頁的聲音讓你焦躁。",choices:[["展示精準控球",{contact:6,fame:3},"二十球，手套幾乎沒有移動。"],["硬催回昔日球速",{speed:6,power:3,health:-6},"數字回來了，疼痛也回來了。",.52],["展示完整配球能力",{fielding:4,spirit:5,fame:4},"你證明自己不是只靠天賦投球。"]]},
  {icon:"📞",tag:"第三章 · 選秀前夜",title:"沒有響起的電話",text:"前幾輪選秀結束，手機仍然安靜。阿拓傳來一句：不論結果，我都會接你的球。",choices:[["繼續等待到最後",{spirit:6,fame:2},"第七輪，你終於聽見自己的名字。"],["接受獨立聯盟邀請",{power:3,contact:3,money:120},"不是夢想中的入口，但投手丘的距離都一樣。"],["先進大學磨練自己",{fielding:5,health:5},"你選擇晚一點出發，準備更完整地抵達。"]]},
  {icon:"🚌",tag:"第三章 · 二軍客場",title:"沒有觀眾的第九十天",text:"巴士、廉價旅館、空蕩看台。你開始懷疑自己是否真的屬於職業棒球。",choices:[["每天記錄投球數據",{contact:5,fielding:3},"那些枯燥的數字，慢慢拼出升上一軍的路。"],["向老將學習保養",{health:6,spirit:2},"你終於明白，能一直投也是一種才能。"],["在社群分享二軍生活",{fans:1800,fame:4,spirit:2},"有人開始為一個還沒上一軍的投手加油。"]]},
  {icon:"✨",tag:"第三章 · 一軍通知",title:"明天先發",text:"教練只說了四個字。你掛掉電話，在房間裡坐了很久。",choices:[["打給一路支持的家人",{spirit:5,health:2},"電話那頭沒說太多，卻讓你想起最初的理由。"],["和阿拓重看高中決賽",{contact:4,fielding:4},"不同球衣，相同的手套與暗號。"],["一個人去牛棚投到深夜",{speed:4,power:4,health:-4},"你用疲憊壓住緊張，也把明天刻進身體。"]]},
  {icon:"🌃",tag:"第四章 · 一軍初登板",title:"四萬人的呼吸",text:"第一球投成壞球。第二球也是。全場的聲音像海浪壓向投手丘。",choices:[["退板，重新綁鞋帶",{spirit:5,contact:4},"你替自己爭取十秒，然後連投三個好球。"],["用最快直球搶好球",{speed:5,power:4,fame:4},"球場的速度終於跟上你的心跳。",.6],["示意捕手上丘談話",{contact:3,spirit:4},"承認緊張，反而讓你找回節奏。"]]},
  {icon:"📊",tag:"第四章 · 第二年",title:"聯盟開始研究你",text:"打者不再追打你的指叉球。曾經無敵的武器，突然失去效果。",choices:[["開發反方向滑球",{fielding:7,health:-3,pitch:"滑球"},"新球路讓打者再次遲疑。",.58],["提高直球進壘比例",{power:5,contact:3},"你用最基本的球重新建立優勢。"],["改造指叉球的速度",{contact:5,spirit:3,pitch:"SFF"},"更快、更晚下墜的球，讓打者再次揮空。"]]},
  {icon:"📰",tag:"第四章 · 明星賽",title:"王牌的名字",text:"媒體把你稱為新世代王牌。代言、訪問與期待一起湧入。",choices:[["接受代言改善家人生活",{money:1200,fame:5,spirit:2},"你第一次用棒球替家人做了些什麼。"],["婉拒活動專心賽季",{contact:5,health:3,fame:-1},"你把聚光燈留在球場。"],["成立青少年投手營",{fans:7000,fame:6,spirit:5,money:-300},"很多孩子第一次相信自己也能站上投手丘。"]]},
  {icon:"🏆",tag:"第四章 · 冠軍賽",title:"中三日先發",text:"系列賽來到最後一戰。教練問你：休息只有三天，還能投嗎？",choices:[["把球交給我",{spirit:7,fame:9,health:-8},"你投到第八局，離場時全場起立。",.55],["擔任牛棚待命",{health:3,power:3,fame:5},"第七局危機，你走上投手丘守住了勝利。"],["相信輪值中的年輕投手",{spirit:6,fame:4},"你在場邊陪他度過最難的三局，球隊一起奪冠。"]]},
  {icon:"🩺",tag:"第五章 · 復健室",title:"肩膀不再年輕",text:"醫生說你仍能投，但不可能再回到最快的自己。窗外傳來新人牛棚的球聲。",choices:[["重新打造控球型投法",{contact:7,fielding:4,speed:-3},"你失去速度，卻學會讓每一球更有意義。"],["接受手術拚一次復出",{health:6,spirit:5,fame:3},"漫長復健後，你再次握住比賽用球。",.55],["開始指導年輕投手",{spirit:7,fame:4},"你在別人的進步裡，看見另一種延續。"]]},
  {icon:"👦",tag:"第五章 · 青少年球場",title:"十八號的小球迷",text:"一個孩子拿著你的舊背號，問怎樣才能不怕投壞球。",choices:[["告訴他失敗是投手的一部分",{spirit:6,fans:5000},"他點點頭，把下一球投進捕手手套。"],["親自教他投第一顆曲球",{fielding:4,fame:4,fans:3000},"球歪得很遠，你們卻一起笑了。"],["送他陪伴多年的舊手套",{spirit:5,fame:3},"有些故事，會從一只手套重新開始。"]]},
  {icon:"🌅",tag:"第五章 · 引退前夕",title:"最後一次先發",text:"球團讓你選擇對手。你選了阿拓所在的球隊——他已成為對面的打擊教練。",choices:[["用直球和青春告別",{speed:4,power:5,fame:7,health:-4},"最後一球不再最快，卻是你投過最坦然的一球。"],["投出高中決賽的指叉球",{fielding:5,spirit:6,fame:7},"阿拓在對面笑了。他知道這顆球等了很多年。"],["把先發機會讓給新人",{spirit:8,fame:5},"你在第一局後交棒，新的十八號接過了球。"]]},
  {icon:"🎤",tag:"第五章 · 滿場掌聲",title:"你留下了什麼？",text:"引退儀式上，主持人把麥克風交給你。球場安靜下來，等著你的最後一句話。",choices:[["謝謝每一個接過我球的人",{spirit:6,fame:6,fans:10000},"掌聲中，你最先看向那只熟悉的捕手手套。"],["棒球教會我，下一球永遠能重來",{spirit:8,fame:7},"這句話多年後仍寫在球場入口。"],["我還沒有離開，只是換個位置",{fielding:5,fame:5},"隔年春天，你以投手教練的身分回到球場。"]]},

  {icon:"🎓",tag:"第三章 · 大學球場",title:"重新打造投手身體",text:"進入大學後，木棒打者不再輕易被球速壓制。教練要你決定未來兩年的方向。",choices:[["強化下肢與核心",{power:5,health:5},"你開始擁有能撐過整季的身體。"],["鑽研指叉球與滑球",{fielding:7,contact:2,pitch:"指叉球"},"新的決勝球讓球探第一次把名字畫上紅圈。"],["追求突破一百五十公里",{speed:8,power:4,health:-5},"測速槍亮起驚人的數字，肩膀也承受更大負荷。",.58]]},
  {icon:"🌏",tag:"第三章 · 國際邀請賽",title:"第一次披上國家隊球衣",text:"滿場觀眾注視著胸前的隊名。你在重要國際賽被安排長中繼，必須守住一分領先。",choices:[["用伸卡球製造滾地球",{contact:5,fielding:5,fame:5,pitch:"伸卡球"},"連續三個滾地球，你讓世界注意到這顆沉重的球。"],["全力搶三振",{speed:5,power:5,fame:6,health:-4},"最快球速刷新，國外球探開始追蹤你。",.6],["相信捕手完整配球",{spirit:6,contact:4,fame:4},"你證明自己能在陌生舞台保持冷靜。"]]},
  {icon:"📓",tag:"第三章 · 梅花旗",title:"九局與十三次三振",text:"強敵把比賽拖進最後一局。你的用球數已經偏高，觀眾卻全站了起來。",choices:[["挑戰完投",{spirit:7,fame:7,health:-6},"最後一球揮空，你用完整九局寫下代表作。",.6],["交棒給牛棚",{health:5,spirit:3,fame:2},"你學會生涯不是只由一場完投組成。"],["改用省力的伸卡球",{contact:6,fielding:4,pitch:"伸卡球"},"打者不斷擊出無力滾地球，你保存體力完成比賽。"]]},
  {icon:"🔭",tag:"第三章 · 球探看台",title:"世界都來看你投球",text:"美國、日本與台灣職棒球探同時出現在看台。每個人開出的道路都不一樣。",choices:[["展示最成熟的完整配球",{contact:6,fielding:5,fame:5},"三地球團都留下正式評估。"],["展示最高天花板",{speed:7,power:5,fame:7,health:-4},"你讓最遠方的球探願意冒險。",.56],["先問清楚培養計畫",{spirit:6,health:3},"你不只想被簽下，更想知道如何走到最高層級。"]]},

  {icon:"✈️",tag:"第四章 · 合約桌前",title:"三條職業道路",text:"美職球團提供從新人聯盟出發的旅外合約；日職承諾細緻養成；中職則給你立即競爭一軍的機會。這次選擇會改變往後的生涯。",choices:[["挑戰美國職棒",{careerPath:"mlb",money:650,fame:5,spirit:4},"你收拾行李，從語言不通的新人聯盟開始。"],["投入日本職棒",{careerPath:"npb",money:520,contact:4,fielding:4},"你進入嚴謹的二軍體系，重新學習每個動作。"],["參加中華職棒選秀",{careerPath:"cpbl",money:420,fame:6,fans:3500},"選秀會喊出你的名字，家鄉球迷立刻有了期待。"]]},
  {icon:"🖊️",tag:"第四章 · 簽約交涉",title:"合約不只有簽約金",text:"經紀人提醒你：更高的錢、升級條款與出賽機會，不可能全部拿到。",choices:[["爭取最高簽約金",{money:700,spirit:-2},"數字很漂亮，但球團不再保證快速升級。"],["加入升級與一軍條款",{fame:3,spirit:4},"你把未來的機會寫進合約。"],["保留旅費與進修保障",{health:3,contact:3,money:180},"這份合約替漫長養成留了退路。"]]},
  {icon:"🗣️",tag:"第四章 · 離家前夜",title:"家人的餐桌",text:"機票和合約放在桌上。家人沒有勸你留下，只問你準備好失敗多久。",choices:[["我會走到最高層級",{spirit:7,fame:3},"這句承諾成為你在低潮時留下的理由。"],["設下三年檢查點",{contact:3,health:4},"夢想不再只是衝動，而是一個能調整的計畫。"],["帶著家鄉的舊手套出發",{spirit:5,fans:1200},"那只手套提醒你從哪裡開始。"]]},
  {icon:"🧳",tag:"第四章 · 報到日",title:"陌生休息室",text:"隊友、語言和食物都陌生，只有投手丘的距離沒有改變。",choices:[["主動向捕手學習暗號",{contact:5,spirit:3},"你比預期更快進入比賽節奏。"],["先用球威取得尊重",{power:6,speed:3,health:-3},"第一場牛棚練投讓所有人轉頭。",.62],["每天多學十個棒球用語",{spirit:4,fame:2},"你開始真正成為球隊的一員。"]]},

  {icon:"🚌",tag:"第五章 · 發展聯盟",title:"沒有掌聲的第六年",text:"長途巴士、廉價旅館與反覆升降。真正困難的不是輸球，而是不知道通知何時會來。",choices:[["建立完整投球日誌",{contact:6,fielding:4},"每天的小數據慢慢拼出升級道路。"],["向老投手學習保養",{health:7,spirit:3},"你開始明白能一直投，本身就是武器。"],["打電話告訴家人想放棄",{spirit:7,health:3},"說出口後，你反而知道自己還想再試一次。"]]},
  {icon:"🩺",tag:"第五章 · 傷兵名單",title:"肩關節的裂痕",text:"檢查顯示傷勢比預期嚴重。手術可能讓你整季報銷，也可能讓生涯重新開始。",choices:[["接受手術完整復健",{health:10,spirit:5,speed:-4},"一年沒有正式比賽，但你重新學會健康地投球。",.68],["保守治療繼續競爭",{fame:3,health:-9,power:-3},"你留在名單上，疼痛卻沒有離開。",.48],["暫停投球重練動作",{contact:6,fielding:5,health:5},"慢下來之後，你發現過去忽略的發力方式。"]]},
  {icon:"⚙️",tag:"第五章 · 投手實驗室",title:"一顆會下沉的球",text:"教練要你放棄追求純粹球速，改練能讓打者把球打進地面的新武器。",choices:[["全心開發伸卡球",{fielding:8,contact:5,pitch:"高速伸卡球"},"沉重而晚下墜的球，成為改變生涯的招牌。",.65],["保留四縫線搭配滑球",{speed:4,fielding:5,pitch:"滑球"},"你用速差和橫向位移創造新的壓制。"],["強化控球與滾地球配球",{contact:8,spirit:4},"你不再追逐每一次三振，而是追求最有效率的出局。"]]},
  {icon:"📱",tag:"第五章 · 凌晨電話",title:"上層球隊需要一名投手",text:"電話終於響起。教練只說：明天報到，你可能先發，也可能從牛棚等待。",choices:[["我隨時可以先發",{power:4,spirit:6,fame:5},"多年等待濃縮成一句回答。"],["接受任何投手角色",{contact:4,health:4,fame:3},"你把登上最高層級放在個人定位之前。"],["先確認身體狀態",{health:6,spirit:3},"你沒有讓期待蓋過身體發出的聲音。"]]},

  {icon:"🌃",tag:"第六章 · 一軍初登板",title:"最高舞台的第一球",text:"數萬人的呼吸壓向投手丘。從學生球場到今天，你等了比想像中更久。",choices:[["用招牌伸卡球搶好球",{contact:5,fielding:6,fame:7},"第一顆滾地球出局，世界終於安靜下來。"],["用最快直球正面迎戰",{speed:6,power:5,fame:8,health:-4},"測速槍與歡呼同時亮起。",.58],["讓捕手決定第一輪配球",{spirit:5,contact:5},"你把緊張拆成一顆又一顆能執行的球。"]]},
  {icon:"⚾",tag:"第六章 · 生涯首勝",title:"最後一個出局數",text:"你帶著領先投到第七局。壘上有人，總教練走上投手丘，問你還能不能解決下一位打者。",choices:[["把球留給我",{spirit:7,fame:8,health:-4},"滾地球雙殺，你拿下最高層級的第一勝。",.64],["相信牛棚完成比賽",{health:5,spirit:3,fame:5},"你在休息室看著終結者守住勝利。"],["改投高風險三振球",{fielding:6,fame:7,health:-3},"球棒從指叉球上方掠過，全場起立。",.57]]},
  {icon:"🧠",tag:"第六章 · 球探報告",title:"聯盟開始破解你",text:"打者不再追打低球。你必須在對手完成調整前，再次改變自己。",choices:[["增加反方向滑球",{fielding:7,pitch:"反向滑球"},"打者的視線再次被拉開。"],["把伸卡球投得更靠近手邊",{power:5,contact:4},"斷棒聲成為新的招牌。",.62],["用數據重新設計配球",{contact:7,spirit:4},"你開始用每位打者不同的弱點取勝。"]]},
  {icon:"🏟️",tag:"第六章 · 季後賽",title:"城市把希望交給你",text:"系列賽第一戰，你被交付先發。這一次，故鄉也在清晨守著轉播。",choices:[["沉著製造滾地球",{contact:6,fielding:5,fame:9,fans:10000},"七局只失一分，你拿下重要勝投。"],["追求完封",{power:7,spirit:6,fame:11,health:-7},"最後一局全場起立，你完成生涯代表作。",.52],["依照用球數交棒",{health:5,fame:6,spirit:4},"你的球隊走得比個人紀錄更遠。"]]},

  {icon:"👑",tag:"第七章 · 王牌球季",title:"二十勝之前",text:"你站在聯盟勝投榜最前方。每一次先發都牽動兩座城市，但身體開始恢復得更慢。",choices:[["挑戰年度勝投王",{fame:12,fans:18000,spirit:7,health:-8},"十九勝讓你的名字進入歷史討論。",.58],["控制局數保持健康",{health:8,contact:4,fame:6},"你放棄一點耀眼，換取更長的生涯。"],["把重點放在季後賽",{spirit:7,fielding:4,fame:7},"你把最好的球留給最重要的十月。"]]},
  {icon:"📰",tag:"第七章 · 全城焦點",title:"沉默的王牌",text:"媒體每天等待你的話。代言與訪問湧入，下一場先發卻不會因此變簡單。",choices:[["維持低調只談比賽",{spirit:6,contact:4,fame:5},"安靜成為你的標誌。"],["接受國際品牌代言",{money:1600,fame:8,spirit:-2},"你的臉出現在兩座城市的街頭。"],["把曝光留給台灣棒球",{fans:15000,fame:9,spirit:5},"更多孩子開始在清晨看棒球。"]]},
  {icon:"💥",tag:"第七章 · 客場跑壘",title:"意外的一步",text:"一次不熟悉的跑壘讓腳踝劇烈扭轉。球隊醫師衝上場，你知道這不是普通疼痛。",choices:[["立即停止比賽接受檢查",{health:3,spirit:3,fame:-1},"你錯過剩餘球季，卻避免傷勢擴大。"],["嘗試繼續比賽",{fame:6,health:-14,speed:-5},"你完成這一局，生涯卻從此轉向。",.42],["接受完整復健並調整投法",{health:8,contact:5,speed:-4},"復健漫長，但你開始準備另一種回歸。"]]},
  {icon:"📄",tag:"第七章 · 合約冬天",title:"球隊沒有保留你",text:"曾經把你視為王牌的球隊選擇向前走。桌上只剩小聯盟約、測試會與回家的機票。",choices:[["接受小聯盟合約重新證明",{spirit:8,health:3,fame:-3},"你再次搭上巴士，這次沒有人保證終點。"],["轉戰另一個職業聯盟",{careerPath:"return",fame:4,fans:5000,health:4},"換一個國家，投手丘仍是同樣距離。"],["先回家完整休養",{health:10,spirit:5},"離開聚光燈後，你重新確認自己仍想投球。"]]},

  {icon:"🌱",tag:"第八章 · 無名球場",title:"從零開始的測試會",text:"沒有保證合約，只有幾十名同樣不願放棄的投手。測速槍再次架起來。",choices:[["展示健康與穩定",{contact:6,health:5,spirit:4},"你沒有投出最快球，卻讓球探看到能用的投手。"],["催出最後的極速",{speed:7,power:5,health:-7,fame:3},"那一球讓所有人抬頭。",.48],["展示全新的伸卡球",{fielding:7,contact:5,pitch:"復活伸卡球"},"球在本壘前沉下，你得到一份邀請。",.62]]},
  {icon:"🔥",tag:"第八章 · 牛棚重生",title:"從先發改到牛棚",text:"教練說你不必再投七局，只要用最好的球解決眼前打者。",choices:[["接受中繼角色",{power:5,health:5,spirit:4},"縮短任務讓球威重新出現。"],["挑戰終結者",{speed:5,spirit:7,fame:5},"第九局的壓力喚醒你的競爭心。",.56],["堅持爭取先發",{contact:5,health:-4,fame:3},"道路更窄，但你仍想用自己的方式回來。"]]},
  {icon:"📞",tag:"第八章 · 再次來電",title:"最高舞台又需要你",text:"多年後，電話再次在深夜響起。這次你很清楚，機會不會永遠等待。",choices:[["立刻報到",{spirit:8,fame:7,fans:8000},"你再次走進那扇門，腳步比第一次更平靜。"],["確認角色與使用方式",{contact:4,health:5,spirit:4},"成熟讓你知道如何保護得來不易的機會。"],["把消息先告訴家人",{spirit:6,fans:5000},"電話兩端沉默了很久，然後一起笑了。"]]},
  {icon:"🌅",tag:"第八章 · 最後一局",title:"你要如何離開投手丘？",text:"最後一場比賽結束後，球場沒有立刻關燈。你回頭看著走過的每一層級。",choices:[["再投一季，直到沒有人要我",{spirit:8,fame:5,health:-6},"你把每次登板都當成額外獲得的禮物。",.48],["回到故鄉成為投手教練",{fielding:7,fame:7,fans:10000},"你把傷病、失敗與復出的知識交給下一代。"],["在最高舞台正式引退",{fame:10,spirit:7,fans:15000},"掌聲穿過球場，也穿過你漫長的職業人生。"]]}
];
const storyEvents=[...events.slice(0,8),...events.slice(20)];
function applyStoryConfig(){
  const cfg=window.STORY_CONFIG||{};
  Object.entries(cfg.chapterOverrides||{}).forEach(([n,data])=>Object.assign(chapters[+n-1]||{},data));
  Object.entries(cfg.eventOverrides||{}).forEach(([id,data])=>{
    const [chapter,turn]=id.split("-").map(Number), target=storyEvents[(chapter-1)*4+turn-1]; if(!target)return;
    ["tag","title","text"].forEach(k=>{if(data[k]!==undefined)target[k]=data[k];});
    if(Array.isArray(data.choices))target.choices=data.choices.map(c=>[c.text,c.effects||{},c.result||"你的選擇改變了生涯。",c.chance]);
  });
}
applyStoryConfig();
const pathNames={mlb:"美國職棒",npb:"日本職棒",cpbl:"中華職棒",amateur:"獨立／業餘聯盟",return:"職業復出聯盟"};
function currentLeague(){return pathNames[state.careerPath]||"職業棒球";}
const lifeEvents=[
  {min:2,requires:"single",title:"球場邊的相遇",text:"一位常在看台替你記錄投球的人，開始出現在訓練結束後。關係讓生活多了一個重心，也可能改變你的身體狀態。",choices:[["認真交往並維持訓練",{relationship:"dating",spirit:6,health:4,luck:3},"穩定的陪伴讓你更有力量。"],["把約會變成戶外體能活動",{relationship:"dating",power:5,health:5,spirit:2},"你變得更強壯，但休息時間也變少。",.72],["暫時專注棒球",{relationship:"single",contact:3,spirit:-3},"你守住訓練節奏，也錯過一段可能的關係。"]]},
  {min:4,requires:"dating",title:"遠距離的考驗",text:"升級與客場讓你們聚少離多。你必須決定如何分配有限的時間。",choices:[["固定安排相處與溝通",{spirit:6,health:3,luck:2},"生活變得穩定，低潮時有人接住你。"],["把所有時間留給球隊",{power:4,contact:4,spirit:-5},"能力進步，關係卻留下裂痕。"],["疲憊中勉強兩邊兼顧",{health:-7,power:3,spirit:-2},"睡眠不足讓身體發出警告。",.56]]},
  {min:4,requires:"dating",title:"結婚的選擇",text:"多年陪伴後，對方問你：不停搬家與升降的職業人生裡，是否願意一起建立家庭？",choices:[["正式求婚並共同規劃",{relationship:"married",spirit:9,health:4,luck:4,money:-180},"婚姻成為漫長職業生涯裡穩定的基地。"],["等站穩一軍再結婚",{relationship:"dating",contact:4,spirit:-3,luck:-2},"你選擇等待，承諾也因此承受壓力。"],["和平分開",{relationship:"single",spirit:-7,health:-3,power:4},"你把難過轉成訓練動力，卻需要時間恢復。"]]},
  {min:5,requires:"married",title:"感情界線的誘惑",text:"成名後，一段不該靠近的關係向你伸手。這可能傷害婚姻、名聲與身體，也可能只是一次及時停下的考驗。",choices:[["守住界線並離開",{spirit:7,luck:2},"你保住重要的關係，也更理解名聲的代價。"],["隱瞞並繼續來往",{power:4,health:-9,spirit:-8,luck:-7,fame:-5},"失眠與壓力侵蝕狀態，風聲也傳進媒體。",.42],["坦白並承擔後果",{spirit:4,health:-3,fame:-3,luck:-2},"關係受到傷害，但你停止讓秘密控制生活。"]]},
  {min:3,title:"清晨的私人教練",text:"一次偶遇讓你認識退役投手。他願意免費看你投球一週，卻不保證方法適合你。",choices:[["學習新的發力方式",{power:6,health:3,luck:2},"動作更有效率，球的尾勁也更沉。",.68],["只請教身體保養",{health:7,spirit:3},"你得到能多投幾年的知識。"],["相信原本團隊",{contact:4,spirit:3},"你沒有冒險，但深化既有系統。"]]}
];
const originOpportunities={
  "18":{title:"父母買下球隊",text:"家族直接取得一支職業球隊的經營權，你可以不用等待選秀就獲得合約。但名單位置能買到，球場表現買不到。",choices:[["接受直接職業合約",{careerPath:"cpbl",money:1200,fame:5,spirit:-3},"你直接進入職業體系，所有人都在等著看你是否配得上。"],["拒絕特權參加正式選秀",{spirit:8,fame:7,luck:2},"你選擇讓球探報告決定自己的順位。"],["接受合約但從二軍開始",{contact:4,health:3,spirit:5},"你使用資源，卻不跳過養成。"]]},
  "21":{title:"測速槍前的一球",text:"全國球探只來看你投一球。你天生的球威能打開大門，也可能讓身體付出代價。",choices:[["全力催出最快一球",{power:8,speed:5,fame:6,health:-5},"球威讓整排球探同時抬頭。",.62],["控制力量投進邊角",{contact:6,power:3},"你證明自己不只會用蠻力。"],["拒絕表演專心比賽",{spirit:6,health:3},"你把天賦留給真正的打者。"]]},
  "36":{title:"四種球路的選擇",text:"教練發現你能自然掌握多種握法，願意讓你提早建立完整球種庫。",choices:[["學習高速伸卡球",{pitch:"高速伸卡球",fielding:5},"你得到一顆能製造滾地球的武器。"],["學習指叉球",{pitch:"指叉球",fielding:6,health:-2},"決勝球在本壘前突然消失。"],["先把現有球種練精",{contact:6,fielding:4},"多不等於雜，你開始懂得如何配球。"]]},
  "99":{title:"家族防護團隊",text:"家中熟識的防護員替你建立長期保養計畫，讓你比同齡投手更懂得聽見身體。",choices:[["完整執行保養計畫",{health:10,contact:3},"你沒有每天全力投，狀態反而更穩。"],["加入重量訓練",{health:5,power:6},"身體更能承受職業強度。"],["把資源分享給隊友",{spirit:6,fame:5,health:4},"整支球隊一起變得更健康。"]]},
  "55":{title:"泥地裡的第九局",text:"球隊落後、觀眾離場，教練問還有誰願意投。你從資源最少的地方站了出來。",choices:[["接下剩餘所有局數",{spirit:9,power:4,health:-4},"逆境讓你比任何時候都更專注。",.66],["帶著隊友一起守住比賽",{spirit:8,contact:4,fame:4},"你的韌性傳給整支球隊。"],["保存身體等待下一戰",{health:6,spirit:3},"堅持也包括知道何時停下。"]]},
  "77":{title:"被雨救回的比賽",text:"你投得最糟的一天，暴雨突然中斷比賽。規則讓先前失分沒有成為正式結果。",choices:[["利用暫停修正動作",{luck:7,contact:5,spirit:4},"恢復比賽後，你像換了一個人。"],["更換新的決勝球",{luck:5,fielding:5,pitch:"幸運變速球"},"臨時決定成為意外武器。"],["承認只是運氣並繼續練",{spirit:6,health:3},"幸運替你爭取時間，努力決定下一次。"]]},
  "88":{title:"經紀人的人情局",text:"你發現球隊高層正在尋找能救急的投手。一次精心安排的見面，可能讓自己提前進入名單。",choices:[["展示數據與準備程度",{luck:6,contact:5,fame:4},"布局讓真正的能力被正確的人看見。"],["用人情換取登板機會",{luck:8,fame:3,spirit:-4},"你得到機會，也欠下一份人情。",.65],["替隊友牽線",{spirit:6,fame:6,luck:3},"你沒有立刻獲利，卻建立更長久的人脈。"]]}
};
function normalizeConfiguredEvent(e){return {...e,choices:(e.choices||[]).map(c=>Array.isArray(c)?c:[c.text,c.effects||{},c.result||"這次機緣改變了你的人生。",c.chance])};}
function applyOpportunityConfig(){const cfg=window.STORY_CONFIG||{};(cfg.extraLifeEvents||[]).forEach(e=>lifeEvents.push(normalizeConfiguredEvent(e)));Object.entries(cfg.originOpportunityOverrides||{}).forEach(([id,e])=>originOpportunities[id]=normalizeConfiguredEvent(e));}
applyOpportunityConfig();

let state;
let soundOn = true;
const rng = Math.random;

function beep(freq=420) {
  if (!soundOn) return;
  try { const ctx = new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.value=freq; g.gain.setValueAtTime(.035,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12); o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+.12); } catch {}
}

function newState() {
  if(!selectedBird) selectedBird=randomOrigin();
  const origin=birdRoster[selectedBird], stats={power:30,contact:28,speed:32,fielding:24,spirit:35,health:72,luck:35};
  Object.entries(origin.stats||{}).forEach(([k,v])=>stats[k]+=v);
  return { name:$("#playerName").value.trim()||"無名小將", position:"投手", bird:selectedBird, origin:selectedBird, chapter:0, turn:0, chapterRounds:rollChapterRounds(stats.luck), used:[], usedLifeEvents:[], pitches:["四縫線直球",...(origin.pitch?[origin.pitch]:[]),...(origin.pitches||[])], special:origin.special?[origin.special]:[], stats, fame:origin.fame||0, money:origin.money||0, fans:origin.fans||12, timeline:[`出生背景：${origin.label}`,"開始國中養成"] };
}

function rollChapterRounds(luck=35){const extraChance=Math.min(.62,.18+Math.max(0,luck-35)/105);return 4+(rng()<extraChance?1:0)+(rng()<extraChance*.28?1:0);}

function startGame(customState) {
  if(!customState) selectedBird=randomOrigin();
  state = customState || newState();
  state.position="投手"; state.pitches=state.pitches||["四縫線直球"]; state.bird=birdRoster[state.bird]?state.bird:"18"; state.origin=state.origin||state.bird; state.special=state.special||[]; state.stats.luck=state.stats.luck??35; state.usedLifeEvents=state.usedLifeEvents||[]; state.relationship=state.relationship||"single"; state.chapterRounds=state.chapterRounds||rollChapterRounds(state.stats.luck);
  $("#startScreen").classList.add("hidden"); $("#endingScreen").classList.add("hidden"); $("#gameScreen").classList.remove("hidden");
  save(); render();
  if(state.phase==="match") showMatch(true); else if(state.phase==="skills") showSkills(); else showEvent();
}

function showEvent() {
  state.current=state.chapter*4+state.turn; const e=selectCurrentEvent();
  const agingNotice=state.pendingAging?`${state.pendingAging}\n\n`:"";state.pendingAging=null;
  $("#eventVisual").style.backgroundImage=`linear-gradient(180deg,rgba(4,46,105,.08),rgba(4,35,79,.22)),url('${chapterBackgrounds[state.chapter]}')`; $("#eventKicker").textContent=e.tag||`${['一','二','三','四','五','六','七','八'][state.chapter]}章 · 人生機緣`; $("#eventTitle").textContent=e.title; $("#eventText").textContent=agingNotice+(state.turn===0&&!state.activeEvent?`${chapters[state.chapter].intro}\n\n`:"")+e.text;
  $("#resultBox").classList.add("hidden"); $("#nextBtn").classList.add("hidden");
  $("#choices").innerHTML=e.choices.map((c,i)=>`<button class="choice" data-i="${i}"><span class="choice-letter">${String.fromCharCode(65+i)}</span><span>${c[0]}</span></button>`).join("");
  document.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>choose(+btn.dataset.i)));
  save();
}

function selectCurrentEvent(){
  if(state.activeEvent)return state.activeEvent;
  const origin=birdRoster[state.origin], special=originOpportunities[state.origin];
  if(special&&!state.originOpportunitySeen&&state.chapter>=origin.opportunityChapter&&state.turn===0){state.originOpportunitySeen=true;state.activeEvent={...special,tag:`專屬機緣 · ${origin.label}`,isBonus:true,id:`origin-${state.origin}`};return state.activeEvent;}
  if(state.chapter===3&&!state.careerPath)return careerOfferEvent();
  const eligible=lifeEvents.map((e,i)=>({e,i})).filter(x=>x.e.min<=state.chapter&&(!x.e.requires||x.e.requires===state.relationship)&&!state.usedLifeEvents.includes(x.i));
  const luckBoost=Math.max(0,(state.stats.luck-35)/500);
  if(eligible.length&&rng()<Math.min(.26,.15+luckBoost)){const pick=eligible[Math.floor(rng()*eligible.length)];state.usedLifeEvents.push(pick.i);state.activeEvent={...pick.e,tag:"15% 偶發機緣",isBonus:true,id:`life-${pick.i}`};return state.activeEvent;}
  if(state.turn>=4){const extra=extraRoundEvents[(state.chapter+state.turn)%extraRoundEvents.length];return {...extra,tag:`幸運加開 · 額外第 ${state.turn-3} 回合`};}
  return storyEvents[state.current];
}

function careerOfferEvent(){
  const s=state.stats,year=state.turn+1,hiddenLuck=(s.luck-35)*.22,overall=(s.power+s.contact+s.speed+s.fielding)/4;
  const scores={
    mlb:s.power*.25+s.speed*.3+s.fielding*.2+s.contact*.08+state.fame*.45+Math.log10(state.fans+10)*3+hiddenLuck,
    npb:s.contact*.3+s.fielding*.28+s.speed*.12+s.health*.08+state.fame*.38+state.pitches.length*2.2+hiddenLuck,
    cpbl:overall*.62+state.fame*.5+Math.log10(state.fans+10)*4+Math.min(6,state.money/500)+hiddenLuck
  };
  const thresholds={mlb:58-year*2.2,npb:53-year*2,cpbl:47-year*1.7},offers=[];
  if(scores.mlb>=thresholds.mlb)offers.push(["接受美國職棒球團邀請",{careerPath:"mlb",money:650,fame:5,spirit:4},"球探報告通過審核，你從發展聯盟開始旅外生涯。"]) ;
  if(scores.npb>=thresholds.npb)offers.push(["接受日本職棒球團邀請",{careerPath:"npb",money:520,contact:4,fielding:4},"球團看中你的完成度，邀請你進入二軍養成體系。"]) ;
  if(scores.cpbl>=thresholds.cpbl)offers.push(["投入中華職棒選秀",{careerPath:"cpbl",money:420,fame:6,fans:3500},"國內球隊把你列入選秀名單，家鄉球迷開始期待。"]) ;
  const continueChoices=[
    ["留在大學再磨練一年",{contact:5,fielding:4,spirit:3,health:-2},"你暫緩進入職業，下一年將帶著更完整的投球內容重新接受評估。"],
    ["加入國家培訓隊增加曝光",{fame:5,fans:1200,power:3,health:-4},"更多球探看見你，但密集賽程也增加身體負擔。",.64],
    ["休養並重整投球機制",{health:8,contact:4,speed:-1},"你犧牲一年的曝光，換取更健康而穩定的身體。"]
  ];
  if(year>=4){continueChoices.splice(0,continueChoices.length,["畢業後加入獨立聯盟",{careerPath:"amateur",spirit:6,health:4,fame:2},"正式選秀沒有結果，你從沒有保證的舞台累積實戰。"],["加入業餘成棒隊等待補選",{careerPath:"amateur",contact:5,health:3,fame:3},"你一邊工作一邊比賽，繼續等待球探回頭。"],["轉任培訓隊投手繼續養成",{careerPath:"amateur",fielding:5,spirit:5},"你延長養成期，保留再次挑戰職業的可能。"]);}
  const report=offers.length?`球探評估完成：今年收到 ${offers.length} 份職業機會。未出現的聯盟代表目前尚未達到邀請條件。`:`球探評估完成：今年沒有球隊提出正式邀請。你只能繼續養成，明年再接受評估。`;
  return {tag:`第四章 · 第 ${year} 年評估`,title:offers.length?"球隊的邀請函":"選秀會沒有喊到名字",text:report,choices:offers.length?[...offers,continueChoices[0]]:continueChoices};
}

function currentStoryEvent(){return state.activeEvent||storyEvents[state.current];}

function choose(i) {
  const readingPosition = window.scrollY;
  const event=currentStoryEvent(),c=event.choices[i], effects={...c[1]}, origin=birdRoster[state.origin]; let success=true;
  const keyMoment=/滿壘|決賽|選秀|初登板|冠軍|最後|危機/.test(event.title+(event.tag||""));
  if(c[3]!==undefined) { const spiritBonus=(state.stats.spirit-35)/200, hiddenLuck=(state.stats.luck-35)/240, luckBonus=(origin.luck||0)+hiddenLuck+(origin.scout&&/球探|選秀/.test(event.title)?origin.scout:0); success=rng()<Math.min(.96,c[3]+spiritBonus+luckBonus); if(!success) Object.keys(effects).forEach(k=>{ effects[k]=["pitch","careerPath","relationship"].includes(k)?null:Math.round(effects[k]*-.45); }); }
  if(success) Object.keys(effects).forEach(k=>{ if(k in state.stats&&effects[k]>0) effects[k]=Math.round(effects[k]*(origin.training||1)*(origin.adversity&&state.chapter<3?origin.adversity:1)); });
  if(success&&origin.business) { if(effects.money>0) effects.money=Math.round(effects.money*origin.business); if(effects.fame<0) effects.fame=Math.ceil(effects.fame*.4); }
  if(effects.money<0&&origin.cost) effects.money=Math.round(effects.money*origin.cost);
  if(success&&origin.luck&&keyMoment) { effects.fame=(effects.fame||0)+3; effects.spirit=(effects.spirit||0)+2; }
  const parts=[];
  for(const [k,v] of Object.entries(effects)) {
    if(k==="pitch") { if(v&&!state.pitches.includes(v)) state.pitches.push(v); if(v) parts.push(`<span class="delta">習得球種：${v}</span>`); continue; }
    if(k==="ability") { if(v&&!state.special.includes(v))state.special.push(v);if(v)parts.push(`<span class="delta">獲得特殊能力：${v}</span>`);continue; }
    if(k==="careerPath") { if(v){state.careerPath=v;parts.push(`<span class="delta">職業道路：${currentLeague()}</span>`);state.timeline.push(`加盟${currentLeague()}`);} continue; }
    if(k==="relationship") { if(v)state.relationship=v; continue; }
    if(k in state.stats) state.stats[k]=Math.max(0,Math.min(origin.cap||99,state.stats[k]+v)); else state[k]=Math.max(0,(state[k]||0)+v);
    if(!['spirit','health','luck'].includes(k))parts.push(`<span class="delta ${v<0?'negative':''}">${statLabels[k]||({fame:'名聲',money:'資金',fans:'粉絲'}[k])} ${v>0?'+':''}${v}</span>`);
  }
  const setback=rollSetback("story");
  $("#choices").innerHTML=""; $("#resultBox").innerHTML=`<strong>${success?'結果':'事與願違'}</strong><br>${success?c[2]:"結果沒有如你預期，但失敗也成了往後的養分。"}<br>${parts.join("")}${setback?`<div class="setback"><b>⚠ 負面事件｜${setback.title}</b><br>${setback.text}</div>`:""}`; $("#resultBox").classList.remove("hidden"); $("#nextBtn").classList.remove("hidden");
  if(state.activeEvent)state.timeline.push(`人生機緣：${event.title}`); else if((effects.fame||0)>=6 || (effects.spirit||0)>=6) { const mark=event.title; if(!state.timeline.includes(mark)) state.timeline.push(mark); }
  beep(success?520:220); render(); save();
  requestAnimationFrame(()=>window.scrollTo({top:readingPosition,behavior:"auto"}));
}

function applyStatLoss(loss) {
  let visible=false; for(const [k,v] of Object.entries(loss)){state.stats[k]=Math.max(0,state.stats[k]-v);if(!['spirit','health','luck'].includes(k))visible=true;} return visible?"可見能力與隱藏狀態都受到影響。":"你的隱藏狀態受到影響。";
}
function rollSetback(context="story") {
  const origin=birdRoster[state.origin], healthRisk=Math.max(0,(70-state.stats.health)/230), workload=context==="match"?.08:0;
  let chance=.18+healthRisk+workload-(origin.adversity?.045:0)-(origin.luck?.04:0)-Math.max(-.04,(state.stats.luck-35)/500); if(rng()>chance)return null;
  const pool=[
    ()=>({title:"疲勞累積",text:`連續訓練讓動作走樣。${applyStatLoss({health:4,power:2})}`}),
    ()=>({title:"手指起水泡",text:`放球點受到影響。${applyStatLoss({contact:4,health:2})}`}),
    ()=>({title:"投球低潮",text:`你突然找不到原本的節奏。${applyStatLoss({spirit:4,fielding:3})}`}),
    ()=>({title:"球探評價下修",text:`這段表現被記進報告。名聲 −3`,meta:state.fame=Math.max(0,state.fame-3)}),
    ()=>{const removable=state.pitches.filter(p=>p!=="四縫線直球");if(!removable.length)return {title:"球感消失",text:`暫時失去變化球手感。${applyStatLoss({fielding:5})}`};const p=removable[Math.floor(rng()*removable.length)];state.pitches=state.pitches.filter(x=>x!==p);return {title:"忘記球種",text:`長期沒有掌握 ${p} 的手感，球種庫失去「${p}」。`};},
    ()=>{const severe=rng()<Math.max(.12,(65-state.stats.health)/100);return severe?{title:"肩肘傷勢",text:`你必須面對漫長復健。${applyStatLoss({health:12,speed:5,power:4})}`}:{title:"輕微拉傷",text:`身體發出警告。${applyStatLoss({health:7,speed:2})}`};}
  ];
  const event=pool[Math.floor(rng()*pool.length)](); state.timeline.push(`負面事件：${event.title}`); return event;
}

function nextTurn() {
  if(state.activeEvent){state.activeEvent=null;if(state.chapter===3&&state.turn===0&&state.careerPath)state.turn=1;render();showEvent();beep(440);return;}
  state.turn++;
  if(state.turn>=state.chapterRounds) { state.turn=state.chapterRounds; return showMatch(); }
  const readingPosition=window.scrollY;
  render(); showEvent();
  requestAnimationFrame(()=>window.scrollTo({top:readingPosition,behavior:"auto"}));
  beep(390);
}

function assignPitchingRole(){
  const health=state.stats.health,spirit=state.stats.spirit,luck=state.stats.luck,roll=rng()+(health-70)/115+(spirit-45)/350+(luck-45)/600;let role,total;
  if(roll>.62){role="先發投手";total=health>=88?7:health>=75?6:health>=62?5:4;}
  else if(roll>.16){role="中繼投手";total=health>=78?3:2;}
  else{role="終結者";total=1;}
  if(health<48){role=rng()<.65?"終結者":"中繼投手";total=1;}
  else if(health<60)total=Math.min(total,2);
  const startInning=role==="先發投手"?1:role==="終結者"?9:4+Math.floor(rng()*4);total=Math.min(total,10-startInning);
  const entersMidInning=role!=="先發投手"&&rng()<.58,entryOuts=entersMidInning?Math.floor(rng()*3):0,entryBatter=entersMidInning?2+Math.floor(rng()*4):1;
  const runners=entersMidInning?[rng()<.48,rng()<.27,rng()<.13]:[false,false,false];
  return {role,total,startInning,entryOuts,entryBatter,runners};
}
function baseSituation(runners=[]){const bases=[];if(runners[0])bases.push("一壘");if(runners[1])bases.push("二壘");if(runners[2])bases.push("三壘");return bases.length?`${bases.join("、")}有人`:"壘上無人";}
function pitchProfile(pitch) {
  const s=state.stats, fast=/直球|火球/.test(pitch), elite=/160km|火球入魂/.test(pitch), breaker=/曲球|滑球|指叉|SFF|變速|切球/.test(pitch);
  const quality=s.power*.24+s.speed*.27+s.fielding*.29+(fast?s.power*.1+s.speed*.08:s.fielding*.18)+s.contact*.02;
  let hit=.49-quality*.00145, k=.075+quality*.0018, bb=.39-s.contact*.0035;
  if(elite){hit-=.035;k+=.105;bb+=.045;} else if(/指叉|SFF/.test(pitch)){hit-=.065;k+=.075;bb+=.085;} else if(/滑球|曲球/.test(pitch)){hit-=.055;k+=.055;bb+=.075;} else if(/變速/.test(pitch)){hit-=.06;k+=.04;bb+=.065;} else if(/伸卡|二縫線|切球/.test(pitch)){hit-=.035;k-=.015;bb+=.035;} else if(/四縫線/.test(pitch)){hit+=.085;k+=.018;bb-=.04;} else if(fast){hit+=.035;k+=.018;}
  return {quality,hit:Math.max(.21,Math.min(.56,hit)),k:Math.max(.07,Math.min(.44,k)),bb:Math.max(.14,Math.min(.46,bb)),breaker};
}
function showMatch(resume=false) {
  state.phase="match";
  if(!resume||!state.match){const assignment=assignPitchingRole(),role=assignment.role,total=assignment.total,entry=`第 ${assignment.startInning} 局上、第 ${assignment.entryBatter} 位打者，${assignment.entryOuts} 出局、${baseSituation(assignment.runners)}`;state.match={role,total,startInning:assignment.startInning,inning:1,runs:0,scoreless:0,team:role==="終結者"?3:role==="中繼投手"?2:0,opp:role==="終結者"?2:role==="中繼投手"?2:0,outs:0,hits:0,walks:0,strikeouts:0,batters:0,inningStartOuts:assignment.entryOuts,batter:newBatterState({outs:assignment.entryOuts,runners:assignment.runners,batters:assignment.entryBatter-1}),log:[`賽前任務｜${entry}時接替登板，擔任${role}，預定投 ${total} 局。`]};}
  const {role,total}=state.match;
  $("#eventCard").classList.add("hidden"); $("#skillCard").classList.add("hidden"); $("#matchCard").classList.remove("hidden");
  $("#matchRole").textContent=role; $("#matchTitle").textContent=`${chapters[state.chapter].name} · 章末正式比賽`; renderMatch(); save();
}
function renderMatch() {
  const m=state.match,gameInning=(m.startInning||1)+m.inning-1; $("#teamRuns").textContent=m.team; $("#oppRuns").textContent=m.opp; $("#inningLabel").textContent=`${m.role} · 第 ${gameInning} 局上 · 任務 ${m.inning} / ${m.total} 局`;
  if(!m.batter){m.inningStartOuts=0;m.batter=newBatterState();}
  $("#matchPrompt").textContent=m.inning>m.total?"投球任務完成":`第 ${gameInning} 局上｜第 ${m.batter.batters} 位打者｜${m.batter.outs} 出局｜${m.batter.balls} 壞 ${m.batter.strikes} 好｜${baseSituation(m.batter.runners)}`;
  $("#matchStatus").textContent=m.inning>m.total?`你完成 ${m.total} 局投球，失 ${m.runs} 分。`:`${m.batter.name}：${m.batter.description}。三好球三振、四壞球保送，打者也可能提前擊球。`;
  $("#pitchChoices").innerHTML=m.inning>m.total?"":state.pitches.map(p=>{const x=livePitchRisk(p,m.batter,m);return `<button class="pitch-choice" data-pitch="${p}"><b>${p}</b><small>本球預估被打擊率 <strong>${x.hit.toFixed(3).replace(/^0/,"")}</strong></small><em>${x.note}</em></button>`}).join("");
  document.querySelectorAll(".pitch-choice").forEach(b=>b.addEventListener("click",()=>pitchBall(b.dataset.pitch)));
  $("#matchLog").innerHTML=m.log.slice(-5).map(x=>`<p>${x.replace(/\n/g,"<br>")}</p>`).join(""); $("#nextInningBtn").classList.add("hidden");
}
function newBatterState(previous={}){
  const types=[
    {name:"中心強打者",contact:.105,patience:.015,fast:.045,description:"揮棒破壞力很強，直球進甜蜜點會很危險"},
    {name:"選球型打者",contact:-.01,patience:.105,description:"不容易追打，會耐心等到投手先投進好球"},
    {name:"快速球獵人",contact:.035,fast:.105,breaking:-.025,description:"擅長咬住快速球，但對大幅度變化較不舒服"},
    {name:"變化球高手",contact:.025,fast:-.02,breaking:.1,description:"能等變化球進來，直球反而可能讓他慢半拍"},
    {name:"積極型新人",contact:-.045,patience:-.055,description:"容易出棒，可能被三振，也可能第一球就打出去"},
    {name:"纏鬥型打者",contact:.04,patience:.035,foul:.09,description:"兩好球後很難解決，常把邊角球破壞成界外"},
    {name:"低潮中的打者",contact:-.075,patience:.005,description:"最近手感低迷，但失投仍會受到懲罰"}
  ];
  const type=types[Math.floor(rng()*types.length)],dailyForm=(rng()-.5)*.08;
  return {balls:0,strikes:0,outs:previous.outs||0,runners:previous.runners||[false,false,false],runs:previous.runs||0,hits:previous.hits||0,walks:previous.walks||0,ks:previous.ks||0,batters:(previous.batters||0)+1,pitches:previous.pitches||0,dailyForm,...type};
}
function livePitchRisk(pitch,b,m){
  const x=pitchProfile(pitch),fast=/四縫線|直球|火球/.test(pitch),breaking=/曲球|滑球|指叉|SFF|變速|伸卡|切球/.test(pitch),fatigue=(m.inning-1)*.012+(b.batters-1)*.003;
  const hittersCount=(b.balls>=2&&b.strikes<2?.045:0)+(b.balls===3&&b.strikes===1?.035:0),pitchersCount=b.strikes===2&&b.balls<3?-.055:0,fullCount=b.balls===3&&b.strikes===2?.018:0,count=hittersCount+pitchersCount+fullCount;
  const matchup=fast?(b.fast||0):breaking?(b.breaking||0):0,hidden=(50-state.stats.spirit)/900-(state.stats.luck-35)/1300;
  const healthPenalty=Math.max(0,(70-state.stats.health)/450),hit=Math.max(.19,Math.min(.64,x.hit+b.contact+(b.dailyForm||0)+matchup+fatigue+count+hidden+healthPenalty));
  const situation=b.balls===3&&b.strikes===2?"滿球數":hittersCount?"打者有利球數":pitchersCount?"投手有利球數":"球數平衡";
  return {hit,ball:Math.max(.14,Math.min(.66,x.bb+(b.patience||0)+(breaking?.08:fast?-.015:0)+fatigue+healthPenalty+(b.balls===3?.055:0))),miss:x.k-(b.contact||0)*.35,note:`${b.name} · ${situation}`,description:b.description};
}
function pitchComment(message,b){
  const pick=a=>a[Math.floor(rng()*a.length)];
  if(/雙殺/.test(message))return pick(["游擊手大喊：『二壘！再傳一壘！』","教練握拳：『就是這顆，讓他打在地上！』"]);
  if(/三振/.test(message))return pick(["捕手把球握在手裡：『他的揮棒已經跟不上了。』","休息區傳來喊聲：『漂亮！再一個！』","打者站在原地，回頭看了一眼主審。"]);
  if(/保送/.test(message))return pick(["教練在場邊比出穩住的手勢：『下一位重新開始。』","捕手走向投手丘：『別急著一次拿回來。』"]);
  if(/安打|全壘打/.test(message))return pick(["捕手把面罩推上去：『那顆太甜了，下一位注意高度。』","教練盯著投手丘，牛棚已經有人開始熱身。","打者衝過一壘，休息區的聲音突然變大。"]);
  if(/界外/.test(message))return b.strikes===2?"捕手低聲說：『他還在纏，下一顆換個速度。』":"打者退出打擊區，重新握緊球棒。";
  if(/壞球/.test(message))return b.balls>=3?"捕手把手套擺進好球帶：『現在不能再閃了。』":pick(["捕手把手套往內移了一點：『差一顆球而已。』","打者沒有動，耐心等下一球。"]);
  if(/好球/.test(message))return b.strikes===2?"捕手把球傳回：『他被逼到兩好球了。』":pick(["主審拉弓：『好球！』","打者看著球進手套，沒有出棒。"]);
  return "捕手重新比出暗號，下一球的選擇又開始了。";
}
function pitchBall(pitch) {
  const m=state.match,b=m.batter,risk=livePitchRisk(pitch,b,m),ballP=risk.ball,contactP=risk.hit,swingP=.48+b.strikes*.1-b.balls*.03,gameInning=(m.startInning||1)+m.inning-1,countBefore=`${b.balls} 壞 ${b.strikes} 好`,outsBefore=b.outs; let message="",plateEnded=false;b.pitches++;
  const roll=rng();
  if(roll<ballP){b.balls++;message=`${pitch} 偏外角，打者沒有出棒｜壞球 ${b.balls}`;if(b.balls>=4){b.walks++;awardWalk();message=`四壞保送｜${b.name}選掉了 ${pitch}`;plateEnded=true;}}
  else if(rng()<swingP){if(rng()<contactP){const contactRoll=rng();if(contactRoll<.16+(b.foul||0)){if(b.strikes<2)b.strikes++;message=`${pitch} 被擦成界外球｜好球 ${b.strikes}`;}else if(contactRoll<.42+(b.foul||0)){if(b.runners[0]&&b.outs<2&&rng()<.34){b.outs+=2;b.runners[0]=false;message=`${pitch} 被擊成游擊滾地球，形成雙殺`; }else{b.outs++;message=`${pitch} 被擊成內野滾地球出局`;}plateEnded=true;}else if(contactRoll<.57+(b.foul||0)){const sac=b.runners[2]&&b.outs<2&&rng()<.42;b.outs++;if(sac){b.runners[2]=false;b.runs++;message=`${pitch} 被擊成高飛犧牲打，三壘跑者得分`;}else message=`${pitch} 被擊成外野飛球接殺`;plateEnded=true;}else{b.hits++;const hitRoll=rng(),bases=hitRoll<.1?4:hitRoll<.28?2:1;advanceOnHit(bases);message=`${pitch} 被${b.name}擊出${bases===4?"全壘打":bases===2?"二壘安打":"一壘安打"}`;plateEnded=true;}}else{b.strikes++;message=`${pitch} 誘使打者揮空｜好球 ${b.strikes}`;if(b.strikes>=3){b.ks++;b.outs++;message=`三振！${b.name}追打 ${pitch}`;plateEnded=true;}}}
  else{b.strikes++;message=`${pitch} 擦過邊角｜好球 ${b.strikes}`;if(b.strikes>=3){b.ks++;b.outs++;message=`站著三振！${pitch} 鎖住邊角`;plateEnded=true;}}
  const commentary=pitchComment(message,b);m.log.push(`第 ${gameInning} 局上｜第 ${b.batters} 位打者｜投球前 ${countBefore}、${outsBefore} 出局｜${message}${b.outs!==outsBefore?`｜目前 ${b.outs} 出局`:""}\n${commentary}`);
  if(plateEnded&&b.outs<3)m.batter=newBatterState(b);
  const trouble=b.hits+b.walks+b.runs*1.5,hookRisk=b.hits>=3||b.runs>=3||b.walks>=3||trouble>=5;
  if(b.outs<3&&hookRisk&&!m.moundVisit){m.moundVisit=true;m.log.push(`教練第一次走上投手丘。捕手低聲說：「先抓一個出局，我們還沒放棄你。」`);renderMatch();save();beep(300);return;}
  const heart=(state.special||[]).includes("強心臟")?.12:0,hookChance=Math.min(.94,.3+b.runs*.15+b.hits*.075+b.walks*.055-state.stats.spirit/520-state.stats.health/900-heart);
  if(b.outs<3&&hookRisk&&m.moundVisit&&rng()<hookChance){m.pulled=true;m.log.push(`教練再次走上投手丘，伸手接過球：「今天先到這裡，剩下的交給牛棚。」你在連續危機後提前退場。`);finishPlayedInning(true);}
  else if(b.outs>=3)finishPlayedInning(); else renderMatch(); save(); beep(/安打|保送|失|換投/.test(message)?230:520);
  function awardWalk(){if(b.runners[0]&&b.runners[1]&&b.runners[2])b.runs++;b.runners[2]=b.runners[2]||(b.runners[1]&&b.runners[0]);b.runners[1]=b.runners[1]||b.runners[0];b.runners[0]=true;}
  function advanceOnHit(bases){if(bases===4){b.runs+=b.runners.filter(Boolean).length+1;b.runners=[false,false,false];return;}const next=[false,false,false];for(let i=2;i>=0;i--){if(!b.runners[i])continue;const destination=i+bases+(rng()<.28?1:0);if(destination>=3)b.runs++;else next[destination]=true;}next[bases-1]=true;b.runners=next;}
  function finishPlayedInning(pulled=false){const runs=b.runs,recordedOuts=Math.max(0,b.outs-(m.inningStartOuts||0));m.outs+=recordedOuts;m.hits+=b.hits;m.walks+=b.walks;m.strikeouts+=b.ks;m.batters+=b.batters;m.runs+=runs;m.opp+=runs;if(!runs&&!pulled)m.scoreless++;m.log.push(`${pulled?"提前退場":`第 ${gameInning} 局上結束`}｜投手取得 ${recordedOuts} 出局｜${b.hits}安 ${b.walks}保送 ${b.ks}K｜${runs?`失 ${runs} 分`:`無失分 ✓`}`);m.inning=pulled?m.total+1:m.inning+1;m.batter=null;m.inningStartOuts=0;$("#pitchChoices").innerHTML="";$("#matchLog").innerHTML=m.log.slice(-5).map(x=>`<p>${x.replace(/\n/g,"<br>")}</p>`).join("");$("#matchStatus").textContent=pulled?"教練接過球，你回到休息區等待比賽結果。":runs?"這局遭到得分。":"漂亮壓制！這局沒有失分。";$("#teamRuns").textContent=m.team;$("#oppRuns").textContent=m.opp;const done=m.inning>m.total;$("#nextInningBtn").textContent=done?"查看比賽結果 →":"下一局 →";$("#nextInningBtn").classList.remove("hidden");}
}
function continueMatch() { if(state.match.inning>state.match.total) finishMatch(); else renderMatch(); }
function finishMatch() {
  const m=state.match; if(m.team===m.opp)m.team+=rng()<.58?1:0; const won=m.team>m.opp;
  m.era=m.outs?m.runs*27/m.outs:0;m.result=won?"勝利":"敗戰";
  state.careerPitching=state.careerPitching||{outs:0,runs:0,hits:0,walks:0,strikeouts:0,wins:0,losses:0};const cp=state.careerPitching;cp.outs+=m.outs;cp.runs+=m.runs;cp.hits+=m.hits;cp.walks+=m.walks;cp.strikeouts+=m.strikeouts;won?cp.wins++:cp.losses++;
  const setback=rollSetback("match"); state.lastMatchSetback=setback; state.skillPoints=Math.max(2,3+m.scoreless+Math.floor(m.strikeouts/3)+(won?2:0)-Math.min(2,m.runs)-(setback?1:0)); state.skillAllocation={}; state.phase="skills";
  state.fame+=won?4:1; state.fans+=won?500:120; state.timeline.push(`${chapters[state.chapter].name}：${m.result}（${formatIP(m.outs)}局 ERA ${m.era.toFixed(2)}、${m.strikeouts}K）`);
  showSkills(); render(); save();
}
function showSkills() {
  $("#eventCard").classList.add("hidden"); $("#matchCard").classList.add("hidden"); $("#skillCard").classList.remove("hidden");
  state.skillResolved=state.skillResolved||false;
  const m=state.match,cp=state.careerPitching;
  $("#skillSummary").innerHTML=state.skillResolved&&state.skillResultHtml?state.skillResultHtml:`<span class="match-result-title">${m.result}｜${m.team}：${m.opp}</span><span class="pitching-line"><b>${formatIP(m.outs)}</b><small>投球局數</small><b>${m.era.toFixed(2)}</b><small>防禦率</small><b>${m.strikeouts}</b><small>三振</small><b>${m.walks}</b><small>保送</small><b>${m.hits}</b><small>被安打</small></span><span class="career-line">生涯 ${cp.wins}勝 ${cp.losses}敗｜ERA ${(cp.runs*27/Math.max(1,cp.outs)).toFixed(2)}｜${cp.strikeouts}K／${cp.walks}BB</span>本場獲得 <b id="skillPointsValue">${state.skillPoints}</b> 點，分配完成後才能進入下一章。${state.lastMatchSetback?`<span class="setback match-setback"><b>⚠ 賽後負面事件｜${state.lastMatchSetback.title}</b><br>${state.lastMatchSetback.text}</span>`:""}`; renderSkills();
}
function formatIP(outs){return `${Math.floor(outs/3)}.${outs%3}`;}
function renderSkills() {
  const used=Object.values(state.skillAllocation||{}).reduce((a,b)=>a+b,0), remaining=state.skillPoints-used, pointsEl=$("#skillPointsValue"); if(pointsEl)pointsEl.textContent=remaining;
  $("#skillAllocations").innerHTML=["power","contact","speed","fielding"].map(k=>`<div><span>${statLabels[k]} <b>${state.stats[k]} → ${state.stats[k]+(state.skillAllocation[k]||0)}</b><small>單點成功率 ${Math.round(skillSuccessRate(k)*100)}%</small></span><button data-k="${k}" data-d="-1" ${state.skillResolved||!state.skillAllocation[k]?'disabled':''}>−</button><strong>${state.skillAllocation[k]||0}</strong><button data-k="${k}" data-d="1" ${state.skillResolved||remaining<=0?'disabled':''}>＋</button></div>`).join("");
  document.querySelectorAll("#skillAllocations button").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.k,d=+b.dataset.d;state.skillAllocation[k]=Math.max(0,(state.skillAllocation[k]||0)+d);renderSkills();}));
  $("#confirmSkillsBtn").disabled=!state.skillResolved&&remaining!==0; $("#confirmSkillsBtn").textContent=state.skillResolved?"進入下一章":"確認分配並進行強化";
}
function skillSuccessRate(k) {
  const origin=birdRoster[state.origin], current=state.stats[k], talent=origin.training?Math.min(.11,(origin.training-1)*.32):0, equipment=origin.cost?.06:0, injury=state.stats.health<55?.1:state.stats.health<70?.04:0, hiddenLuck=(state.stats.luck-35)/500;
  return Math.max(.38,Math.min(.96,.9+talent+equipment+hiddenLuck-injury-Math.max(0,current-45)*.006));
}
function confirmSkills() {
  if(state.skillResolved) return advanceChapter();
  const remaining=state.skillPoints-Object.values(state.skillAllocation).reduce((a,b)=>a+b,0); if(remaining)return;
  const cap=birdRoster[state.origin].cap||99, results=[]; let totalSuccess=0,totalFail=0;
  Object.entries(state.skillAllocation).forEach(([k,v])=>{let success=0;for(let i=0;i<v;i++){if(rng()<skillSuccessRate(k)&&state.stats[k]+success<cap)success++;}const fail=v-success;state.stats[k]=Math.min(cap,state.stats[k]+success);totalSuccess+=success;totalFail+=fail;if(v)results.push(`${statLabels[k]}：成功 ${success}／失敗 ${fail}`);});
  state.skillResolved=true; state.skillAllocation={}; state.timeline.push(`技能強化：成功 ${totalSuccess} 點、失敗 ${totalFail} 點`);
  state.skillResultHtml=`<span class="training-result ${totalFail?'has-fail':''}"><b>${totalFail?'強化有成功也有失敗':'強化大成功！'}</b><small>已使用的技能點不論成敗都會消耗</small>${results.join("<br>")}<strong>總計成功 ${totalSuccess} 點｜失敗 ${totalFail} 點</strong><span class="chapter-transition">${chapters[state.chapter].transition}</span></span>`;
  $("#skillSummary").innerHTML=state.skillResultHtml;
  renderSkills();render();save();beep(totalFail?360:650);
}
function advanceChapter() {
  const cap=birdRoster[state.origin].cap||99;
  state.timeline.push(chapters[state.chapter].transition);
  state.chapter++; state.turn=0; state.phase="event"; state.match=null; state.lastMatchSetback=null; state.skillResolved=false; state.skillResultHtml=null; state.stats.health=Math.min(cap,state.stats.health+5); state.chapterRounds=rollChapterRounds(state.stats.luck);
  $("#skillCard").classList.add("hidden"); $("#eventCard").classList.remove("hidden"); if(state.chapter>=chapters.length)return endGame(); applyAging();render();showEvent();save();
}

function applyAging(){
  const age=chapters[state.chapter]?.age;if(!age||age<=30)return;
  const s=state.stats,healthShield=Math.max(0,(s.health-55)/180),yearsPast=age-30,baseChance=Math.min(.92,.22+yearsPast*.055-healthShield),losses=[];
  ["power","contact","speed","fielding"].forEach(k=>{if(rng()<baseChance){const maxLoss=1+Math.floor(yearsPast/3)+(s.health<55?1:0),loss=1+Math.floor(rng()*Math.max(1,maxLoss));s[k]=Math.max(10,s[k]-loss);losses.push(`${statLabels[k]} −${loss}`);}});
  if(rng()<Math.min(.82,baseChance+.08)){const loss=1+Math.floor(rng()*(yearsPast>=6?5:3));s.health=Math.max(15,s.health-loss);}
  const experience=[];if(rng()<.55){s.contact=Math.min(99,s.contact+1);experience.push("控球 +1");}if(rng()<.42){s.fielding=Math.min(99,s.fielding+1);experience.push("變化球 +1");}
  if(losses.length||experience.length){state.timeline.push(`${age} 歲變化：${[...losses,...experience].join("、")}`);state.pendingAging=`進入 ${age} 歲賽季，身體恢復速度變慢：${losses.length?losses.join("、"):"本次沒有明顯衰退"}。比賽經驗同時帶來 ${experience.length?experience.join("、"):"更成熟的判斷"}；健康較高能降低衰退機率。`;}
}

function overallScore() { const s=state.stats; return Math.round((s.power+s.contact+s.speed+s.fielding+s.spirit+s.health)/6); }
function grade(n) { return n>=82?'S':n>=70?'A':n>=57?'B':n>=44?'C':n>=32?'D':'E'; }

function render() {
  const ch=chapters[state.chapter], bird=birdRoster[state.bird], careerPlace=state.chapter>=4?`${currentLeague()} · ${ch.place}`:ch.place; $("#displayName").textContent=state.name; $("#playerPosition").textContent=`${state.position} · ${bird.label}`; $("#careerLine").textContent=`${ch.age} 歲 · ${careerPlace} · ${bird.bonus}`; $("#avatar").innerHTML=`<img src="${bird.src}" alt="${bird.label}" onerror="this.onerror=null;this.src='assets/bird-heavy-88.webp?v=2'">`;
  $("#overall").textContent=grade(overallScore());
  $("#stats").innerHTML=Object.entries(state.stats).filter(([k])=>!['spirit','health','luck'].includes(k)).map(([k,v])=>`<div class="stat"><div class="stat-head"><span>${statLabels[k]}</span><b>${v}</b></div><div class="stat-track"><i style="width:${Math.min(100,v)}%"></i></div></div>`).join("");
  $("#pitchList").innerHTML=state.pitches.map((p,i)=>`<span class="pitch-chip ${i===state.pitches.length-1&&state.pitches.length>1?'new':''}">${p}</span>`).join(""); $("#pitchCount").textContent=`${state.pitches.length} / 8`;
  $("#abilityList").innerHTML=(state.special||[]).map(x=>`<span class="ability-chip">★ ${x}</span>`).join("")||'<span class="ability-empty">尚未獲得</span>';
  $("#fameValue").textContent=state.fame; $("#moneyValue").textContent=state.money+" 萬"; $("#fansValue").textContent=state.fans>=10000?(state.fans/10000).toFixed(1)+"萬":state.fans;
  $("#chapterLabel").textContent=`第${['一','二','三','四','五','六','七','八'][state.chapter]}章`; $("#seasonLabel").textContent=ch.name; $("#weekLabel").textContent=state.turn>=state.chapterRounds?"章末比賽":`第 ${state.turn+1} / ${state.chapterRounds} 回合`; $("#progressBar").style.width=`${Math.min(100,(state.turn+1)/(state.chapterRounds+1)*100)}%`;
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
function resetToStart() { localStorage.removeItem("baseballLifeSave"); state=null; $("#gameScreen").classList.add("hidden"); $("#endingScreen").classList.add("hidden"); $("#startScreen").classList.remove("hidden"); window.scrollTo({top:0,behavior:"smooth"}); }

function randomOrigin() { const ids=Object.keys(birdRoster); return ids[Math.floor(Math.random()*ids.length)]; }
$("#startBtn").addEventListener("click",()=>startGame());
$("#nextBtn").addEventListener("click",nextTurn);
$("#nextInningBtn").addEventListener("click",continueMatch);
$("#confirmSkillsBtn").addEventListener("click",confirmSkills);
$("#restartBtn").addEventListener("click",()=>{ if(confirm("確定要放棄目前生涯，重新開始嗎？")) resetToStart(); });
$("#newLifeBtn").addEventListener("click",resetToStart);
$("#continueBtn").addEventListener("click",()=>{ try{startGame(JSON.parse(localStorage.getItem("baseballLifeSave")));}catch{resetToStart();} });
$("#soundBtn").addEventListener("click",e=>{soundOn=!soundOn;e.currentTarget.classList.toggle("off",!soundOn);beep();});
$("#shareBtn").addEventListener("click",async()=>{ const text=`⚾ 逸群的野球｜${state.name}\n${state.position} · ${birdRoster[state.origin].label}\n生涯評價 ${grade(overallScore())}\n名聲 ${state.fame}｜球迷 ${state.fans}`; try{await navigator.clipboard.writeText(text);$("#copyHint").textContent="生涯卡已複製！";}catch{$("#copyHint").textContent=text;} });

if(localStorage.getItem("baseballLifeSave")) $("#continueBtn").classList.remove("hidden");
