import {tripDate} from './TripDate';
import React from 'react';
import OriginalDay from './screens/s358-2002';
import DayItinerary from './DayItinerary';
function find(node,id){if(!React.isValidElement(node))return null;if(node.props['data-node-id']===id)return node;for(const c of React.Children.toArray(node.props.children)){const match=find(c,id);if(match)return match;}return null;}
export function OverviewDayMap({day}){const tree=day===12?OriginalDay({day}):DayItinerary({day});const ids=[2003,2004,2005,2006,2007,2212,2219,2226,2233,2240];return <div className="overview-selected-map" data-day={day}>{ids.map(id=>{const node=find(tree,`358:${id}`);return node?React.cloneElement(node,{key:id}):null;})}</div>;}
export default function OverviewDayContent({day,startDate}){
const tree=day===12?OriginalDay({day}):DayItinerary({day});
function optimize(){const list=document.querySelector('.overview-day-detail [data-node-id="358:2073"]');if(!list)return;const cards=[...list.children].filter(c=>c.dataset.nodeId!=='358:2191'&&c.dataset.nodeId!=='358:2203');if(cards.length<2)return;list.insertBefore(cards[1],cards[0]);cards.splice(0,2,cards[1],cards[0]);cards.forEach((card,i)=>{const title=[...card.querySelectorAll('p')].find(p=>/^\d+\./.test(p.textContent.trim()));if(title)title.textContent=title.textContent.replace(/^\s*\d+\./,(i+1)+'.');});}
return <div className="overview-day-detail" key={day}>{['358:2071','358:2073','358:2248'].map(id=>{const n=find(tree,id);if(!n)return null;const displayDate=startDate?tripDate(startDate,day-12):null;const content=id==='358:2071'&&displayDate?<p className="leading-[normal]">{displayDate.month}月{displayDate.day}日 周{displayDate.week}</p>:n.props.children;return React.cloneElement(n,{children:content,key:id,onClick:id==='358:2248'?optimize:undefined});})}</div>;
}

export function OverviewMapToolbar({day,onBack}){
 const [open,setOpen]=React.useState(false);
 const send=()=>{setOpen(false);parent.postMessage({type:'native-action',target:'map-expand',day:day||12},location.origin);};
 return <div className="overview-map-toolbar"><button aria-label="返回总览" onClick={()=>{setOpen(false);onBack();}}><img src="./figma-assets/869be41a-45f3-40a4-980d-f9ef0b83bb77.svg" alt=""/></button><button aria-label="放大当天地图" onClick={send}><img src="./figma-assets/e83d80b0-0882-4489-a988-b386e330f4a8.svg" alt=""/></button><button aria-label="更多地图操作" aria-expanded={open} onClick={()=>setOpen(!open)}><img src="./figma-assets/0999e275-86d3-40ea-be71-fee79ea9e891.svg" alt=""/></button>{open&&<div className="overview-map-menu"><button onClick={send}>放大地图</button><button onClick={()=>{setOpen(false);onBack();}}>返回总览</button></div>}</div>;
}
