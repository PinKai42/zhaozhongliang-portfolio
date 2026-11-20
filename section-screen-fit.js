(()=>{
const media=matchMedia('(min-width:821px)');
function start(){if(!media.matches)return;document.querySelectorAll('main>section:not(.hero)').forEach(section=>{
 if(section.dataset.screenFit)return;section.dataset.screenFit='true';
 const computed=getComputedStyle(section);const content=document.createElement('div');content.className='screen-fit-content';content.style.paddingTop=computed.paddingTop;content.style.paddingBottom=computed.paddingBottom;
 while(section.firstChild)content.append(section.firstChild);section.append(content);
 section.style.paddingTop='0';section.style.paddingBottom='0';
 let queued=false;const fit=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const available=Math.max(400,innerHeight-68);section.style.height=available+'px';section.style.minHeight='0';const height=content.scrollHeight;const scale=Math.min(1,(available-24)/Math.max(height,1));content.style.transform='scale('+scale+')';content.style.top=Math.max(12,(available-height*scale)/2)+'px';});};
 new ResizeObserver(fit).observe(content);window.addEventListener('resize',fit);fit();
 });}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
