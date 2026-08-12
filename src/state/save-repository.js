(function () {
  window.V47SaveRepository={
    load(){const raw=localStorage.getItem(window.V47_CONFIG.saveKey);if(!raw)return null;try{return window.V47PlayerState.migrate(JSON.parse(raw));}catch(error){console.warn("v47 無法讀取舊存檔",error);return null;}},
    save(state){state.schemaVersion=47;state.updatedAt=new Date().toISOString();localStorage.setItem(window.V47_CONFIG.saveKey,JSON.stringify(state));},
    clear(){localStorage.removeItem(window.V47_CONFIG.saveKey);}
  };
})();
