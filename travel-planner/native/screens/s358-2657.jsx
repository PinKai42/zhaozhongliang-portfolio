import TripDate, {tripDate} from '../TripDate';
import OverviewDayContent, {OverviewDayMap, OverviewMapToolbar} from '../OverviewDayContent';
import DateCapsules from '../DateCapsules';
import React from 'react';
const img98507E981D04465A92Ca7Db815Ad6B211 = "./figma-assets/267c41c4-3946-4e37-8100-db14c5db089a.png";
const imgEllipse164 = "./figma-assets/56253f03-7c8e-499f-a388-c3d2875bb283.png";
const imgEllipse167 = "./figma-assets/9d1859c2-888f-433a-8a25-0a9dff48ea33.png";
const imgEllipse166 = "./figma-assets/87fab664-b337-4a64-9120-45ee670b388d.png";
const imgIp1 = "./figma-assets/93b9baf3-a25a-4b05-a1f0-59a9c95d13cc.png";
const imgFrame348 = "./figma-assets/b27ff66d-2b5f-4097-9a66-0236ea307001.svg";
const imgRectangle102 = "./figma-assets/8b096d67-0e65-47b0-b1e0-94d8a0c3c05b.svg";
const imgVector59 = "./figma-assets/1cbe65f2-be2d-44f2-a749-3f1da59b1e0d.svg";
const imgGroup458 = "./figma-assets/64cea2f1-3ff9-4fa9-a0b6-340ee33a6662.svg";
const imgGroup459 = "./figma-assets/0d0faafa-5b34-4ce6-a30e-3e405265efef.svg";
const imgFrame346 = "./figma-assets/4f9abffb-859b-4cd7-84f7-ead4ba78796b.svg";
const imgVector = "./figma-assets/2754115e-dbe1-446e-b8d1-45d8451a7aaa.svg";
const imgGroup467 = "./figma-assets/e12a6f80-cc85-4dae-9be4-f166c1ea7fa6.svg";
const imgFrame = "./figma-assets/c4a6d4a0-d7f6-457f-8af0-793930efe81b.svg";
const imgFrame344 = "./figma-assets/6bfc6c91-d920-4850-8554-47b24bd89d6b.svg";
const imgFrame1 = "./figma-assets/83e7f7a3-0036-43b9-928a-2cd054610a13.svg";
const imgFrame345 = "./figma-assets/f95fa0e1-e3c5-4563-8fc0-a701653956a1.svg";
const imgFrame2 = "./figma-assets/18a2fff5-8279-4d80-81c4-fd0f3fa61401.svg";
const imgFrame3 = "./figma-assets/180ae7b3-cd4a-4612-9ad6-14411af56e57.svg";
const imgFrame4 = "./figma-assets/c871a350-41b6-4313-ad00-7314539309da.svg";
const imgFrame347 = "./figma-assets/21d39574-5989-421c-9bfb-4cb4751868b4.svg";
const imgFrame5 = "./figma-assets/042aed09-59e2-4367-9383-d15e6a23a135.svg";
const imgFrame2147232616 = "./figma-assets/0c42a4fc-6296-4359-8122-98fb44e45d86.svg";
const imgRectangle349 = "./figma-assets/a5b30935-ff90-42f9-a63b-bdeea2856285.svg";
const imgFrame6 = "./figma-assets/e987bf04-281f-4329-b845-32c6fb44ea25.svg";
const imgR = "./figma-assets/01cbd34d-4476-40fb-80c1-13e909a26740.svg";
const imgRectangle346247226 = "./figma-assets/6928055f-da06-478e-9b37-6457574523f2.svg";
const imgR1 = "./figma-assets/f1ba1355-c38e-4f59-a2f9-d74cce0cd543.svg";
const imgRectangle346247227 = "./figma-assets/8d0510e0-e5ba-4b9a-9e3f-5fe07a6bb90c.svg";
const imgR2 = "./figma-assets/4b95f64f-109b-483c-a668-91452b12b942.svg";
const imgRectangle346247228 = "./figma-assets/a985f1e4-c2c3-489e-9845-e70fda928abb.svg";

export default function IPhone13144() {
  const [days,setDays]=React.useState([{"id":0,"date":"4.12 周日","weather":"⛅24°C~32°C","route":"天安门广场 → 故宫博物院 → 景山公园 → 南锣鼓巷 → 什刹海风景区"},{"id":1,"date":"4.13 周一","weather":"⛅25°C~33°C","route":"八达岭长城 → 鸟巢（国家体育场） → 水立方（国家游泳中心）→ 景山公园"},{"id":2,"date":"4.14 周二","weather":"⛅22°C~31°C","route":"颐和园 → 圆明园 → 前门大街 → 景山公园"},{"id":3,"date":"4.15 周三","weather":"⛅25°C~32°C","route":"天坛公园 → 雍和宫 → 孔庙和国子监博物馆"}]);
  const [departure,setDeparture]=React.useState(()=>localStorage.getItem('trip-departure')||'2026-04-12');
  function changeDeparture(value){setDeparture(value);localStorage.setItem('trip-departure',value);}
  function dayLabel(id){const d=tripDate(departure,id);return d.month+'.'+d.day+' 周'+d.week;}
  const [selectedDay,setSelectedDay]=React.useState(null);
  const screenRef=React.useRef(null);
  React.useLayoutEffect(()=>{
    const host=screenRef.current;
    const panel=document.createElement('div');panel.className='overview-scroll-panel';panel.setAttribute('aria-label','行程内容，可上下滚动');
    const content=document.createElement('div');content.className='overview-scroll-content';panel.append(content);
    [...host.children].forEach(node=>{const id=Number((node.dataset.nodeId||'').split(':')[1]);if([2830,2831].includes(id)||(id>=2709&&id<=2757)||node.classList.contains('itinerary-cards'))content.append(node);});
    panel.append(host.querySelector('.overview-day-host'));
    host.append(panel);
  },[]);
  React.useLayoutEffect(()=>{const host=screenRef.current;host.querySelector('.overview-scroll-content').style.display=selectedDay?'none':'';host.querySelector('.overview-day-host').style.display=selectedDay?'block':'none';host.querySelector('.overview-scroll-panel').scrollTop=0;[...host.children].forEach(node=>{const id=Number((node.dataset.nodeId||'').split(':')[1]);if(id===2658||(id>=2794&&id<=2829))node.style.display=selectedDay?'none':'';});},[selectedDay]);
  return (
    <div ref={screenRef} className="bg-white relative size-full overview-fixed-screen" data-node-id="358:2657" data-name="iPhone 13 & 14 - 4">
      <div className="absolute h-[370.894px] left-0 top-[-78.67px] w-[390px]" data-node-id="358:2658" data-name="98507e98-1d04-465a-92ca-7db815ad6b21 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img98507E981D04465A92Ca7Db815Ad6B211} />
      </div>
      <div className="absolute left-[335px] size-[40px] top-[208px]" data-node-id="358:2659">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame348} />
      </div>
      <div className="absolute h-[847px] left-0 top-[254px] w-[390px]" data-node-id="358:2662">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRectangle102} />
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Alibaba_PuHuiTi:Heavy'] justify-center leading-[0] left-[17px] not-italic text-[#2b3940] text-[24px] top-[calc(50%-264px)] whitespace-nowrap" data-node-id="358:2663">
        <p className="leading-[normal]">北京4日游</p>
      </div>
      <div className="-translate-x-1/2 absolute h-0 left-1/2 top-[262px] w-[32px]" data-node-id="358:2664">
        <div className="absolute inset-[-2px_-6.25%]">
          <img alt="" className="block max-w-none size-full" src={imgVector59} />
        </div>
      </div>
      <div className="absolute left-[16px] size-[40px] top-[44px]" data-node-id="358:2665">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup458} />
      </div>
      <div className="absolute left-[334px] size-[40px] top-[44px]" data-node-id="358:2668">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup459} />
      </div>
      <div className="absolute contents left-[17px] top-[305px]" data-node-id="358:2673">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['PingFang_SC:Bold'] justify-center leading-[0] left-[17px] not-italic text-[#62686e] text-[14px] top-[321px] whitespace-nowrap" data-node-id="358:2674">
          <TripDate value={departure} onChange={changeDeparture}/>
        </div>
        <div className="absolute h-[31px] left-[211px] top-[305px] w-[27px]" data-node-id="358:2675">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame346} />
        </div>
      </div>
      <div className="absolute contents left-[314px] top-[305px]" data-node-id="358:2677">
        <div className="absolute left-[314px] size-[24px] top-[305px]" data-node-id="358:2678">
          <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse164} width="24" />
        </div>
        <div className="absolute left-[332px] size-[24px] top-[305px]" data-node-id="358:2679">
          <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse167} width="24" />
        </div>
        <div className="absolute contents left-[350px] top-[305px]" data-node-id="358:2680">
          <div className="absolute contents left-[350px] top-[305px]" data-node-id="358:2681">
            <div className="absolute left-[350px] size-[24px] top-[305px]" data-node-id="358:2682">
              <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse166} width="24" />
            </div>
            <div className="-translate-y-1/2 absolute aspect-[10.560001373291016/10.560001373291016] left-[91.79%] right-[6.15%] top-[calc(50%-233.5px)]" data-node-id="358:2683" data-name="Vector">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-[278px] size-[40px] top-[44px]" data-node-id="358:2684">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup467} />
      </div>
      <DateCapsules startDate={departure} overview day={selectedDay} onChange={setSelectedDay}/>
      <div className="absolute bg-[#e2f3ff] h-[147px] left-[29px] rounded-[20px] top-[390px] w-[329px]" data-node-id="358:2709" />
      <div className="absolute bg-[#c2e6ff] h-[40px] left-[29px] rounded-tl-[20px] rounded-tr-[20px] top-[390px] w-[329px]" data-node-id="358:2710" />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Figma_Hand:Regular'] font-normal justify-center leading-[0] left-[88px] text-[#366180] text-[16px] top-[410px] whitespace-nowrap" data-node-id="358:2711">
        <p className="leading-[normal]">Ai小骆Tips：</p>
      </div>
      <p className="[word-break:break-word] absolute font-['PingFang_SC:Bold'] h-[83px] leading-[0] left-[45px] not-italic text-[#27475f] text-[14px] top-[439px] w-[297px] whitespace-pre-wrap" data-node-id="358:2712">
        <span className="leading-[normal]">{`      故宫博物院、中国国家博物馆、毛主席纪念堂等场馆通常`}</span>
        <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[normal] text-[#1fa9ff] underline">需提前预约</span>
        <span className="leading-[normal]">；长城单日往返距离较长，建议尽早出发。周一部分博物馆闭馆，安排行程时需留意开放时间。</span>
      </p>
      <div className="itinerary-cards">
        {days.map(day=><article className="itinerary-day" key={day.id}>
          <button className="itinerary-open" aria-label={'查看'+dayLabel(day.id)+'行程'} onClick={()=>setSelectedDay(12+day.id)}>
            <div className="itinerary-meta"><span>{dayLabel(day.id)}</span><span>{day.weather}</span></div>
            <p>{day.route}</p><span className="itinerary-chevron" aria-hidden="true">›</span>
          </button>
          <button className="itinerary-delete" aria-label={'删除'+dayLabel(day.id)+'行程'} onClick={()=>setDays(current=>current.filter(item=>item.id!==day.id))}><img src={imgFrame1} alt=""/></button>
        </article>)}
        <div className="itinerary-pending">待规划<span aria-hidden="true">＋</span></div>
      </div>
      <div className="absolute contents left-px top-0" data-node-id="358:2758">
        <div className="absolute h-[44.353px] left-px rounded-[15px] top-[1056.65px] w-[390px]" data-node-id="358:2759" data-name="home栏">
          <div className="absolute bg-[rgba(245,245,245,0)] h-[34px] left-0 top-0 w-[375px]" data-node-id="358:2760" />
          <div className="-translate-x-1/2 absolute bg-black bottom-[8.36px] h-[5px] left-[calc(50%-0.5px)] rounded-[100px] w-[134px]" data-node-id="358:2761" data-name="Home Indicator" />
        </div>
        <div className="absolute h-[57.398px] left-px overflow-clip rounded-[15px] top-0 w-[390px]" data-node-id="358:2762">
          <div className="absolute h-[44px] left-[7px] overflow-clip right-[8px] top-0" data-node-id="358:2763" data-name="状态栏">
            <div className="absolute bg-[rgba(255,255,255,0)] inset-0" data-node-id="358:2764" data-name="Rectangle" />
            <div className="absolute content-stretch flex h-[17px] items-center justify-between left-[21px] right-[14.34px] top-[15px]" data-node-id="358:2765">
              <div className="h-[17px] overflow-clip relative shrink-0 w-[54px]" data-node-id="358:2766" data-name="Time Style">
                <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro_Text:Semibold'] leading-[0] left-[27px] not-italic text-[14px] text-black text-center top-[calc(50%-8px)] tracking-[-0.28px] w-[54px]" data-node-id="358:2767">
                  <span className="leading-[normal]">9:4</span>
                  <span className="leading-[normal]">1</span>
                </p>
              </div>
              <div className="h-[11.336px] relative shrink-0 w-[66.661px]" data-node-id="358:2768">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame5} />
              </div>
            </div>
          </div>
          <div className="absolute h-[844px] left-0 top-0 w-[24px]" data-node-id="358:2782" />
        </div>
      </div>
      <div className="absolute left-[330px] size-[22.627px] top-[395px]" data-node-id="358:2783">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2147232616} />
      </div>
      <div className="absolute contents left-[13px] top-[1015px]" data-node-id="358:2785">
        <div className="absolute h-[54px] left-[13px] top-[1015px] w-[364px]" data-node-id="358:2786">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRectangle349} />
        </div>
        <div className="-translate-y-1/2 absolute left-[332px] size-[30px] top-[calc(50%+491.5px)]" data-node-id="358:2787" data-name="Frame">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame6} />
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['PingFang_SC:Bold'] justify-center leading-[0] left-[32.38px] not-italic text-[#cecece] text-[16px] top-[1042px] whitespace-nowrap" data-node-id="358:2793">
          <p className="leading-[normal]">发消息或按住说话...</p>
        </div>
      </div>
      <div className="absolute contents left-[113.96px] top-[35.25px]" data-node-id="358:2794">
        <div className="absolute contents left-[113.96px] top-[46.54px]" data-node-id="358:2795">
          <div className="absolute h-[46.709px] left-[113.96px] top-[46.54px] w-[82.04px]" data-node-id="358:2796" data-name="r">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgR} />
          </div>
          <div className="[word-break:break-word] absolute contents font-['PingFang_SC:Bold'] leading-[0] left-[121.32px] not-italic top-[52.83px] whitespace-nowrap" data-node-id="358:2797">
            <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[121.32px] text-[12.863px] text-black top-[61.83px]" data-node-id="358:2798">
              <p className="leading-[normal]">八达岭长城</p>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[121.32px] text-[#1fa9ff] text-[12.005px] top-[78.74px]" data-node-id="358:2799">
              <p className="leading-[normal]">还有2个地点</p>
            </div>
          </div>
        </div>
        <div className="absolute contents left-[113.96px] top-[35.25px]" data-node-id="358:2800">
          <div className="absolute h-[16.127px] left-[113.96px] top-[35.25px] w-[41.932px]" data-node-id="358:2801">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRectangle346247226} />
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['MiSans:Medium'] justify-center leading-[0] left-[calc(50%-73.58px)] not-italic text-[10.29px] text-white top-[calc(50%-507.04px)] whitespace-nowrap" data-node-id="358:2802">
            <p className="leading-[normal]">第2天</p>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[152.48px] top-[142.56px]" data-node-id="358:2803">
        <div className="absolute contents left-[152.48px] top-[153.84px]" data-node-id="358:2804">
          <div className="absolute h-[46.707px] left-[152.48px] top-[153.84px] w-[82.037px]" data-node-id="358:2805" data-name="r">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgR1} />
          </div>
          <div className="[word-break:break-word] absolute contents font-['PingFang_SC:Bold'] leading-[0] left-[159.84px] not-italic top-[160.14px] whitespace-nowrap" data-node-id="358:2806">
            <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[159.84px] text-[12.862px] text-black top-[169.14px]" data-node-id="358:2807">
              <p className="leading-[normal]">颐和园</p>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[159.84px] text-[#1fa9ff] text-[12.005px] top-[186.04px]" data-node-id="358:2808">
              <p className="leading-[normal]">还有2个地点</p>
            </div>
          </div>
        </div>
        <div className="absolute contents left-[152.48px] top-[142.56px]" data-node-id="358:2809">
          <div className="absolute h-[16.127px] left-[152.48px] top-[142.56px] w-[41.931px]" data-node-id="358:2810">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRectangle346247227} />
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['MiSans:Medium'] justify-center leading-[0] left-[calc(50%-35.06px)] not-italic text-[10.29px] text-white top-[calc(50%-399.75px)] whitespace-nowrap" data-node-id="358:2811">
            <p className="leading-[normal]">第3天</p>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[202.46px] top-[165.5px]" data-node-id="358:2812">
        <div className="absolute contents left-[202.46px] top-[176.79px]" data-node-id="358:2813">
          <div className="absolute h-[46.707px] left-[202.46px] top-[176.79px] w-[82.037px]" data-node-id="358:2814" data-name="r">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgR1} />
          </div>
          <div className="[word-break:break-word] absolute contents font-['PingFang_SC:Bold'] leading-[0] left-[209.83px] not-italic top-[183.08px] whitespace-nowrap" data-node-id="358:2815">
            <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[209.83px] text-[12.862px] text-black top-[192.08px]" data-node-id="358:2816">
              <p className="leading-[normal]">天坛公园</p>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[209.83px] text-[#1fa9ff] text-[12.005px] top-[208.99px]" data-node-id="358:2817">
              <p className="leading-[normal]">还有2个地点</p>
            </div>
          </div>
        </div>
        <div className="absolute contents left-[202.46px] top-[165.5px]" data-node-id="358:2818">
          <div className="absolute h-[16.127px] left-[202.46px] top-[165.5px] w-[41.931px]" data-node-id="358:2819">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRectangle346247227} />
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['MiSans:Medium'] justify-center leading-[0] left-[calc(50%+14.93px)] not-italic text-[10.29px] text-white top-[calc(50%-376.8px)] whitespace-nowrap" data-node-id="358:2820">
            <p className="leading-[normal]">第4天</p>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[173.45px] top-[174.13px]" data-node-id="358:2821">
        <div className="absolute contents left-[173.45px] top-[185.42px]" data-node-id="358:2822">
          <div className="absolute h-[46.71px] left-[173.45px] top-[185.42px] w-[82.041px]" data-node-id="358:2823" data-name="r">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgR2} />
          </div>
          <div className="[word-break:break-word] absolute contents font-['PingFang_SC:Bold'] leading-[0] left-[180.81px] not-italic top-[191.72px]" data-node-id="358:2824">
            <div className="-translate-y-1/2 absolute flex flex-col h-[18.294px] justify-center left-[180.81px] text-[11.395px] text-black top-[200.87px] w-[65.173px]" data-node-id="358:2825">
              <p className="leading-[normal]">故宫博物馆</p>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col h-[17.151px] justify-center left-[180.81px] text-[#1fa9ff] text-[12.005px] top-[217.7px] w-[67.46px]" data-node-id="358:2826">
              <p className="leading-[normal]">还有4个地点</p>
            </div>
          </div>
        </div>
        <div className="absolute contents left-[173.45px] top-[174.13px]" data-node-id="358:2827">
          <div className="absolute h-[16.128px] left-[173.45px] top-[174.13px] w-[41.933px]" data-node-id="358:2828">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRectangle346247228} />
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['MiSans:Medium'] h-[13.721px] justify-center leading-[0] left-[calc(50%-14.09px)] not-italic text-[9.116px] text-white top-[calc(50%-368.3px)] w-[25.155px]" data-node-id="358:2829">
            <p className="leading-[normal]">第1天</p>
          </div>
        </div>
      </div>
      <div className="absolute h-[32px] left-[37px] top-[395px] w-[45px]" data-node-id="358:2830" data-name="IP 头 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgIp1} />
      </div>
      <div className="absolute bg-gradient-to-b content-stretch flex from-[#63d3ff] from-[9.163%] h-[13px] items-center justify-center left-[66px] px-[4px] py-[2px] rounded-[15px] to-[#2683e9] top-[417px] w-[19px]" data-node-id="358:2831">
        <div className="[word-break:break-word] flex flex-col font-['Alibaba_PuHuiTi:Heavy'] justify-center leading-[0] not-italic relative shrink-0 text-[8px] text-center text-white whitespace-nowrap" data-node-id="358:2832">
          <p className="leading-[normal]">AI</p>
        </div>
      </div>
      <OverviewMapToolbar day={selectedDay} onBack={()=>selectedDay?setSelectedDay(null):parent.postMessage({type:"native-action",target:"back"},location.origin)}/>
      <div className="overview-map-host">{selectedDay&&<OverviewDayMap day={selectedDay}/>}</div>
      <div className="overview-day-host">{selectedDay&&<OverviewDayContent day={selectedDay} startDate={departure}/>}</div>
    </div>
  );
}


