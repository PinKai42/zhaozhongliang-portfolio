import React from 'react';
import OriginalDay from './screens/s358-2002';
const dayPhotos=["./figma-assets/ff3dbdf8-4264-4d67-b3fd-156d5de37705.png","./figma-assets/bfb502fe-b251-45e8-a51f-25f087830d62.png","./figma-assets/e09e6b32-24ff-444b-ae3b-273819a6f3fb.png","./figma-assets/dd358ab1-24ec-477d-aead-079a8229d977.png","./figma-assets/1f76033e-4556-42cb-b8a3-9d2e9e086334.png"];
const photoOrder={13:[0,2,1,4],14:[3,1,4,2],15:[4,0,3]};
const demoDistances={13:["1.8公里","620米","3.2公里"],14:["2.4公里","870米","1.6公里"],15:["3.7公里","540米"]};
const itineraries={
13:[['八达岭长城','建议玩3–4小时','开放时间请以景区当日公告为准','需购票'],['鸟巢（国家体育场）','建议玩1–2小时','场馆参观安排以当日公告为准','外观免费，入内需购票'],['水立方（国家游泳中心）','建议玩1–2小时','场馆参观安排以当日公告为准','外观免费，入内需购票'],['景山公园','建议玩1小时','建议傍晚游览，注意末班入园时间','需购票']],
14:[['颐和园','建议玩3–4小时','建议上午入园，开放时间以当日公告为准','需购票'],['圆明园','建议玩2–3小时','园内展区开放时间以当日公告为准','需购票'],['前门大街','建议玩1–2小时','开放街区，店铺营业时间各异','街区免费'],['景山公园','建议玩1小时','建议根据体力安排，可与前日择一游览','需购票']],
15:[['天坛公园','建议玩2–3小时','园内殿宇与公园开放时间不同，请提前确认','需购票'],['雍和宫','建议玩1–2小时','请提前查看预约与入场时间','需购票'],['孔庙和国子监博物馆','建议玩1–2小时','请提前查看预约与当日开放安排','需购票']]
};

export default function DayItinerary({day=13}){
const items=itineraries[day]||itineraries[13];const original=OriginalDay({day});let template;
function find(n,id){if(!React.isValidElement(n))return null;if(n.props['data-node-id']===id)return n;for(const c of React.Children.toArray(n.props.children)){const found=find(c,id);if(found)return found;}return null;}
template=find(original,'358:2074');
function cardTree(n,item,index){if(!React.isValidElement(n))return n;const id=n.props['data-node-id'];if(id==='358:2078')return React.cloneElement(n,{},React.Children.map(n.props.children,child=>React.isValidElement(child)&&child.type==='img'?React.cloneElement(child,{src:dayPhotos[photoOrder[day][index]],alt:item[0]+'景点配图（演示）'}):child));const values={'358:2080':(index+1)+'.'+item[0],'358:2082':item[1],'358:2084':'开放安排以当日公告为准','358:2086':item[3],'358:2095':demoDistances[day][index]||''};if(index===items.length-1&&id==='358:2093')return null;let props={key:id||index};if(id==='358:2098'||id==='358:2099')props.onClick=()=>parent.postMessage({type:'native-action',target:'main:5'},location.origin);return React.cloneElement(n,props,values[id]??React.Children.map(n.props.children,c=>cardTree(c,item,index)));}
const oldNames=['天安门广场','故宫博物馆','景山公园','南锣鼓巷','什刹海风景区'];
function transform(n){if(typeof n==='string'){let t=n.replace('4月12日  周日','4月'+day+'日  周'+({13:'一',14:'二',15:'三'})[day]);oldNames.forEach((name,i)=>{if(t.includes(name))t=items[i]?t.replace(name,items[i][0]):'';});return t;}
if(!React.isValidElement(n))return n;const id=n.props['data-node-id'];const markerIndex={'358:2219':0,'358:2226':1,'358:2212':2,'358:2233':3,'358:2240':4}[id];
if(markerIndex!==undefined){const item=items[markerIndex];if(!item)return null;return <div key={id} className="day-map-label" data-route-name={item[0]} style={{position:'absolute',left:Math.max(8,190-markerIndex*7),top:177-markerIndex*24,display:'flex',gap:4,alignItems:'center',whiteSpace:'nowrap',fontSize:12,color:'white'}}><b style={{borderRadius:'50%',background:'#1fa9ff',border:'1px solid white',width:18,height:18,textAlign:'center',lineHeight:'18px'}}>{markerIndex+1}</b><span style={{background:'#6bc6ff',border:'1px solid white',borderRadius:5,padding:'3px 6px',lineHeight:'16px'}}>{item[0]}</span></div>;}
if(id==='358:2253')return React.cloneElement(n,{},items[items.length-1][0]);
if(id==='358:2073')return React.cloneElement(n,{},items.map((item,i)=>React.cloneElement(cardTree(template,item,i),{key:i})));return React.cloneElement(n,{},React.Children.map(n.props.children,transform));}
return transform(original);
}
