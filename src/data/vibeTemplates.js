// 第 5 关：动手造物工坊 —— 独立可下载 HTML 生成器

export const BOARD_PRESETS = {
  schedule: {
    id: 'schedule',
    label: '📅 工作排期',
    title: '本周个人工作排期看板',
    columns: ['待办事项', '进行中', '已完成'],
    cards: [
      { id: 'c1', text: '整理 Q4 核心指标复盘', tag: '高优', col: 0 },
      { id: 'c2', text: '跟进合作方合同条款修订', tag: '沟通', col: 1 },
      { id: 'c3', text: '输出新品上线宣发方案', tag: '策划', col: 1 },
      { id: 'c4', text: '完成周一团队周会纪要', tag: '例行', col: 2 },
    ],
  },
  analysis: {
    id: 'analysis',
    label: '📈 产品分析',
    title: '产品体验与竞品分析看板',
    columns: ['待验证假设', '分析中', '已沉淀结论'],
    cards: [
      { id: 'a1', text: '新手引导第 2 步流失率偏高', tag: '漏斗', col: 0 },
      { id: 'a2', text: '拆解竞品 A/B 定价与权益差异', tag: '竞品', col: 1 },
      { id: 'a3', text: '汇总 500 条用户评价高频吐槽', tag: '用研', col: 2 },
      { id: 'a4', text: '老客复购占比提升 +18.4%', tag: '亮点', col: 2 },
    ],
  },
  showcase: {
    id: 'showcase',
    label: '✨ 内容展示',
    title: '我的个人作品与灵感展示板',
    columns: ['灵感草稿', '打磨中', '已发布精选'],
    cards: [
      { id: 's1', text: '零基础 AI 入门系列视频选题', tag: '选题', col: 0 },
      { id: 's2', text: '《2026 效率工具清单》图文排版', tag: '专栏', col: 1 },
      { id: 's3', text: '个人零代码网页小工具合集', tag: '作品', col: 2 },
    ],
  },
}

export const VIBE_PROJECTS = [
  {
    id: 'board',
    name: '个人看板（排期/分析/展示）',
    emoji: '📊',
    tagline: '工作排期、产品分析、作品展示一板搞定',
    defaultTitle: '本周个人工作排期看板',
    realPrompt: (cfg) =>
      `帮我做一个打开浏览器就能用的「${cfg.title}」。\n我希望它长这样：\n1. 最上面能一眼看到一共有几件事、完成了多少；\n2. 下面分成三栏：${(cfg.columns || ['还没做', '正在做', '做完了']).join('、')}；\n3. 我能随时往里加新事项、点一下按钮把事项移到下一栏，也能删除；\n4. 每次改完自动帮我记住，关掉电脑明天打开东西还在。\n先帮我做一个可以直接在电脑上打开的版本，做好后我再按使用习惯让你微调！`,
  },
  {
    id: 'wheel',
    name: '今天吃什么大转盘',
    emoji: '🎲',
    tagline: '专治选择困难症，一键决定中午吃啥！',
    defaultTitle: '今天中午吃什么？',
    defaultItems: ['红烧牛肉面', '麻辣香锅', '轻食沙拉', '猪脚饭', '回转寿司', '黄焖鸡米饭'],
    realPrompt: (cfg) =>
      `请帮我写一个单文件 HTML 网页，功能是“${cfg.title}”大转盘小工具。\n风格要求：${cfg.themeName}配色，圆润可爱卡片风。\n功能要求：\n1. 默认包含这些美食：${cfg.items.join('、')}；\n2. 点击按钮会快速滚动并随机停在一个选项上；\n3. 支持用户在网页里随时添加或删除菜品；\n${cfg.confetti ? '4. 抽中结果时绽放彩色纸屑庆祝特效！\n' : ''}请直接输出完整的 HTML 代码，我保存后双击就能在浏览器打开。`,
  },
  {
    id: 'pomodoro',
    name: '萌系番茄钟专注助手',
    emoji: '🍅',
    tagline: '学习/办公计时器，陪你高效专注 25 分钟！',
    defaultTitle: '我的超级专注番茄钟',
    defaultMinutes: 25,
    realPrompt: (cfg) =>
      `请帮我写一个单文件 HTML 网页，做一个“${cfg.title}”。\n风格要求：${cfg.themeName}配色，大字体清晰倒计时。\n功能要求：\n1. 默认专注时长 ${cfg.minutes} 分钟，支持“开始 / 暂停 / 重置”和“5分钟休息”模式切换；\n2. 记录今天完成的番茄数并给出鼓励语；\n${cfg.confetti ? '3. 完成一个番茄时弹出烟花彩带鼓励我！\n' : ''}请给我完整可双击运行的 HTML 代码。`,
  },
  {
    id: 'ecard',
    name: '赛博祝福电子贺卡',
    emoji: '💌',
    tagline: '给朋友/家人做一张独一无二的互动电子贺卡！',
    defaultTitle: '祝你每天都像抽中隐藏款一样开心！',
    defaultSender: '刚学会 AI 的未来造物主',
    defaultMessage: '这是我用 AI 零代码亲手做的第一张电子贺卡！愿你烦恼清零，好运爆棚，天天吃好睡好～',
    realPrompt: (cfg) =>
      `请帮我写一个单文件 HTML 互动电子贺卡网页。\n主题标题：“${cfg.title}”\n落款：“${cfg.sender}”\n风格要求：${cfg.themeName}渐变卡片，点击信封会打开并显示祝福语。\n祝福语内容：“${cfg.message}”\n${cfg.confetti ? '打开贺卡时请播放彩色纸屑飘落特效！\n' : ''}请输出单文件完整 HTML，发给朋友就能直接打开看。`,
  },
]

export const VIBE_THEMES = [
  { id: 'indigo', name: '星空紫蓝', bg: '#EEF0FF', accent: '#5B4BFF', card: '#FFFFFF', text: '#1E1B2E' },
  { id: 'coral', name: '元气珊瑚橘', bg: '#FFF0ED', accent: '#FF6B57', card: '#FFFFFF', text: '#1E1B2E' },
  { id: 'mint', name: '清新薄荷绿', bg: '#E8FBF3', accent: '#10B981', card: '#FFFFFF', text: '#1E1B2E' },
  { id: 'cyber', name: '暗夜赛博霓虹', bg: '#131124', accent: '#F43F5E', card: '#211E3A', text: '#F8FAFC' },
]

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** 安全地把数据序列化进内联 <script>，防止 </script> 闭合标签注入 */
export function safeJsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function confettiSnippet(enabled) {
  if (!enabled) return 'function burst() {}'
  return `function burst() {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const colors = ['#5B4BFF','#FF6B57','#10B981','#F59E0B','#EC4899'];
      for (let i = 0; i < 28; i++) {
        const d = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 28;
        const dist = 60 + Math.random() * 90;
        d.style.cssText = 'position:fixed;left:50%;top:50%;width:8px;height:8px;border-radius:2px;pointer-events:none;z-index:999;background:' + colors[i % colors.length];
        document.body.appendChild(d);
        d.animate([
          { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
          { transform: 'translate(' + Math.cos(angle) * dist + 'px,' + (Math.sin(angle) * dist + 40) + 'px) rotate(260deg) scale(0.4)', opacity: 0 }
        ], { duration: 750, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => d.remove();
      }
    }`
}

export function generateStandaloneHTML(projectId, cfg, theme) {
  const safeTitle = escapeHtml(cfg.title)
  const isDark = theme.id === 'cyber'
  const borderCol = isDark ? '#F43F5E' : '#1E1B2E'

  if (projectId === 'board') {
    const colsJson = safeJsonForScript(cfg.columns || ['待办事项', '进行中', '已完成'])
    const cardsJson = safeJsonForScript(cfg.cards || [])
    return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif; background:${theme.bg}; color:${theme.text}; padding:24px; }
    .wrap { max-width:1040px; margin:0 auto; }
    .top { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-bottom:20px; }
    h1 { margin:0; font-size:26px; }
    .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:20px; }
    .stat { background:${theme.card}; border:2px solid ${borderCol}; box-shadow:4px 4px 0 ${borderCol}; border-radius:16px; padding:14px 16px; }
    .stat .num { font-size:26px; font-weight:900; color:${theme.accent}; }
    .stat .lbl { font-size:12px; opacity:.75; font-weight:700; }
    .addbar { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
    input, select { padding:10px 12px; border-radius:12px; border:2px solid #cbd5e1; font-size:14px; }
    input { flex:1; min-width:200px; }
    button { cursor:pointer; font-size:13px; font-weight:800; padding:10px 16px; border-radius:12px; border:2px solid #1E1B2E; background:${theme.accent}; color:#fff; box-shadow:2px 2px 0 #1E1B2E; }
    .cols { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; }
    .col { background:${theme.card}; border:2px solid ${borderCol}; box-shadow:5px 5px 0 ${borderCol}; border-radius:18px; padding:16px; }
    .col h2 { margin:0 0 12px; font-size:15px; display:flex; justify-content:space-between; }
    .card { background:${theme.bg}; border:1.5px solid ${borderCol}; border-radius:12px; padding:10px 12px; margin-bottom:10px; }
    .card-top { display:flex; justify-content:space-between; align-items:center; gap:8px; font-size:14px; font-weight:700; }
    .card-ops { display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:12px; }
    .tag { padding:2px 8px; border-radius:999px; background:${theme.card}; border:1px solid ${theme.accent}; color:${theme.accent}; font-weight:800; font-size:11px; }
    .mini { padding:4px 8px; font-size:11px; box-shadow:none; }
    .del { background:transparent; color:${theme.text}; border:none; box-shadow:none; opacity:.6; padding:2px 6px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <h1>📊 ${safeTitle}</h1>
      <div style="font-size:12px;opacity:.75;font-weight:700;">数据自动保存在本机浏览器</div>
    </div>
    <div class="stats" id="stats"></div>
    <div class="addbar">
      <input id="inp" placeholder="输入新事项 / 分析要点 / 展示内容..." />
      <select id="colSel"></select>
      <button type="button" id="addBtn">+ 添加卡片</button>
    </div>
    <div class="cols" id="board"></div>
  </div>
  <script>
    const KEY = 'ai_personal_board_' + encodeURIComponent(${safeJsonForScript(cfg.title)});
    const cols = ${colsJson};
    let cards = [];
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); cards = Array.isArray(s) ? s : ${cardsJson}; } catch { cards = ${cardsJson}; }
    const colSel = document.getElementById('colSel');
    cols.forEach((c, i) => { const o = document.createElement('option'); o.value = i; o.textContent = c; colSel.appendChild(o); });
    function save() { try { localStorage.setItem(KEY, JSON.stringify(cards)); } catch {} }
    function render() {
      const done = cards.filter(c => c.col === 2).length;
      const pct = cards.length ? Math.round((done / cards.length) * 100) : 0;
      document.getElementById('stats').innerHTML =
        '<div class="stat"><div class="lbl">总卡片数</div><div class="num">' + cards.length + '</div></div>' +
        '<div class="stat"><div class="lbl">' + cols[1] + '</div><div class="num">' + cards.filter(c => c.col === 1).length + '</div></div>' +
        '<div class="stat"><div class="lbl">' + cols[2] + '占比</div><div class="num">' + pct + '%</div></div>';
      const wrap = document.getElementById('board');
      wrap.innerHTML = '';
      cols.forEach((colName, ci) => {
        const box = document.createElement('div'); box.className = 'col';
        const list = cards.filter(c => c.col === ci);
        const h = document.createElement('h2'); h.textContent = colName + ' (' + list.length + ')'; box.appendChild(h);
        list.forEach(item => {
          const el = document.createElement('div'); el.className = 'card';
          const top = document.createElement('div'); top.className = 'card-top';
          const txt = document.createElement('span'); txt.textContent = item.text; top.appendChild(txt);
          const del = document.createElement('button'); del.className = 'del'; del.textContent = '×';
          del.onclick = () => { cards = cards.filter(c => c.id !== item.id); save(); render(); };
          top.appendChild(del); el.appendChild(top);
          const ops = document.createElement('div'); ops.className = 'card-ops';
          const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = item.tag || '事项'; ops.appendChild(tag);
          const mv = document.createElement('button'); mv.className = 'mini'; mv.textContent = ci < 2 ? '→ ' + cols[ci + 1] : '↺ 回到第1列';
          mv.onclick = () => { item.col = (item.col + 1) % 3; save(); render(); };
          ops.appendChild(mv); el.appendChild(ops);
          box.appendChild(el);
        });
        wrap.appendChild(box);
      });
    }
    document.getElementById('addBtn').onclick = () => {
      const inp = document.getElementById('inp'); const v = inp.value.trim();
      if (!v) return;
      cards.push({ id: 'c_' + Date.now(), text: v, tag: '新增', col: Number(colSel.value) || 0 });
      inp.value = ''; save(); render();
    };
    document.getElementById('inp').onkeydown = (e) => { if (e.key === 'Enter') document.getElementById('addBtn').click(); };
    render();
  </script>
</body>
</html>`
  }

  if (projectId === 'wheel') {
    const itemsJson = safeJsonForScript(cfg.items)
    return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif; background:${theme.bg}; color:${theme.text}; padding:20px; }
    .box { max-width:460px; width:100%; background:${theme.card}; border:3px solid ${borderCol}; box-shadow:6px 6px 0 ${borderCol}; border-radius:24px; padding:28px; text-align:center; }
    h1 { margin:0 0 8px; font-size:26px; }
    .sub { opacity:.75; font-size:14px; margin-bottom:20px; }
    .display { font-size:24px; font-weight:800; padding:24px 16px; border-radius:16px; background:${theme.bg}; border:2px dashed ${theme.accent}; margin-bottom:18px; min-height:76px; display:flex; align-items:center; justify-content:center; }
    button { cursor:pointer; font-size:16px; font-weight:700; padding:12px 24px; border-radius:14px; border:2px solid #1E1B2E; background:${theme.accent}; color:#fff; box-shadow:3px 3px 0 #1E1B2E; }
    button:active { transform:translate(2px,2px); box-shadow:1px 1px 0 #1E1B2E; }
    .tags { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin:18px 0; }
    .tag { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:999px; font-size:13px; background:${theme.bg}; border:1.5px solid ${theme.accent}; }
    .del { cursor:pointer; opacity:.65; font-weight:900; }
    .del:hover { opacity:1; }
    .add { display:flex; gap:8px; margin-top:12px; }
    input { flex:1; padding:10px 12px; border-radius:12px; border:2px solid #cbd5e1; font-size:14px; }
    footer { margin-top:18px; font-size:12px; opacity:.65; }
  </style>
</head>
<body>
  <div class="box">
    <h1>🎲 ${safeTitle}</h1>
    <div class="sub">由我在《AI 奇妙漫游指南》零代码制作</div>
    <div class="display" id="res">点下方按钮开始抽选！</div>
    <button type="button" id="spinBtn">✨ 帮我决定吃什么！</button>
    <div class="tags" id="tags"></div>
    <div class="add">
      <input id="inp" placeholder="加一个你想吃的菜..." aria-label="添加菜品" />
      <button type="button" id="addBtn">添加</button>
    </div>
    <footer>AI 造物工坊 · 单文件网页作品</footer>
  </div>
  <script>
    let items = ${itemsJson};
    let spinning = false;
    ${confettiSnippet(cfg.confetti)}
    function render() {
      const wrap = document.getElementById('tags');
      wrap.textContent = '';
      items.forEach((item, idx) => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.append(document.createTextNode(item));
        const x = document.createElement('span');
        x.className = 'del';
        x.textContent = '×';
        x.title = '删除';
        x.onclick = () => { items.splice(idx, 1); render(); };
        span.append(x);
        wrap.append(span);
      });
    }
    render();
    document.getElementById('spinBtn').onclick = function () {
      if (spinning || !items.length) return;
      spinning = true;
      let count = 0;
      const el = document.getElementById('res');
      const timer = setInterval(() => {
        el.textContent = items[Math.floor(Math.random() * items.length)];
        count++;
        if (count > 18) {
          clearInterval(timer);
          spinning = false;
          const pick = items[Math.floor(Math.random() * items.length)];
          el.textContent = '🎉 就决定是你了：' + pick + '！';
          burst();
        }
      }, 70);
    };
    function addItem() {
      const inp = document.getElementById('inp');
      const v = inp.value.trim();
      if (v) { items.push(v); inp.value = ''; render(); }
    }
    document.getElementById('addBtn').onclick = addItem;
    document.getElementById('inp').onkeydown = (e) => { if (e.key === 'Enter') addItem(); };
  </script>
</body>
</html>`
  }

  if (projectId === 'pomodoro') {
    const mins = Math.max(1, Math.min(180, Number(cfg.minutes) || 25))
    return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif; background:${theme.bg}; color:${theme.text}; padding:20px; }
    .box { max-width:420px; width:100%; background:${theme.card}; border:3px solid ${borderCol}; box-shadow:6px 6px 0 ${borderCol}; border-radius:24px; padding:32px; text-align:center; }
    .time { font-size:64px; font-weight:900; font-variant-numeric:tabular-nums; margin:20px 0; color:${theme.accent}; }
    .btns { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
    button { cursor:pointer; font-size:15px; font-weight:700; padding:10px 20px; border-radius:12px; border:2px solid #1E1B2E; background:${theme.accent}; color:#fff; box-shadow:3px 3px 0 #1E1B2E; }
    button.sec { background:${theme.bg}; color:${theme.text}; }
    footer { margin-top:22px; font-size:12px; opacity:.65; }
  </style>
</head>
<body>
  <div class="box">
    <h1>🍅 ${safeTitle}</h1>
    <div id="status">准备开始专注！今日已完成 0 颗番茄</div>
    <div class="time" id="clock">${String(mins).padStart(2, '0')}:00</div>
    <div class="btns">
      <button type="button" id="toggleBtn">▶ 开始专注</button>
      <button type="button" class="sec" id="resetBtn">↺ 重置专注</button>
      <button type="button" class="sec" id="breakBtn">☕ 休息5分钟</button>
    </div>
    <footer>AI 造物工坊 · 零代码作品</footer>
  </div>
  <script>
    let sec = ${mins} * 60, timer = null, isBreak = false, count = 0;
    ${confettiSnippet(cfg.confetti)}
    const fmt = s => String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
    function update() { document.getElementById('clock').textContent = fmt(sec); }
    function setStatus(msg) { document.getElementById('status').textContent = msg + ' · 今日已完成 ' + count + ' 颗番茄'; }
    function startTick() {
      if (sec <= 0) sec = (isBreak ? 5 : ${mins}) * 60;
      document.getElementById('toggleBtn').textContent = '⏸ 暂停';
      setStatus(isBreak ? '☕ 正在休息 5 分钟' : '🔥 正在超级专注中');
      timer = setInterval(() => {
        if (sec > 0) { sec--; update(); }
        else {
          clearInterval(timer); timer = null;
          if (!isBreak) count++;
          document.getElementById('toggleBtn').textContent = '▶ 再来一轮';
          setStatus(isBreak ? '☕ 休息结束！准备下一轮专注' : '🎉 太棒了！完成一颗专注番茄');
          burst();
        }
      }, 1000);
    }
    document.getElementById('toggleBtn').onclick = function () {
      if (timer) { clearInterval(timer); timer = null; this.textContent = '▶ 继续'; return; }
      startTick();
    };
    function reset(m, brk, autoStart) {
      clearInterval(timer); timer = null; isBreak = brk; sec = m * 60; update();
      if (autoStart) startTick();
      else { document.getElementById('toggleBtn').textContent = '▶ 开始专注'; setStatus('准备开始专注'); }
    }
    document.getElementById('resetBtn').onclick = () => reset(${mins}, false, false);
    document.getElementById('breakBtn').onclick = () => reset(5, true, true);
  </script>
</body>
</html>`
  }

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif; background:${theme.bg}; color:${theme.text}; padding:20px; }
    .card { max-width:460px; width:100%; background:${theme.card}; border:3px solid ${borderCol}; box-shadow:8px 8px 0 ${theme.accent}; border-radius:26px; padding:34px; text-align:center; }
    .emoji { font-size:56px; margin-bottom:12px; }
    h1 { font-size:24px; margin:0 0 16px; color:${theme.accent}; }
    p { line-height:1.8; font-size:16px; margin-bottom:24px; white-space:pre-wrap; }
    .from { font-weight:700; text-align:right; opacity:.85; }
    button { cursor:pointer; font-size:15px; font-weight:800; padding:12px 24px; border-radius:14px; border:2px solid #1E1B2E; background:${theme.accent}; color:#fff; box-shadow:3px 3px 0 #1E1B2E; }
    .link { margin-top:16px; background:none; border:0; box-shadow:none; color:${theme.text}; opacity:.6; font-size:12px; text-decoration:underline; padding:4px; }
    .hidden { display:none; }
  </style>
</head>
<body>
  <div class="card">
    <div id="cover">
      <div class="emoji">✉️</div>
      <div style="font-weight:900;font-size:18px;margin-bottom:18px;">你收到一封来自朋友的电子贺卡！</div>
      <button type="button" id="openBtn">✨ 点击拆开贺卡</button>
    </div>
    <div id="inside" class="hidden">
      <div class="emoji">💌✨</div>
      <h1>${safeTitle}</h1>
      <p>${escapeHtml(cfg.message)}</p>
      <div class="from">—— ${escapeHtml(cfg.sender)}</div>
      <button type="button" class="link" id="closeBtn">重新装回信封</button>
    </div>
  </div>
  <script>
    ${confettiSnippet(cfg.confetti)}
    document.getElementById('openBtn').onclick = () => {
      document.getElementById('cover').classList.add('hidden');
      document.getElementById('inside').classList.remove('hidden');
      burst();
    };
    document.getElementById('closeBtn').onclick = () => {
      document.getElementById('inside').classList.add('hidden');
      document.getElementById('cover').classList.remove('hidden');
    };
  </script>
</body>
</html>`
}
