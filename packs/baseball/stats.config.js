(function (c) {
  c.stats = [
    {id:"power",name:"球威",visible:true,min:0,max:99,description:"影響球進壘時的壓迫感、被打強度與三振能力。",training:{enabled:true,baseSuccessRate:.90,difficultyAfter:[{value:50,penalty:.03},{value:70,penalty:.10},{value:90,penalty:.22}]},matchBindings:["contactChance","hardHitChance"]},
    {id:"contact",name:"控球",visible:true,min:0,max:99,description:"影響好球率、邊角控制與四壞保送。",training:{enabled:true,baseSuccessRate:.90,difficultyAfter:[{value:50,penalty:.03},{value:70,penalty:.10},{value:90,penalty:.22}]}},
    {id:"speed",name:"球速",visible:true,min:0,max:99,description:"影響快速球壓制、揮空與球探評價。",training:{enabled:true,baseSuccessRate:.90,difficultyAfter:[{value:50,penalty:.03},{value:70,penalty:.10},{value:90,penalty:.22}]}},
    {id:"fielding",name:"變化球",visible:true,min:0,max:99,description:"影響變化球位移、揮空與被打擊率。",training:{enabled:true,baseSuccessRate:.90,difficultyAfter:[{value:50,penalty:.03},{value:70,penalty:.10},{value:90,penalty:.22}]}},
    {id:"spirit",name:"心志",visible:false,min:0,max:99,description:"影響壓力情境、失敗恢復與關鍵判定。",training:{enabled:false}},
    {id:"health",name:"健康",visible:false,min:0,max:99,description:"影響投球局數、疲勞、傷勢與退休。",training:{enabled:false}},
    {id:"luck",name:"運氣",visible:false,min:0,max:99,description:"影響偶遇、正面事件與球探機會。",training:{enabled:false}}
  ];
})(window.V47_CONFIG);
