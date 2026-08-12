(function () {
  const allowed={event:["CHOOSE_EVENT","CONTINUE"],match:["THROW_PITCH","CONTINUE_MATCH"],skills:["ALLOCATE_SKILL","CONFIRM_SKILLS"],ending:["NEW_GAME"]};
  const handlers=new Map();
  window.V47FlowController={
    can(phase,action){return (allowed[phase]||[]).includes(action);},
    assert(phase,action){if(!this.can(phase,action))throw new Error(`流程錯誤：${phase} 階段不能執行 ${action}`);},
    phaseOf(state){return state?.phase||"event";},
    actionsFor(state){return [...(allowed[this.phaseOf(state)]||[])];},
    register(action,handler){handlers.set(action,handler);},
    dispatch(state,action,payload){
      this.assert(this.phaseOf(state),action);
      const handler=handlers.get(action);
      if(!handler)throw new Error(`流程錯誤：尚未註冊 ${action}`);
      return handler(payload,state);
    }
  };
})();
