(function () {
  try { window.V47ConfigValidator.validate(window.V47_CONFIG); window.V47_READY=true; }
  catch(error){window.V47_READY=false;window.V47_CONFIG_ERROR=error;console.error(error);document.addEventListener("DOMContentLoaded",()=>{const box=document.createElement("pre");box.className="config-error";box.textContent=error.message;document.body.prepend(box);});}
})();
