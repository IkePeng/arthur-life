(function () {
  function assert(ok,message,errors){if(!ok)errors.push(message);}
  function validateConfig(c){
    const errors=[];
    assert(c&&c.schemaVersion===47,"manifest.config.js：schemaVersion 必須是 47",errors);
    ["stats","abilities","pitches","characters","chapters","storyEvents","annualEvents","extraRoundEvents","lifeEvents","batters"].forEach(k=>assert(Array.isArray(c?.[k])&&c[k].length,`${k}.config.js：不可為空`,errors));
    const ids=(items,label)=>{const seen=new Set();items.forEach((x,i)=>{assert(x&&typeof x.id==="string"&&x.id,`${label}[${i}]：缺少 id`,errors);assert(!seen.has(x.id),`${label}：id 重複 ${x.id}`,errors);seen.add(x.id);});return seen;};
    const statIds=ids(c.stats||[],"stats"),abilityIds=ids(c.abilities||[],"abilities"),pitchIds=ids(c.pitches||[],"pitches");ids(c.characters||[],"characters");ids(c.chapters||[],"chapters");ids(c.batters||[],"batters");
    (c.stats||[]).forEach(s=>{assert(typeof s.name==="string",`stats.${s.id}：缺少 name`,errors);assert(Number.isFinite(s.min)&&Number.isFinite(s.max)&&s.min<s.max,`stats.${s.id}：min/max 不合法`,errors);});
    (c.characters||[]).forEach(ch=>{
      assert(ch.image&&ch.name,`characters.${ch.id}：缺少 name 或 image`,errors);
      Object.entries(ch.initialStats||{}).forEach(([k,r])=>{assert(statIds.has(k),`characters.${ch.id}：未知能力 ${k}`,errors);assert(Number.isFinite(r.min)&&Number.isFinite(r.max)&&r.min<=r.max,`characters.${ch.id}.${k}：能力區間不合法`,errors);});
      (ch.startingPitches||[]).forEach(name=>assert((c.pitches||[]).some(p=>p.name===name),`characters.${ch.id}：未知球種 ${name}`,errors));
      (ch.startingAbilities||[]).forEach(id=>assert(abilityIds.has(id),`characters.${ch.id}：未知特殊能力 ${id}`,errors));
    });
    const checkEvent=(e,label)=>{assert(e&&e.title&&e.text,`${label}：缺少 title 或 text`,errors);assert(Array.isArray(e?.choices)&&e.choices.length>=2,`${label}：至少需要 2 個選項`,errors);(e?.choices||[]).forEach((choice,i)=>assert(Array.isArray(choice)&&typeof choice[0]==="string"&&choice[1]&&typeof choice[1]==="object",`${label}.choices[${i}]：格式錯誤`,errors));};
    assert((c.storyEvents||[]).length>=(c.chapters||[]).length*4,"story-events.config.js：每章至少需要 4 個主線關卡",errors);
    (c.chapters||[]).forEach(ch=>{assert(Array.isArray(ch.ages)&&ch.ages.length,`chapters.${ch.id}：缺少年齡列表`,errors);assert(typeof ch.background==="string"&&ch.background,`chapters.${ch.id}：缺少球場背景`,errors);});
    (c.storyEvents||[]).forEach((e,i)=>checkEvent(e,`storyEvents[${i}]`));(c.annualEvents||[]).forEach((e,i)=>checkEvent(e,`annualEvents[${i}]`));(c.extraRoundEvents||[]).forEach((e,i)=>checkEvent(e,`extraRoundEvents[${i}]`));(c.lifeEvents||[]).forEach((e,i)=>checkEvent(e,`lifeEvents[${i}]`));Object.entries(c.originOpportunities||{}).forEach(([id,e])=>{assert((c.characters||[]).some(x=>x.id===id),`originOpportunities：未知角色 ${id}`,errors);checkEvent(e,`originOpportunities.${id}`);});
    (c.batters||[]).forEach(b=>{assert(Array.isArray(b.quotes)&&b.quotes.length,`batters.${b.id}：至少需要一句對白`,errors);assert(Number.isFinite(b.contact),`batters.${b.id}：缺少 contact`,errors);assert(b.patience===undefined||Number.isFinite(b.patience),`batters.${b.id}：patience 必須是數字`,errors);});
    assert(c.baseballRules?.strikesPerOut===3&&c.baseballRules?.ballsPerWalk===4&&c.baseballRules?.outsPerHalfInning===3,"baseball-rules.config.js：棒球基本規則不完整",errors);
    const gradeIds=new Set((c.ratings?.grades||[]).map(x=>x.id));
    assert(gradeIds.has("SS")&&gradeIds.has("S")&&gradeIds.has("A")&&gradeIds.has("B"),"ratings.config.js：評價等級不完整",errors);
    assert((c.scouting?.leagues||[]).every(x=>gradeIds.has(x.minOverallGrade)),"scouting.config.js：邀約綜合評價門檻不完整",errors);
    if(errors.length)throw new Error(`v47 設定檔驗證失敗\n${errors.map((x,i)=>`${i+1}. ${x}`).join("\n")}`);
    return true;
  }
  window.V47ConfigValidator={validate:validateConfig};
})();
