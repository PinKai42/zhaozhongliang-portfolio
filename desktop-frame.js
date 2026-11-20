/* Keep a consistent desktop design viewport across desktop displays. */
(()=>{
 if(window.parent!==window||window.innerWidth<=820)return;
 const designWidth=1715;
 const originalTitle=document.title;
 const url=location.href;
 const frame=document.createElement('iframe');
 frame.title='赵忠良个人作品集';frame.src=url;frame.style.cssText='position:absolute;top:0;left:0;border:0;display:block;transform-origin:top left;background:#e9edf3';
 function fit(){const scale=window.innerWidth/designWidth;frame.style.width=designWidth+'px';frame.style.height=(window.innerHeight/scale)+'px';frame.style.transform='scale('+scale+')';}
 document.documentElement.style.cssText='width:100%;height:100%;overflow:hidden;background:#e9edf3';
 document.body.style.cssText='margin:0;width:100%;height:100%;overflow:hidden';
 document.body.replaceChildren(frame);fit();window.addEventListener('resize',fit);
 frame.addEventListener('load',()=>{try{document.title=frame.contentDocument.title||originalTitle;const current=new URL(frame.contentWindow.location.href);history.replaceState(null,'',current.pathname+current.search+current.hash);}catch{}});
})();
