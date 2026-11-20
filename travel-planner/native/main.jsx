import DayItinerary from './DayItinerary';
import React from 'react';
import {createRoot} from 'react-dom/client';
import './figma.css';
const screens=import.meta.glob('./screens/*.jsx');
const map={home:'358-547',trips:'358-1158','trips-plus':'358-1668',form:'358-1008',map:'358-2518',overview:'358-2657','day-list':'358-2002',export:'358-2254'};
const heights={map:844,home:844,trips:844,'trips-plus':844,form:844,overview:1101,'day-list':1253,export:844};
function DayScrollLayout({children,screen}){
const ref=React.useRef(null);
React.useLayoutEffect(()=>{
 if(screen!=='day-list')return;const root=ref.current;const host=root.querySelector('[data-node-id="358:2002"]');if(!host)return;
 const panel=document.createElement('div');panel.className='day-scroll-panel';panel.setAttribute('aria-label','单日行程，可上下滚动');
 const content=document.createElement('div');content.className='day-scroll-content';panel.append(content);
 [...host.children].forEach(node=>{if(['358:2070','358:2071','358:2072','358:2073','358:2248'].includes(node.dataset.nodeId))content.append(node);});
 root.querySelectorAll('.native-action').forEach(button=>{const y=parseFloat(button.style.top);if(y>=332)content.append(button);});
 host.append(panel);
},[screen]);return <div ref={ref} className={screen==='day-list'?'day-fixed-viewport':undefined}>{children}</div>;
}
function optimizeRoute(){
 const list=document.querySelector('[data-node-id="358:2073"]');if(!list)return;
 const cards=[...list.children].filter(n=>n.querySelector('p')&&n.getAttribute('data-node-id')!=='358:2191');
 if(cards.length<2)return;
 const anchor=[...list.children].find(n=>!cards.includes(n))||null;
 const reordered=[cards[1],cards[0],...cards.slice(2)];
 reordered.forEach((card,index)=>{list.insertBefore(card,anchor);const title=[...card.querySelectorAll('p')].find(p=>/^\d+\./.test(p.textContent.trim()));if(title)title.textContent=title.textContent.replace(/^\s*\d+\./,(index+1)+'.');card.animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:250});});
}
const root=createRoot(document.getElementById('root'));let generation=0;
async function render(data){const epoch=++generation,id=map[data.screen];if(!id)return;const {default:Screen}=await screens[`./screens/s${id}.jsx`]();if(epoch!==generation)return;const height=heights[data.screen];root.render(<DayScrollLayout key={data.screen+data.day} screen={data.screen}><div className="fg-screen" style={{height:data.screen==='overview'?844:height}}>{data.screen==='day-list'&&data.day>12?<DayItinerary day={data.day}/>:<Screen day={data.day||12}/>}{data.screen==='form'&&<div className="native-fields">{[ ['出发城市','济南'],['目的地','北京'],['游玩天数','4天'],['旅行偏好','情侣出行'] ].map(([label,value],i)=><input key={label} aria-label={label} defaultValue={value} style={{top:171+i*56}}/>)}</div>}{data.hotspots.filter(h=>!(data.screen==='day-list'&&h.go==='main:3')).filter(h=>data.screen!=='overview'||h.go!=='main:4').map((h,i)=><button key={i} title={h.label} aria-label={h.label} className="native-action" onClick={()=>{if(h.label==='优化路线'){optimizeRoute();return;}parent.postMessage({type:'native-action',target:h.go,fields:data.screen==='form'?[...document.querySelectorAll('.native-fields input')].map(x=>x.value):null},location.origin);}} style={{left:h.x+'%',top:h.y/100*height,width:h.w+'%',height:h.h/100*height}}/>)}{data.back&&<button className="native-action" aria-label="返回上一级" onClick={()=>parent.postMessage({type:'native-action',target:'back'},location.origin)} style={{left:data.back.x+'%',top:data.back.y/100*height,width:data.back.w+'%',height:data.back.h/100*height}}/>}</div></DayScrollLayout>);scrollTo(0,0)}
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===parent&&e.data?.type==='native-screen')render(e.data)});parent.postMessage({type:'native-ready'},location.origin);

// Warm screen modules before the user switches steps.
Promise.allSettled(Object.values(screens).map(load=>load()));
