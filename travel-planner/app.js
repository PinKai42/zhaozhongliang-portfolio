(function () {
  'use strict';

  /* ==================================================
     1. Screens: original images + interactive hotspots
     off: 顶部裁剪偏移（% 图片高度）
     back: 界面左上角返回箭头热区（对齐原截图，null = 该界面无返回入口）
     hs: 可点击热区 go: 'next' | 'main:n' 主流程第n步 | 'home:n'/'trips:n' | null
     ================================================== */
  var BACK_ARROW = { x: 2.5, y: 4, w: 11, h: 6.5 };

  var SCREENS = {
    'home': {
      img: 'home.png', off: 0, back: null,
      hs: [{ x: 70, y: 5, w: 26, h: 6.5, label: '点击 AI助手', go: 'next', below: true }]
    },
    'trips': {
      img: 'trips.png', off: 0, back: null,
      hs: [{ x: 78, y: 75, w: 21, h: 13, label: '点击「+」新建', go: 'next' }]
    },
    'trips-plus': {
      img: 'trips-plus.png', off: 0,
      back: { x: 43, y: 90, w: 14, h: 6 }, /* 弹窗底部关闭 × */
      hs: [{ x: 3, y: 60.5, w: 94, h: 12.5, label: 'AI规划行程', go: 'next' }]
    },
    'form': {
      img: 'form.png', off: 0, back: BACK_ARROW,
      hs: [
        { x: 6, y: 47, w: 88, h: 8, label: 'AI规划行程 · 直接发送', go: 'next' },
        { x: 71, y: 12, w: 19, h: 5.5, label: '去问问 · 不发送', go: 'home:1' }
      ]
    },
    'chat-idle': {
      img: 'chat-idle.png', off: 0, back: BACK_ARROW,
      hs: [{ x: 3, y: 80, w: 94, h: 17, label: '输入需求，点击发送', go: 'main:0' }]
    },
    'chat-thinking-top': {
      img: 'chat-thinking.png', off: 0, back: BACK_ARROW, hs: []
    },
    'chat-thinking': {
      img: 'chat-thinking.png', off: 0, back: BACK_ARROW,
      hs: [{ x: 28, y: 93, w: 44, h: 3.5, label: '停止生成 · 可随时中断', go: null }]
    },
    'chat-done': {
      img: 'chat-done.png', off: 0, back: BACK_ARROW,
      hs: [{ x: 6, y: 89.5, w: 84, h: 6, label: 'GO! 进入图册编辑模式', go: 'main:3' }]
    },
    'overview': {
      img: 'overview.png', off: 0, back: BACK_ARROW,
      hs: [{ x: 6, y: 49.5, w: 88, h: 8.5, label: '4.12 周日 · 查看单日路线', go: 'main:4' },{ x:24,y:31.3,w:17,h:3.1,label:'04月12日 · 查看单日路线',go:'main:4',below:true },{ x:85,y:18.7,w:12,h:4.2,label:'放大地图',go:'map-expand' }]
    },
    'day-list': {
      img: 'day-list.png', off: 0, back: BACK_ARROW,
      hs: [
        { x:85.9, y:17.16, w:10.3, h:3.2, label:'放大地图', go:'map-expand' },
        { x: 4, y: 23.7, w: 17, h: 2.7, label: '总揽 · 返回四日行程', go: 'main:3' },
        { x: 70, y: 26.5, w: 23, h: 4, label: '优化路线', go: null },
        { x: 18, y: 40.5, w: 10, h: 1.8, label: '天安门广场至故宫 · 导航', go: 'main:5' },
        { x: 16, y: 52, w: 10, h: 1.8, label: '故宫至景山公园 · 导航', go: 'main:5' },
        { x: 18, y: 63.5, w: 10, h: 1.8, label: '景山公园至南锣鼓巷 · 导航', go: 'main:5' },
        { x: 17, y: 75, w: 10, h: 1.8, label: '南锣鼓巷至什刹海 · 导航', go: 'main:5' }
      ]
    },
    'export': {
      img: 'export.png', off: 0, back: BACK_ARROW,
      hs: [{ x: 5, y: 63, w: 90, h: 7, label: '导出到高德地图', go: 'demo-map' }, { x: 5, y: 71.5, w: 90, h: 7, label: '导出到腾讯地图', go: 'demo-map' }, { x: 5, y: 80, w: 90, h: 7, label: '导出到苹果地图', go: 'demo-map' }, { x:43,y:89,w:14,h:6,label:'关闭导出，返回单日路线',go:'main:4' }]
    }
  };

  /* 所有长图首次展示统一从图片顶部开始（off 全部为 0）；
     若高亮热区落在首屏之外，提示改为「向下滚动」引导 */
  var IMG_RATIO = { 'chat-done.png': 5.421, 'chat-thinking.png': 3.887, 'day-list.png': 3.213, 'overview.png': 2.823 };
  var SCREEN_RATIO = 848 / 390;

  function screenHint(def) {
    var ratio = IMG_RATIO[def.img] || 2.164;
    var belowFold = def.hs.some(function (h) { return (h.y / 100) * ratio > SCREEN_RATIO; });
    return belowFold ? '↓ 向下滚动查看高亮区域' : '上下滚动查看完整界面 · 点高亮区继续';
  }

  /* ==================================================
     2. Journey flows（按修正后的真实流程）
     首页入口：AI助手 → 对话页（直达，不经表单）
     行程入口：+ → 弹窗 AI规划行程 → 表单 → 对话页（直接发送）
     表单页「去问问」→ 对话页（不发送）
     ================================================== */
  var flows = {
    home: {
      name: '首页入口',
      steps: [
        { screen: 'home', title: '点击 AI 助手入口', short: '首页右上角，常驻可见',
          user: '在首页浏览时，点击右上角「AI助手」气泡。',
          ai: '入口常驻首页右上角，任何浏览状态都可直达 AI 能力。',
          result: '直接进入 AI 对话页——不经表单，小骆待命。',
          branch: '首页入口：直达对话，随想随问。',
          note: '试试：点击手机中高亮的「AI助手」。' },
        { screen: 'chat-idle', title: '对话页输入需求', short: '文字或语音，说清一件事',
          user: '在输入框描述：从济南出发、情侣出行、北京玩4天。',
          ai: '把自然语言解析为结构化条件，发送后直接开始生成行程。',
          result: '需求发送成功，进入深度思考生成阶段。',
          branch: '表单页点「去问问」也会进入这里，但不会自动发送。',
          note: '试试：点击底部输入框，直接发送生成。' }
      ]
    },
    trips: {
      name: '行程入口',
      steps: [
        { screen: 'trips', title: '行程页点击「+」', short: '管理行程时顺手发起',
          user: '在行程页查看已有行程，点击右下角「+」。',
          ai: '弹出「开始新的旅行」面板，小骆引导下一步。',
          result: '面板展示：AI规划行程 / 添加航班 / 添加火车。',
          branch: '入口 B：从既有行程管理场景自然延伸。',
          note: '试试：点击右下角高亮的「+」。' },
        { screen: 'trips-plus', title: '选择「AI规划行程」', short: '弹窗第一项即 AI 路径',
          user: '在弹窗中选择「AI规划行程」。',
          ai: '与添加航班、添加火车并列，AI 规划是默认推荐。',
          result: '进入「AI行程助手」条件表单页。',
          branch: '只想同步订单时走另外两项，不打扰 AI 流程。',
          note: '试试：点击「AI规划行程」。' },
        { screen: 'form', title: '填写出行条件', short: '表单承接结构化信息',
          user: '确认出发地、目的地、天数与旅行偏好。',
          ai: '把硬条件整理成表单字段，缺失项留给用户补充。',
          result: '两个出口：「AI规划行程」→ 对话并直接发送；「去问问」→ 对话但不发送。',
          branch: '点「去问问」跳过表单，直接对话、不自动发送。',
          note: '试试：点击「AI规划行程」，或右上角「去问问」。' },
        { screen: 'chat-thinking-top', title: '汇入对话，直接发送', short: '条件自动变成消息发出',
          user: '表单条件自动整理成一条需求消息并发送。',
          ai: '收到条件后立即开始生成，展示实时进度。',
          result: '进入共同主流程的生成阶段，与首页入口汇合。',
          branch: '两个入口在此汇成一条流程。',
          note: '此后进入共同主流程。' }
      ]
    },
    main: {
      name: '共同主流程',
      steps: [
        { screen: 'chat-idle', title: '输入并发送需求', short: '一句话成为任务起点',
          user: '检查输入框中的需求，点击发送。',
          ai: '解析条件：济南 → 北京 · 4天 · 情侣出行，启动生成。',
          result: '消息发送，进入深度思考。',
          branch: '信息缺失时 AI 只追问必要项，不重复已知条件。',
          note: '试试：点击输入框发送。' },
        { screen: 'chat-thinking', title: '小骆深度思考', short: '分步展示进度，可随时停止',
          user: '查看实时进度：找景点 → 选酒店 → 排路线。',
          ai: '按阶段展示中间成果，附带参考图片与地图预览。',
          result: '进度推进中（示例 66%），完成后自动进入成果。',
          branch: '等待焦虑的出口：「停止生成」随时可用。',
          note: '试试：点击底部「停止生成」查看提示。' },
        { screen: 'chat-done', title: '查看生成成果', short: '先看清单，再进行程',
          user: '核对五项生成结果与「北京4日游」卡片。',
          ai: '汇总景点、酒店、交通方案、贴士与每日安排。',
          result: '点击 GO! 进入图册编辑模式，查看完整行程。',
          branch: '对成果不满意时，可直接在对话里继续调整。',
          note: '试试：点击「进入图册编辑模式 GO!」。' },
        { screen: 'overview', title: '总览四日行程', short: '地图看空间，卡片看日程',
          user: '查看总揽：四天路线、天气与每日顺序。',
          ai: '提供小骆Tips：预约提醒、开放时间、行程节奏。',
          result: '地图与日程联动，每一天都有对应卡片。',
          branch: '某天不合适可删除重排，也可以继续对话调整。',
          note: '试试：点击 4.12 卡片查看单日路线。' },
        { screen: 'day-list', title: '查看单日路线', short: '逐点导航，支持优化',
          user: '查看 4月12日 五个景点的顺序、时长与距离。',
          ai: '给出点间距离与「优化路线」入口，导航可直接跳转。',
          result: '每个景点可看开放时间与建议游玩时长。',
          branch: '节奏不合适？对 AI 说“我第二天不想这么累”。',
          note: '试试：点击景点之间的「导航」，进入地图导出页。' },
        { screen: 'export', title: '导出到地图落地', short: '规划走出 App 才算完成',
          user: '选择高德 / 腾讯 / 苹果地图导出路线。',
          ai: '把确认过的行程交给地图应用执行。',
          result: '生成一份可导航的路线，旅行时直接跟随。',
          branch: '导出后行程仍保留在 App 内，可返回继续调整。',
          note: '试试：点击「高德地图」完成导出。' }
      ]
    }
  };

  /* 两条完整流程链：各自的入口段 + 汇合后共用的一段主流程（tail 为同一组步骤对象） */
  var CHAINS = [
    { id: 'a', name: '流程 A · 对话发起', shortName: '流程 A', entry: flows.home.steps, tail: flows.main.steps },
    { id: 'b', name: '流程 B · 表单发起', shortName: '流程 B', entry: flows.trips.steps, tail: flows.main.steps }
  ];
  CHAINS.forEach(function (c) {
    c.steps = c.entry.concat(c.tail);
    c.entryCount = c.entry.length;
    c.total = c.steps.length;
  });

  function findStepInChain(stepObj, chainIndex) {
    return CHAINS[chainIndex].steps.indexOf(stepObj);
  }

  var decisions = [
    ['地图与清单互补', '地图呈现地点分布，日期卡片呈现游玩顺序。用户可以先判断路线是否集中，再检查每天的安排；需要看清地点时，可放大地图。'],
    ['总览与单日分层', '用「总揽」与日期胶囊切换查看范围，点击当天卡片进入单日路线。先看整体，再看细节，减少首屏信息堆叠。'],
    ['让 AI 提示靠近决策', '将预约、开放时间等提醒放在日期导航下、每日卡片前。用户检查安排时即可看到影响出行的条件，提示内容仍需真实数据支持。'],
    ['保留继续调整的入口', '以每日卡片组织天气、景点顺序等信息，底部保留对话入口，承接修改需求。当前原型主要演示查看与导航，真实重排能力待接入。']
  ];

  /* ==================================================
     3. Journey rendering
     ================================================== */
  var chain = 0, step = 0;
  var journeySection = document.getElementById('journey');
  var listEl = document.getElementById('journey-list');
  var screenEl = document.getElementById('journey-screen');
  var detailEl = document.getElementById('journey-detail');
  var tryEl = document.getElementById('flow-try');
  var areaEl = journeySection.querySelector('.journey-phone-area');

  function num(i) { return String(i + 1).padStart(2, '0'); }

  /* --------------------------------------------------
     手机界面上下滚动：滚轮 / 拖动 / 方向键 / 触摸
     -------------------------------------------------- */
  var scrollBoxes = [];

  function setupPhoneScroll(box, opts) {
    if (!box) return;
    opts = opts || {};
    var phone = box.closest('.phone') || box.parentElement;
    var ui = phone.querySelector('.pscroll-ui');
    if (!ui) {
      ui = document.createElement('div');
      ui.className = 'pscroll-ui';
      ui.setAttribute('aria-hidden', 'true');
      ui.innerHTML = '<span class="psc-fade top"></span><span class="psc-fade bottom"></span>' +
        '<span class="psc-bar"><i></i></span><span class="psc-hint"></span>';
      phone.appendChild(ui);
    }
    var fadeT = ui.querySelector('.psc-fade.top');
    var fadeB = ui.querySelector('.psc-fade.bottom');
    var bar = ui.querySelector('.psc-bar');
    var thumb = bar.querySelector('i');
    var hint = ui.querySelector('.psc-hint');
    hint.textContent = opts.hint || '上下滚动查看完整界面';
    box.tabIndex = 0;
    box.setAttribute('aria-label', opts.label || '界面内容，可上下滚动');

    var off = parseFloat(box.dataset.off || '0');
    var hintTimer = null;

    function maxScroll() { return Math.max(0, box.scrollHeight - box.clientHeight); }

    function sync() {
      var max = maxScroll(), st = box.scrollTop, scrollable = max > 6;
      box.classList.toggle('can-scroll', scrollable);
      fadeT.classList.toggle('on', scrollable && st > 6);
      fadeB.classList.toggle('on', scrollable && st < max - 6);
      bar.classList.toggle('on', scrollable);
      if (scrollable) {
        thumb.style.height = Math.max(12, Math.min(1, box.clientHeight / box.scrollHeight) * 100) + '%';
        thumb.style.top = (st / box.scrollHeight * 100) + '%';
      }
      return scrollable;
    }

    function placeOff() {
      var max = maxScroll();
      box.scrollTop = max > 6 ? Math.min(max, off / 100 * box.scrollHeight) : 0;
      sync();
      showHint();
    }

    function showHint() {
      clearTimeout(hintTimer);
      hint.classList.remove('on');
      if (opts.hint === false || maxScroll() <= 6) return;
      hintTimer = setTimeout(function () {
        hint.classList.add('on');
        hintTimer = setTimeout(function () { hint.classList.remove('on'); }, 4200);
      }, 900);
    }

    if (!box.__psReady) {
      box.__psReady = true;
      scrollBoxes.push(box);
      box.__placeOff = placeOff;

      box.addEventListener('scroll', sync, { passive: true });

      /* 滚轮：在界面内上下滚动，到顶/到底后交还给页面 */
      box.addEventListener('wheel', function (e) {
        if (opts.wheel === false) return;
        var max = maxScroll();
        if (max <= 6) return;
        var d = e.deltaY;
        if (!d) return;
        if (e.deltaMode === 1) d *= 16;
        else if (e.deltaMode === 2) d *= box.clientHeight;
        var st = box.scrollTop;
        if ((d < 0 && st <= 0) || (d > 0 && st >= max - 1)) return;
        e.preventDefault();
        box.scrollTop = Math.max(0, Math.min(max, st + d));
        hint.classList.remove('on');
      }, { passive: false });

      /* 拖动：按住画面上下拖，像在手机上滑动（仅位移超阈值后才捕获指针，避免吃掉热区点击） */
      var dragging = false, startY = 0, startTop = 0, moved = false;
      box.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse') return; /* 触摸交给容器原生滚动 */
        if (maxScroll() <= 6) return;
        dragging = true; moved = false; startY = e.clientY; startTop = box.scrollTop;
      });
      box.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var dy = e.clientY - startY;
        if (!moved && Math.abs(dy) > 5) {
          moved = true;
          box.classList.add('is-grabbing');
          hint.classList.remove('on');
          try { box.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
        }
        if (moved) box.scrollTop = Math.max(0, Math.min(maxScroll(), startTop - dy));
      });
      function endDrag() { if (dragging) { dragging = false; box.classList.remove('is-grabbing'); } }
      box.addEventListener('pointerup', endDrag);
      box.addEventListener('pointercancel', endDrag);
      box.addEventListener('click', function (e) {
        if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
      }, true);

      /* 方向键 / PageUp·Down：容器可聚焦时浏览器原生滚动 */
      box.addEventListener('keydown', function (e) {
        var max = maxScroll();
        if (max <= 6) return;
        var stepPx = box.clientHeight * (e.key === 'PageUp' || e.key === 'PageDown' ? 0.9 : 0.18);
        if (e.key === 'ArrowDown') { box.scrollTop = Math.min(max, box.scrollTop + stepPx); e.preventDefault(); }
        else if (e.key === 'ArrowUp') { box.scrollTop = Math.max(0, box.scrollTop - stepPx); e.preventDefault(); }
        else if (e.key === 'PageDown') { box.scrollTop = Math.min(max, box.scrollTop + stepPx); e.preventDefault(); }
        else if (e.key === 'PageUp') { box.scrollTop = Math.max(0, box.scrollTop - stepPx); e.preventDefault(); }
        else if (e.key === 'Home') { box.scrollTop = 0; e.preventDefault(); }
        else if (e.key === 'End') { box.scrollTop = max; e.preventDefault(); }
      });
    }

    var img = box.querySelector('img');
    function ready() { requestAnimationFrame(function () { requestAnimationFrame(placeOff); }); }
    if (img && !img.complete) {
      img.addEventListener('load', ready, { once: true });
      img.addEventListener('error', ready, { once: true });
    }
    ready();
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      scrollBoxes.forEach(function (b) { if (b.__placeOff) b.__placeOff(); });
    }, 180);
  });


  var selectedDay = 12;
  var formPrompt = null;
  var journeyLiveFrame = null, journeyLiveReady = false, journeyLiveChain = -1;
  var liveScreens = ['chat-idle','chat-thinking-top','chat-thinking','chat-done'];
  function liveStage(screen) { return screen === 'chat-done' ? 'completed' : screen === 'chat-thinking' ? 'thinking' : screen === 'chat-thinking-top' ? 'sent' : 'input'; }
  function updateLiveSize() {
    if(journeyLiveFrame) journeyLiveFrame.style.transform='scale('+(screenEl.clientWidth/390)+')';
  }
  new ResizeObserver(updateLiveSize).observe(screenEl);
  function setJourneyLive(screen) {
    screenEl.classList.add('journey-live-screen');
    screenEl.closest('.phone').classList.add('has-live-journey');
    if(!journeyLiveFrame) {
      journeyLiveFrame=document.createElement('iframe');
      journeyLiveFrame.className='journey-live-frame';
      journeyLiveFrame.title='小骆旅行助手连续交互流程';
      journeyLiveFrame.src='travel-flow/index.html?journey=1';
      journeyLiveFrame.addEventListener('load',function(){journeyLiveReady=true;journeyLiveFrame.contentWindow.postMessage({type:'journey-command',prompt:formPrompt,stage:liveStage(CHAINS[chain].steps[step].screen)},location.origin);});
    }
    screenEl.querySelectorAll('iframe[data-native]').forEach(function(f){f.style.visibility='hidden';});
    if(journeyLiveFrame.parentElement!==screenEl)screenEl.append(journeyLiveFrame);journeyLiveFrame.style.visibility='visible';
    updateLiveSize();
    if(journeyLiveReady) journeyLiveFrame.contentWindow.postMessage({type:'journey-command',prompt:formPrompt,stage:liveStage(screen)},location.origin);
    journeyLiveChain=chain;
  }
  window.addEventListener('message',function(e){
    if(e.origin!==location.origin||!journeyLiveFrame||e.source!==journeyLiveFrame.contentWindow||e.data?.type!=='journey-state')return;
    if(!screenEl.contains(journeyLiveFrame)||journeyLiveFrame.style.visibility==='hidden'||journeyLiveChain!==chain)return;
    var stage=e.data.stage,c=CHAINS[chain],index;
    if(stage==='back'){goToIndex(chain===0?0:2,chain);return;}
    if(stage==='overview'){goToIndex(c.entryCount+3,chain);return;}
    if(stage==='input') index=chain===0?1:c.entryCount;
    else if(stage==='sent') index=c.entryCount;
    else if(stage==='thinking') index=c.entryCount+1;
    else if(stage==='completed') index=c.entryCount+2;
    if(index==null||index===step)return;
    step=index;
    renderList();renderDetail();
    journeySection.querySelectorAll('#flow-overviews [data-step]').forEach(function(b){b.setAttribute('aria-pressed',String(Number(b.dataset.chain)===chain&&Number(b.dataset.step)===step));});
  });
  function renderScreen() {
    var shell=screenEl.closest('.phone');
    if(!shell.querySelector('.phone-inner-rim')){var rim=document.createElement('div');rim.className='phone-inner-rim';rim.setAttribute('aria-hidden','true');shell.append(rim);}

    screenEl.closest('.phone').querySelector('.map-expanded-view')?.remove();
    screenEl.closest('.phone').querySelector('.map-demo-toast')?.remove();
    var c = CHAINS[chain], s = c.steps[step];
    if(liveScreens.indexOf(s.screen)!==-1){setJourneyLive(s.screen);return;}
    screenEl.classList.remove('journey-live-screen');
    screenEl.closest('.phone').classList.remove('has-live-journey');
    if(journeyLiveFrame)journeyLiveFrame.style.visibility='hidden';
    var def = SCREENS[s.screen];
    if (!def) { screenEl.innerHTML = ''; return; }
    screenEl.dataset.off=0;
    screenEl.classList.add('journey-live-screen');
    screenEl.closest('.phone').classList.add('has-live-journey');
    var frame=screenEl.querySelector('iframe[data-native]');
    var payload={type:'native-screen',screen:s.screen,day:selectedDay,hotspots:def.hs,back:def.back};
    if(!frame){frame=document.createElement('iframe');frame.className='journey-live-frame';frame.src='native/index.html';frame.dataset.native='1';frame.addEventListener('load',function(){frame.dataset.ready='1';frame.contentWindow.postMessage(frame.__payload,location.origin);});screenEl.append(frame);}
    frame.__payload=payload;frame.title=s.title+' · Figma图层重绘';frame.style.visibility='visible';frame.style.transform='scale('+(screenEl.clientWidth/390)+')';
    if(frame.dataset.ready)frame.contentWindow.postMessage(payload,location.origin);

  }
  window.addEventListener('message',function(e){
    var frame=screenEl.querySelector('iframe[data-native]');
    var mapFrame=screenEl.closest('.phone').querySelector('.map-expanded-view iframe');
    if(e.origin===location.origin&&mapFrame&&e.source===mapFrame.contentWindow&&e.data?.type==='native-action'){screenEl.closest('.phone').querySelector('.map-expanded-view').remove();if(e.data.day)selectedDay=e.data.day;if(e.data.target==='main:3'){renderScreen();return;}if(e.data.target)gotoTarget(e.data.target);return;}
    if(e.origin!==location.origin||!frame||e.source!==frame.contentWindow||e.data?.type!=='native-action')return;
    if(e.data.fields){var f=e.data.fields;formPrompt='我想去'+f[1]+'旅行，从'+f[0]+'出发。'+f[3]+'，预计游玩'+f[2]+'。请帮我设计出行的详细行程。';}
    if(e.data.day)selectedDay=e.data.day;
    var target=e.data.target;if(target==='main:4'&&CHAINS[chain].steps[step].screen==='day-list'){renderScreen();return;}if(target==='back')goBack();else if(target)gotoTarget(target);else flash('路线已优化，按就近顺序安排游览');
  });
  new ResizeObserver(function(){var f=screenEl.querySelector('iframe[data-native]');if(f)f.style.transform='scale('+(screenEl.clientWidth/390)+')';}).observe(screenEl);

  function renderDetail() {
    var c = CHAINS[chain], s = c.steps[step];
    detailEl.innerHTML =
      '<p class="flow-detail-counter">' + c.name + ' · 第 ' + (step + 1) + ' / ' + c.total + ' 步</p>' +
      '<h3>' + s.title + '</h3>' +
      '<p class="flow-detail-summary">' + s.short + '</p>' +
      '<dl class="flow-detail-rows">' +
        '<div><dt><span class="flow-role-dot user-dot"></span>用户</dt><dd>' + s.user + '</dd></div>' +
        '<div><dt><span class="flow-role-dot ai-dot"></span>AI（小骆）</dt><dd>' + s.ai + '</dd></div>' +
        '<div><dt><span class="flow-role-dot result-dot"></span>界面结果</dt><dd>' + s.result + '</dd></div>' +
      '</dl>' +
      '<div class="flow-return"><span aria-hidden="true">↩</span><p>' + s.branch + '</p></div>';
    tryEl.innerHTML = '<span class="live-dot"></span>' + s.note;
    journeySection.querySelector('#flow-step-count').textContent = (step + 1) + ' / ' + c.total;
    journeySection.querySelector('#flow-prev').disabled = step === 0;
    journeySection.querySelector('#flow-next').textContent = step === c.total - 1 ? '从第一步再看 ↻' : '下一步 →';
  }

  /* 左侧导航跟随当前流程链：入口段 + 共用主流程段，一并完整展示 */
  function renderList() {
    var c = CHAINS[chain];
    var segs = CHAINS.map(function (x, i) {
      return '<button class="flow-seg' + (i === chain ? ' is-on' : '') + '" data-chain="' + i + '" aria-pressed="' + (i === chain) + '">' +
        x.name + '</button>';
    }).join('');
    var head = '<p class="flow-group-head"><span class="flow-group-tag ' + c.id + '">' + c.name + '</span></p>';
    var items = '';
    c.steps.forEach(function (s, i) {
      items += '<button class="flow-step' + (i === step ? ' is-active' : '') + '" data-step="' + i + '" aria-pressed="' + (i === step) + '">' +
        '<span class="step-index">' + num(i) + '</span>' +
        '<span class="step-words"><strong>' + s.title + '</strong></span>' +
        '<span class="step-mark" aria-hidden="true">↗</span></button>';
    });
    listEl.innerHTML =
      '<div class="flow-segments" role="group" aria-label="切换流程">' + segs + '</div>' +
      items;
  }

  function renderOverviews() {
    var box = document.getElementById('flow-overviews');
    box.innerHTML = '<div class="merge-board">' + CHAINS.map(function (c, ci) {
      return '<article class="merge-lane lane-' + c.id + '">' +
        '<header><span class="merge-lane-tag ' + c.id + '">' + c.name + '</span>' +
        '<em>共 ' + c.total + ' 步 · 虚线段为共用主流程</em></header>' +
        '<ol class="merge-chain">' + c.steps.map(function (s, i) {
          var shared = i >= c.entryCount;
          return '<li' + (shared ? ' class="is-shared"' : '') + '><button data-chain="' + ci + '" data-step="' + i + '" aria-pressed="false">' + s.title + '</button></li>';
        }).join('') + '</ol></article>';
    }).join('') + '</div>';
  }

  /* 访问历史：只记真实跳转，返回时弹出，保证按进入路径逆序回退、无循环 */
  var history = [];
  var MAX_HISTORY = 40;

  function pushHistory(c, s) {
    var top = history[history.length - 1];
    if (top && top.chain === c && top.step === s) return;
    history.push({ chain: c, step: s });
    if (history.length > MAX_HISTORY) history.shift();
  }

  function goToIndex(nextStep, nextChain, opts) {
    opts = opts || {};
    nextChain = nextChain == null ? chain : nextChain;
    nextStep = ((nextStep % CHAINS[nextChain].total) + CHAINS[nextChain].total) % CHAINS[nextChain].total;
    if (nextStep === step && nextChain === chain) return;
    if (opts.record !== false) pushHistory(chain, step);
    chain = nextChain;
    step = nextStep;
    renderAll(true, opts.dir || 'fwd');
  }

  function goBack() {
    if(CHAINS[chain].steps[step].screen==='export'){goToIndex(CHAINS[chain].entryCount+4,chain,{record:false});return;}
    if (history.length) {
      var prev = history.pop();
      chain = prev.chain;
      step = prev.step;
      renderAll(true, 'back');
      flash('← 已返回上一级：' + CHAINS[chain].steps[step].title);
      return;
    }
    /* 无来源（直接定位 / 刷新）：兜底回本链起点 */
    if (step > 0) {
      step = 0;
      renderAll(true, 'back');
      flash('← 没有更早的访问记录，已回到「' + CHAINS[chain].shortName + '」起点');
      return;
    }
    flash('已经是流程起点，没有上一级了');
  }

  function flash(text) {
    tryEl.innerHTML = '<span class="live-dot"></span>' + text;
    clearTimeout(flash.__t);
    flash.__t = setTimeout(function () {
      tryEl.innerHTML = '<span class="live-dot"></span>' + CHAINS[chain].steps[step].note;
    }, 3400);
  }

  function gotoTarget(target) {
    if(target==='demo-map'){
      var phone=screenEl.closest('.phone'),toast=phone.querySelector('.map-demo-toast');
      if(!toast){toast=document.createElement('div');toast.className='map-demo-toast';toast.setAttribute('role','status');phone.append(toast);}
      toast.textContent='当前为演示模式，无法跳转地图';toast.hidden=false;
      clearTimeout(phone.__mapToastTimer);phone.__mapToastTimer=setTimeout(function(){toast.hidden=true;},2600);return;
    }
    if(target==='map-expand'){
      var phone=screenEl.closest('.phone');
      if(phone.querySelector('.map-expanded-view'))return;
      var opener=document.activeElement,view=document.createElement('div');
      view.className='map-expanded-view';
      view.setAttribute('role','region');view.setAttribute('aria-label','放大地图');
      view.innerHTML='<iframe title="北京四日游地图" class="journey-live-frame" src="native/index.html"></iframe><button class="map-collapse" aria-label="返回行程总览"></button>';
      var mapFrame=view.querySelector('iframe');mapFrame.style.transform='scale('+(screenEl.clientWidth/390)+')';mapFrame.onload=function(){mapFrame.contentWindow.postMessage({type:'native-screen',screen:'map',hotspots:[],back:null},location.origin);};
      var close=function(){view.remove();opener?.focus({preventScroll:true});};
      view.querySelector('button').onclick=close;
      view.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}});
      phone.append(view);view.querySelector('button').focus({preventScroll:true});return;
    }
    var c = CHAINS[chain];
    if (target === 'next') { goToIndex(step + 1, chain); return; }
    var parts = target.split(':');
    if (parts[0] === 'main') { goToIndex(c.entryCount + (Number(parts[1]) || 0), chain); return; }
    if (flows[parts[0]]) {
      /* 入口段步骤固定属于其所在流程链 */
      var ci = parts[0] === 'home' ? 0 : parts[0] === 'trips' ? 1 : chain;
      var si = Math.min(Number(parts[1]) || 0, flows[parts[0]].steps.length - 1);
      var stepObj = flows[parts[0]].steps[si];
      var pos = findStepInChain(stepObj, ci);
      goToIndex(pos < 0 ? 0 : pos, pos < 0 ? chain : ci);
    }
  }

  function renderAll(animate, dir) {
    renderList(); renderDetail(); renderScreen();
    journeySection.querySelectorAll('#flow-overviews [data-step]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(Number(b.dataset.chain) === chain && Number(b.dataset.step) === step));
    });
    document.querySelector('.flow-decision-list').innerHTML = decisions.map(function (d) {
      return '<li><strong>' + d[0] + '</strong><p>' + d[1] + '</p></li>';
    }).join('');
    if (animate) {
      areaEl.classList.remove('switching', 'switching-back');
      requestAnimationFrame(function () {
        areaEl.classList.add(dir === 'back' ? 'switching-back' : 'switching');
      });
    }
  }

  journeySection.addEventListener('click', function (e) {
    var jump = e.target.closest('[data-step]');
    if (jump) { goToIndex(Number(jump.dataset.step), jump.dataset.chain != null ? Number(jump.dataset.chain) : chain); return; }
    var seg = e.target.closest('[data-chain]');
    if (seg) { goToIndex(0, Number(seg.dataset.chain)); return; }
    var hs = e.target.closest('.hotspot');
    if (hs && hs.dataset.go) { gotoTarget(hs.dataset.go); return; }
    if (e.target.closest('[data-back]')) { goBack(); return; }
    if (e.target.closest('#flow-prev')) { goToIndex(step - 1, chain); return; }
    if (e.target.closest('#flow-next')) { goToIndex(step + 1, chain); return; }
    if (e.target.closest('#flow-reset')) { history.length = 0; goToIndex(0, chain, { record: false }); }
  });

  /* 键盘：Backspace / Esc 等同于手机界面返回 */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Backspace' && e.key !== 'Escape') return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    var rect = journeySection.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    e.preventDefault();
    goBack();
  });

  /* hero 两台手机：可上下滚动 + GO! 热区跳转 */
  document.querySelectorAll('.hero-phone .phone-screen:not(.live-demo-screen)').forEach(function (box) {
    setupPhoneScroll(box, { hint: '↓ 向下滚动查看完整对话' });
  });
  document.querySelectorAll('[data-hero-go]').forEach(function (el) {
    el.addEventListener('click', function () {
      var parts = el.dataset.heroGo.split(':');
      if (parts[0] === 'main') {
        goToIndex(CHAINS[1].entryCount + (Number(parts[1]) || 0), 1);
      } else if (flows[parts[0]]) {
        var si = Math.min(Number(parts[1]) || 0, flows[parts[0]].steps.length - 1);
        var ci = parts[0] === 'home' ? 0 : 1;
        goToIndex(Math.max(0, findStepInChain(flows[parts[0]].steps[si], ci)), ci);
      }
      journeySection.scrollIntoView({ behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth', block: 'start' });
    });
  });

  renderOverviews();
  renderAll(false);

  /* ==================================================
     4. Reveal on scroll + motion toggle
     ================================================== */
  var revealTargets = document.querySelectorAll('.section-topline, .pain-heading, .evidence-pair > article, .journey-heading, .flow-inspector-heading, .flow-decisions, .thinking-heading, .thinking-board, .conclusion-content, .conclusion-signoff');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  var motionBtn = document.getElementById('motion-toggle');
  motionBtn.addEventListener('click', function () {
    var on = document.body.classList.toggle('reduce-motion');
    document.documentElement.classList.toggle('reduce-motion', on);
    motionBtn.setAttribute('aria-pressed', String(on));
  });

  var navLinks = document.querySelectorAll('.site-header nav a');
  if ('IntersectionObserver' in window) {
    var secObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { secObserver.observe(s); });
  }
})();

/* Keep the embedded 390px design canvas aligned with its rotated phone shell. */
(function(){
 const screen=document.querySelector('.live-demo-screen'),frame=screen?.querySelector('iframe');
 if(!screen||!frame)return;
 const fit=()=>{frame.style.transform='scale('+(screen.clientWidth/390)+')';};
 new ResizeObserver(fit).observe(screen);fit();
})();

(function(){
 const timers=new WeakMap();
 document.addEventListener('click',function(e){
  const screen=e.target.closest('.phone-screen');
  if(!screen||screen.querySelector('iframe')||e.target.closest('button,a,input,textarea,.map-expanded-view'))return;
  const phone=screen.closest('.phone'),hint=document.querySelector('#flow-try');
  clearTimeout(timers.get(phone));phone.classList.add('show-guidance');
  if(screen.id==='journey-screen')hint?.classList.add('show-guidance');
  timers.set(phone,setTimeout(()=>{phone.classList.remove('show-guidance');if(screen.id==='journey-screen')hint?.classList.remove('show-guidance');},2800));
 });
})();


(function(){
 const frame=document.querySelector('.hand-flow'),host=document.querySelector('.hand-device');
 if(!frame||!host||document.documentElement.classList.contains('device-only'))return;
 frame.src=frame.dataset.deviceSrc;
 function fit(){
  const w=host.clientWidth,h=host.clientHeight;
  // Four inner screen corners measured from the supplied hand-held mockup.
  const pts=[[58/655,8/943],[356/655,8/943],[356/655,637/943],[58/655,637/943]].map(p=>[p[0]*w,p[1]*h]);
  const src=[[0,0],[390,0],[390,844],[0,844]],A=[],B=[];
  for(let i=0;i<4;i++){const [x,y]=src[i],[u,v]=pts[i];A.push([x,y,1,0,0,0,-u*x,-u*y]);B.push(u);A.push([0,0,0,x,y,1,-v*x,-v*y]);B.push(v);}
  for(let i=0;i<8;i++){let k=i;for(let j=i+1;j<8;j++)if(Math.abs(A[j][i])>Math.abs(A[k][i]))k=j;[A[i],A[k]]=[A[k],A[i]];[B[i],B[k]]=[B[k],B[i]];const d=A[i][i];for(let j=i;j<8;j++)A[i][j]/=d;B[i]/=d;for(let r=0;r<8;r++){if(r===i)continue;const f=A[r][i];for(let j=i;j<8;j++)A[r][j]-=f*A[i][j];B[r]-=f*B[i];}}
  const [a,b,c,d,e,f,g,k]=B;frame.style.transform='matrix3d('+[a,d,0,g,b,e,0,k,0,0,1,0,c,f,0,1].join(',')+')';
 }
 new ResizeObserver(fit).observe(host);fit();
})();
