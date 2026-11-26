// 第 5 关：动手造物工坊 —— 独立可下载 HTML 生成器

export const VIBE_PROJECTS = [
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
