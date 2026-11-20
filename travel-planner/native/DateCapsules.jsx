import React from 'react';
export default function DateCapsules({day=null,overview=false,top}){
const ref=React.useRef(null),drag=React.useRef(null);
React.useLayoutEffect(()=>{const nav=ref.current,active=nav.querySelector('[aria-pressed="true"]');if(active){const left=active.offsetLeft,right=left+active.offsetWidth;if(right>nav.clientWidth)nav.scrollLeft=right-nav.clientWidth+12;}},[day]);
function down(e){if(e.pointerType==='touch')return;drag.current={x:e.clientX,scroll:ref.current.scrollLeft,moved:false};}
function move(e){const d=drag.current;if(!d)return;const delta=e.clientX-d.x;if(Math.abs(delta)>5)d.moved=true;if(d.moved){ref.current.scrollLeft=d.scroll-delta;e.preventDefault();}}
function finish(){const d=drag.current;if(!d)return;setTimeout(()=>{if(drag.current===d)drag.current=null;},0);}
function click(e){if(drag.current?.moved){e.preventDefault();e.stopPropagation();}}
return <nav ref={ref} data-node-id={overview?'358:2688':'358:2048'} className="date-capsules" style={{top:top??(overview?345:297)}} aria-label="行程日期" onPointerDown={down} onPointerMove={move} onPointerUp={finish} onPointerLeave={finish} onClickCapture={click} onWheel={e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX))ref.current.scrollLeft+=e.deltaY;}}><button aria-pressed={!day} className={!day?'active':''} onClick={()=>parent.postMessage({type:'native-action',target:'main:3'},location.origin)}>☰ 总揽</button>{[12,13,14,15].map(d=><button key={d} aria-pressed={day===d} className={day===d?'active':''} onClick={()=>parent.postMessage({type:'native-action',target:'main:4',day:d},location.origin)}>04月{d}日</button>)}</nav>}
