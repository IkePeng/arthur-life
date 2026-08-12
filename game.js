const $ = (s) => document.querySelector(s);

const birdRoster = {
  "18": { src:"assets/bird-pitcher.webp?v=5", label:"資本雄厚", bonus:"資金充裕 · 頂級設備 · 訓練開銷減免", money:1800, stats:{contact:4,health:4}, training:1.12, cost:0.5 },
  "21": { src:"assets/bird-lefty-21.webp?v=5", label:"一招入魂", bonus:"指定武器接近滿級 · 其他基礎能力較低", stats:{speed:55,power:8,contact:-6,fielding:-5,health:-4}, pitch:"160km 火球", special:"火球入魂" },
  "36": { src:"assets/bird-sidearm-36.webp?v=5", label:"天賦異稟", bonus:"能力上限提高 · 訓練成長加成 · 覺醒爆發", stats:{power:7,contact:7,speed:7,fielding:7,health:5}, training:1.35, cap:110, special:"天賦覺醒" },
  "99": { src:"assets/bird-closer-99.webp?v=5", label:"名門之後", bonus:"高人氣與聲望 · 傳奇導師 · 球探青睞", fame:18, fans:3800, stats:{spirit:6,contact:4}, scout:.16, special:"傳奇人脈" },
  "55": { src:"assets/bird-power-55.webp?v=5", label:"草莽野草", bonus:"逆境爆發 · 體力極佳 · 在地死忠球迷", fans:900, stats:{health:18,spirit:12,power:4}, adversity:1.35, special:"野草韌性" },
  "77": { src:"assets/bird-calm-77.webp?v=5", label:"強運之子", bonus:"關鍵時刻強化 · 正面偶遇機率提高", stats:{spirit:8}, luck:.14, special:"命運眷顧" },
  "88": { src:"assets/solid-bird-heavy-88.webp?v=1", label:"世故玩家", bonus:"合約加成 · 商業贊助 · 公關維持人氣", money:300, fame:7, fans:1200, stats:{contact:5,spirit:5}, business:1.55, special:"談判高手" }
};
let selectedBird = null;

const statLabels = { power: "球威", contact: "控球", speed: "球速", fielding: "變化球", spirit: "心志", health: "健康" };
const chapters = [
  { name: "菜鳥的夏天", place: "國中一年級 · 青葉中學", age: 13 },
  { name: "甲子園之路", place: "高中二年級 · 海風高中", age: 17 },
  { name: "選秀之夜", place: "大學／選秀 · 職業二軍", age: 20 },
  { name: "王牌的代價", place: "職業生涯 · 一軍", age: 25 },
  { name: "最後一局", place: "職業生涯 · 暮年", age: 34 }
];
const chapterBackgrounds=["assets/baseball-campus.png","assets/chapter-2-night-stadium.webp","assets/chapter-3-scout-field.webp","assets/chapter-4-pro-stadium.webp","assets/chapter-5-sunset-field.webp"];

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
  {icon:"🎤",tag:"第五章 · 滿場掌聲",title:"你留下了什麼？",text:"引退儀式上，主持人把麥克風交給你。球場安靜下來，等著你的最後一句話。",choices:[["謝謝每一個接過我球的人",{spirit:6,fame:6,fans:10000},"掌聲中，你最先看向那只熟悉的捕手手套。"],["棒球教會我，下一球永遠能重來",{spirit:8,fame:7},"這句話多年後仍寫在球場入口。"],["我還沒有離開，只是換個位置",{fielding:5,fame:5},"隔年春天，你以投手教練的身分回到球場。"]]}
];

let state;
let soundOn = true;
const rng = Math.random;

function beep(freq=420) {
  if (!soundOn) return;
  try { const ctx = new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.value=freq; g.gain.setValueAtTime(.035,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12); o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+.12); } catch {}
}

function newState() {
  if(!selectedBird) selectedBird=randomOrigin();
  const origin=birdRoster[selectedBird], stats={power:30,contact:28,speed:32,fielding:24,spirit:35,health:72};
  Object.entries(origin.stats||{}).forEach(([k,v])=>stats[k]+=v);
  return { name:$("#playerName").value.trim()||"無名小將", position:"投手", bird:selectedBird, origin:selectedBird, chapter:0, turn:0, used:[], pitches:["四縫線直球",...(origin.pitch?[origin.pitch]:[])], special:origin.special?[origin.special]:[], stats, fame:origin.fame||0, money:origin.money||0, fans:origin.fans||12, timeline:[`出生背景：${origin.label}`,"加入校隊"] };
}

function startGame(customState) {
  if(!customState) selectedBird=randomOrigin();
  state = customState || newState();
  state.position="投手"; state.pitches=state.pitches||["四縫線直球"]; state.bird=birdRoster[state.bird]?state.bird:"18"; state.origin=state.origin||state.bird; state.special=state.special||[];
  $("#startScreen").classList.add("hidden"); $("#endingScreen").classList.add("hidden"); $("#gameScreen").classList.remove("hidden");
  save(); render();
  if(state.phase==="match") showMatch(true); else if(state.phase==="skills") showSkills(); else showEvent();
}

function showEvent() {
  state.current=state.chapter*4+state.turn; const e=events[state.current];
  $("#eventVisual").style.backgroundImage=`linear-gradient(180deg,rgba(4,46,105,.08),rgba(4,35,79,.22)),url('${chapterBackgrounds[state.chapter]}')`; $("#eventKicker").textContent=e.tag; $("#eventTitle").textContent=e.title; $("#eventText").textContent=e.text;
  $("#resultBox").classList.add("hidden"); $("#nextBtn").classList.add("hidden");
  $("#choices").innerHTML=e.choices.map((c,i)=>`<button class="choice" data-i="${i}"><span class="choice-letter">${String.fromCharCode(65+i)}</span><span>${c[0]}</span></button>`).join("");
  document.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>choose(+btn.dataset.i)));
  save();
}

function choose(i) {
  const readingPosition = window.scrollY;
  const c=events[state.current].choices[i], effects={...c[1]}, origin=birdRoster[state.origin]; let success=true;
  const keyMoment=/滿壘|決賽|選秀|初登板|冠軍|最後|危機/.test(events[state.current].title+events[state.current].tag);
  if(c[3]!==undefined) { const spiritBonus=(state.stats.spirit-35)/200, luckBonus=(origin.luck||0)+(origin.scout&&/球探|選秀/.test(events[state.current].title)?origin.scout:0); success=rng()<Math.min(.96,c[3]+spiritBonus+luckBonus); if(!success) Object.keys(effects).forEach(k=>{ effects[k]=k==="pitch"?null:Math.round(effects[k]*-.45); }); }
  if(success) Object.keys(effects).forEach(k=>{ if(k in state.stats&&effects[k]>0) effects[k]=Math.round(effects[k]*(origin.training||1)*(origin.adversity&&state.chapter<3?origin.adversity:1)); });
  if(success&&origin.business) { if(effects.money>0) effects.money=Math.round(effects.money*origin.business); if(effects.fame<0) effects.fame=Math.ceil(effects.fame*.4); }
  if(effects.money<0&&origin.cost) effects.money=Math.round(effects.money*origin.cost);
  if(success&&origin.luck&&keyMoment) { effects.fame=(effects.fame||0)+3; effects.spirit=(effects.spirit||0)+2; }
  const parts=[];
  for(const [k,v] of Object.entries(effects)) {
    if(k==="pitch") { if(v&&!state.pitches.includes(v)) state.pitches.push(v); if(v) parts.push(`<span class="delta">習得球種：${v}</span>`); continue; }
    if(k in state.stats) state.stats[k]=Math.max(0,Math.min(origin.cap||99,state.stats[k]+v)); else state[k]=Math.max(0,(state[k]||0)+v);
    parts.push(`<span class="delta ${v<0?'negative':''}">${statLabels[k]||({fame:'名聲',money:'資金',fans:'粉絲'}[k])} ${v>0?'+':''}${v}</span>`);
  }
  const setback=rollSetback("story");
  $("#choices").innerHTML=""; $("#resultBox").innerHTML=`<strong>${success?'結果':'事與願違'}</strong><br>${success?c[2]:"結果沒有如你預期，但失敗也成了往後的養分。"}<br>${parts.join("")}${setback?`<div class="setback"><b>⚠ 負面事件｜${setback.title}</b><br>${setback.text}</div>`:""}`; $("#resultBox").classList.remove("hidden"); $("#nextBtn").classList.remove("hidden");
  if((effects.fame||0)>=6 || (effects.spirit||0)>=6) { const mark=events[state.current].title; if(!state.timeline.includes(mark)) state.timeline.push(mark); }
  beep(success?520:220); render(); save();
  requestAnimationFrame(()=>window.scrollTo({top:readingPosition,behavior:"auto"}));
}

function applyStatLoss(loss) {
  const parts=[]; for(const [k,v] of Object.entries(loss)){state.stats[k]=Math.max(0,state.stats[k]-v);parts.push(`${statLabels[k]} −${v}`);} return parts.join("、");
}
function rollSetback(context="story") {
  const origin=birdRoster[state.origin], healthRisk=Math.max(0,(70-state.stats.health)/230), workload=context==="match"?.08:0;
  let chance=.18+healthRisk+workload-(origin.adversity?.045:0)-(origin.luck?.04:0); if(rng()>chance)return null;
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
  state.turn++;
  if(state.turn>=4) { state.turn=4; return showMatch(); }
  const readingPosition=window.scrollY;
  render(); showEvent();
  requestAnimationFrame(()=>window.scrollTo({top:readingPosition,behavior:"auto"}));
  beep(390);
}

const pitchingRoles={"18":"先發投手","21":"先發投手","36":"中繼投手","99":"終結者","55":"先發投手","77":"中繼投手","88":"終結者"};
const roleInnings={"先發投手":5,"中繼投手":3,"終結者":1};
function pitchProfile(pitch) {
  const s=state.stats, fast=/直球|火球/.test(pitch), elite=/160km|火球入魂/.test(pitch), breaker=/曲球|滑球|指叉|SFF|變速|切球/.test(pitch);
  const quality=fast?s.power*.34+s.speed*.42+s.contact*.24:s.fielding*.48+s.contact*.34+s.spirit*.18;
  let hit=.355-quality*.00175, k=.09+quality*.00205, bb=.145-s.contact*.00125;
  if(elite){hit-=.055;k+=.105;bb+=.035;} else if(/指叉|SFF/.test(pitch)){hit-=.04;k+=.075;bb+=.025;} else if(/滑球|曲球/.test(pitch)){hit-=.025;k+=.055;bb+=.018;} else if(/變速/.test(pitch)){hit-=.035;k+=.04;bb-=.006;} else if(/二縫線|切球/.test(pitch)){hit-=.012;k-=.015;bb-=.018;} else if(fast){hit+=.018;k+=.018;}
  return {quality,hit:Math.max(.115,Math.min(.39,hit)),k:Math.max(.08,Math.min(.48,k)),bb:Math.max(.025,Math.min(.20,bb)),breaker};
}
function showMatch(resume=false) {
  state.phase="match"; const role=pitchingRoles[state.bird], total=roleInnings[role];
  if(!resume||!state.match) state.match={role,total,inning:1,runs:0,scoreless:0,team:role==="終結者"?3:role==="中繼投手"?2:0,opp:role==="終結者"?2:role==="中繼投手"?2:0,outs:0,hits:0,walks:0,strikeouts:0,batters:0,log:[]};
  $("#eventCard").classList.add("hidden"); $("#skillCard").classList.add("hidden"); $("#matchCard").classList.remove("hidden");
  $("#matchRole").textContent=role; $("#matchTitle").textContent=`${chapters[state.chapter].name} · 章末正式比賽`; renderMatch(); save();
}
function renderMatch() {
  const m=state.match; $("#teamRuns").textContent=m.team; $("#oppRuns").textContent=m.opp; $("#inningLabel").textContent=`${m.role} · 第 ${m.inning} / ${m.total} 局`;
  $("#matchPrompt").textContent=m.inning>m.total?"投球任務完成":"選擇這局的主戰球種";
  $("#matchStatus").textContent=m.inning>m.total?`你完成 ${m.total} 局投球，失 ${m.runs} 分。`:"每種球路的成功率都受控球、球威、變化球與體力影響。";
  $("#pitchChoices").innerHTML=m.inning>m.total?"":state.pitches.map(p=>{const x=pitchProfile(p);return `<button class="pitch-choice" data-pitch="${p}"><b>${p}</b><small>預估被打擊率 <strong>${x.hit.toFixed(3).replace(/^0/,"")}</strong></small><em>三振 ${Math.round(x.k*100)}% · 保送 ${Math.round(x.bb*100)}%</em></button>`}).join("");
  document.querySelectorAll(".pitch-choice").forEach(b=>b.addEventListener("click",()=>pitchInning(b.dataset.pitch)));
  $("#matchLog").innerHTML=m.log.slice(-5).map(x=>`<p>${x}</p>`).join(""); $("#nextInningBtn").classList.add("hidden");
}
function pitchInning(pitch) {
  const m=state.match, origin=birdRoster[state.origin], fatigue=(m.inning-1)*(m.role==="先發投手"?.014:.008), profile=pitchProfile(pitch);
  const hitP=Math.min(.48,profile.hit+fatigue), bbP=Math.min(.24,profile.bb+fatigue*.7), kP=Math.max(.06,profile.k-fatigue*.6); let outs=0,bases=0,runs=0,hits=0,walks=0,ks=0,batters=0;
  while(outs<3&&batters<12){batters++;const roll=rng();if(roll<bbP){walks++;bases++;if(bases>3){runs++;bases=3;}}else if(roll<bbP+hitP){hits++;const extra=rng()<.18?2:1;runs+=Math.max(0,bases+extra-3);bases=Math.min(3,bases+extra);}else if(roll<bbP+hitP+kP){ks++;outs++;}else{outs++;if(bases>0&&rng()<.22)bases--;}}
  m.outs+=3;m.hits+=hits;m.walks+=walks;m.strikeouts+=ks;m.batters+=batters;m.runs+=runs;m.opp+=runs;if(!runs)m.scoreless++;
  m.log.push(`第 ${m.inning} 局｜${pitch}｜${hits}安 ${walks}保送 ${ks}K｜${runs?`失 ${runs} 分`:`無失分 ✓`}`); m.inning++;
  $("#pitchChoices").innerHTML=""; $("#matchLog").innerHTML=m.log.slice(-5).map(x=>`<p>${x}</p>`).join("");
  $("#matchStatus").textContent=runs?"打者抓到失投，對手攻下分數。":"漂亮壓制！這局沒有讓對手得分。";
  $("#teamRuns").textContent=m.team; $("#oppRuns").textContent=m.opp;
  const done=m.inning>m.total; $("#nextInningBtn").textContent=done?"查看比賽結果 →":"下一局 →"; $("#nextInningBtn").classList.remove("hidden"); save(); beep(runs?230:560);
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
  const m=state.match,cp=state.careerPitching; $("#skillSummary").innerHTML=`<span class="match-result-title">${m.result}｜${m.team}：${m.opp}</span><span class="pitching-line"><b>${formatIP(m.outs)}</b><small>投球局數</small><b>${m.era.toFixed(2)}</b><small>防禦率</small><b>${m.strikeouts}</b><small>三振</small><b>${m.walks}</b><small>保送</small><b>${m.hits}</b><small>被安打</small></span><span class="career-line">生涯 ${cp.wins}勝 ${cp.losses}敗｜ERA ${(cp.runs*27/Math.max(1,cp.outs)).toFixed(2)}｜${cp.strikeouts}K／${cp.walks}BB</span>本場獲得 <b id="skillPointsValue">${state.skillPoints}</b> 點，分配完成後才能進入下一章。${state.lastMatchSetback?`<span class="setback match-setback"><b>⚠ 賽後負面事件｜${state.lastMatchSetback.title}</b><br>${state.lastMatchSetback.text}</span>`:""}`; renderSkills();
}
function formatIP(outs){return `${Math.floor(outs/3)}.${outs%3}`;}
function renderSkills() {
  const used=Object.values(state.skillAllocation||{}).reduce((a,b)=>a+b,0), remaining=state.skillPoints-used; $("#skillPointsValue").textContent=remaining;
  $("#skillAllocations").innerHTML=Object.keys(state.stats).map(k=>`<div><span>${statLabels[k]} <b>${state.stats[k]} → ${state.stats[k]+(state.skillAllocation[k]||0)}</b></span><button data-k="${k}" data-d="-1" ${!state.skillAllocation[k]?'disabled':''}>−</button><strong>${state.skillAllocation[k]||0}</strong><button data-k="${k}" data-d="1" ${remaining<=0?'disabled':''}>＋</button></div>`).join("");
  document.querySelectorAll("#skillAllocations button").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.k,d=+b.dataset.d;state.skillAllocation[k]=Math.max(0,(state.skillAllocation[k]||0)+d);renderSkills();}));
  $("#confirmSkillsBtn").disabled=remaining!==0;
}
function confirmSkills() {
  const remaining=state.skillPoints-Object.values(state.skillAllocation).reduce((a,b)=>a+b,0); if(remaining)return;
  const cap=birdRoster[state.origin].cap||99; Object.entries(state.skillAllocation).forEach(([k,v])=>state.stats[k]=Math.min(cap,state.stats[k]+v));
  state.chapter++; state.turn=0; state.phase="event"; state.match=null; state.lastMatchSetback=null; state.stats.health=Math.min(cap,state.stats.health+5);
  $("#skillCard").classList.add("hidden"); $("#eventCard").classList.remove("hidden"); if(state.chapter>=5)return endGame(); render();showEvent();save();
}

function overallScore() { const s=state.stats; return Math.round((s.power+s.contact+s.speed+s.fielding+s.spirit+s.health)/6); }
function grade(n) { return n>=82?'S':n>=70?'A':n>=57?'B':n>=44?'C':n>=32?'D':'E'; }

function render() {
  const ch=chapters[state.chapter], bird=birdRoster[state.bird]; $("#displayName").textContent=state.name; $("#playerPosition").textContent=`${state.position} · ${bird.label}`; $("#careerLine").textContent=`${ch.age} 歲 · ${ch.place} · ${bird.bonus}`; $("#avatar").innerHTML=`<img src="${bird.src}" alt="${bird.label}">`;
  $("#overall").textContent=grade(overallScore());
  $("#stats").innerHTML=Object.entries(state.stats).map(([k,v])=>`<div class="stat"><div class="stat-head"><span>${statLabels[k]}</span><b>${v}</b></div><div class="stat-track"><i style="width:${Math.min(100,v)}%"></i></div></div>`).join("");
  $("#pitchList").innerHTML=[...(state.special||[]).map(x=>`<span class="pitch-chip origin-chip">★ ${x}</span>`),...state.pitches.map((p,i)=>`<span class="pitch-chip ${i===state.pitches.length-1&&state.pitches.length>1?'new':''}">${p}</span>`)].join(""); $("#pitchCount").textContent=`${state.pitches.length} / 8`;
  $("#fameValue").textContent=state.fame; $("#moneyValue").textContent=state.money+" 萬"; $("#fansValue").textContent=state.fans>=10000?(state.fans/10000).toFixed(1)+"萬":state.fans;
  $("#chapterLabel").textContent=`第${['一','二','三','四','五'][state.chapter]}章`; $("#seasonLabel").textContent=ch.name; $("#weekLabel").textContent=state.turn>=4?"章末比賽":`第 ${state.turn+1} / 4 回合`; $("#progressBar").style.width=`${Math.min(100,(state.turn+1)/5*100)}%`;
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
