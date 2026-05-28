(function () {
  /* ── VG Portfolio Theme — preserves code blocks + images ── */

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg:#0a0a0a; --bg2:#111; --bg3:#1a1a1a;
      --accent:#00e5a0; --accent2:#00b37d;
      --text:#f0f0f0; --muted:#888; --border:#222; --card:#131313;
      --code-bg:#0d1117; --code-border:#30363d;
    }
    *,*::before,*::after { box-sizing:border-box }
    html { scroll-behavior:smooth }
    body {
      background:var(--bg) !important;
      color:var(--text) !important;
      font-family:'Syne',sans-serif !important;
      font-size:16px; line-height:1.7;
      margin:0 !important; padding:0 !important;
      max-width:100% !important;
    }
    /* hide everything — we rebuild below */
    body > *:not(#_nav):not(#_wrap):not(#_lightbox) { display:none !important; }

    /* ── NAV ── */
    #_nav {
      position:sticky; top:0;
      background:rgba(10,10,10,0.93);
      backdrop-filter:blur(12px);
      border-bottom:1px solid var(--border);
      z-index:1000; padding:14px 24px;
      display:flex; align-items:center; gap:20px;
    }
    #_nav a {
      font-family:'Space Mono',monospace; font-size:12px;
      color:var(--muted); text-decoration:none;
      letter-spacing:0.05em; transition:color .2s;
    }
    #_nav a:hover { color:var(--accent); }
    #_nav .logo { color:var(--accent); margin-right:auto; font-size:13px; }
    #_nav .back {
      border:1px solid var(--border); border-radius:4px;
      padding:6px 14px; color:var(--text) !important;
      transition:border-color .2s, color .2s;
    }
    #_nav .back:hover { border-color:var(--accent); color:var(--accent) !important; }

    /* ── WRAP ── */
    #_wrap { max-width:900px; margin:0 auto; padding:48px 24px 80px; }

    /* ── TITLE ── */
    #_title {
      font-size:clamp(28px,5vw,46px);
      font-weight:800; letter-spacing:-0.02em;
      line-height:1.1; margin-bottom:8px;
    }
    #_title span { color:var(--accent); }
    #_meta {
      font-family:'Space Mono',monospace; font-size:11px;
      color:var(--muted); letter-spacing:0.1em;
      margin-bottom:40px; display:flex; gap:10px; flex-wrap:wrap;
    }
    #_meta span {
      border:1px solid var(--border); border-radius:3px; padding:3px 10px;
    }

    /* ── CONTENT BLOCKS ── */
    .pg-block { margin-bottom:24px; }

    /* images */
    .pg-img-wrap {
      position:relative;
      border-radius:10px; overflow:hidden;
      border:1px solid var(--border);
      background:var(--card);
      cursor:zoom-in;
      transition:border-color .25s, transform .2s;
      margin-bottom:20px;
    }
    .pg-img-wrap:hover { border-color:var(--accent); transform:translateY(-2px); }
    .pg-img-wrap img {
      width:100%; height:auto; display:block;
      image-rendering:-webkit-optimize-contrast;
    }
    .pg-img-wrap .expand-btn {
      position:absolute; top:10px; right:10px;
      background:rgba(0,0,0,0.7); border:1px solid var(--border);
      border-radius:4px; padding:4px 10px;
      font-family:'Space Mono',monospace; font-size:10px;
      color:var(--muted); opacity:0.5;
      transition:opacity .2s, color .2s, border-color .2s;
      pointer-events:none; letter-spacing:0.05em;
    }
    .pg-img-wrap:hover .expand-btn { opacity:1; color:var(--accent); border-color:var(--accent); }
    .pg-img-wrap .img-num {
      position:absolute; bottom:8px; left:10px;
      font-family:'Space Mono',monospace; font-size:10px;
      color:var(--muted); background:rgba(0,0,0,0.6);
      border-radius:3px; padding:2px 6px;
    }

    /* side-by-side images (Notion 2-col layouts) */
    .pg-img-row {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px; margin-bottom:20px;
    }
    .pg-img-row .pg-img-wrap { margin-bottom:0; }
    @media(max-width:600px){ .pg-img-row { grid-template-columns:1fr; } }

    /* code blocks */
    .pg-code {
      background:var(--code-bg);
      border:1px solid var(--code-border);
      border-radius:8px;
      overflow-x:auto;
      margin-bottom:20px;
      position:relative;
    }
    .pg-code-lang {
      font-family:'Space Mono',monospace; font-size:10px;
      color:var(--accent); padding:10px 16px 0;
      letter-spacing:0.1em; text-transform:uppercase;
    }
    .pg-code pre {
      margin:0; padding:12px 16px 16px;
      font-family:'Space Mono',monospace;
      font-size:13px; line-height:1.65;
      color:#e6edf3;
      white-space:pre;
      overflow-x:auto;
    }
    .pg-code-copy {
      position:absolute; top:8px; right:10px;
      font-family:'Space Mono',monospace; font-size:10px;
      background:var(--bg3); border:1px solid var(--border);
      color:var(--muted); border-radius:4px;
      padding:3px 10px; cursor:pointer;
      transition:color .2s, border-color .2s;
    }
    .pg-code-copy:hover { color:var(--accent); border-color:var(--accent); }

    /* text / paragraph */
    .pg-text {
      font-size:15px; color:var(--muted);
      line-height:1.8; margin-bottom:12px;
    }
    .pg-text strong { color:var(--text); }

    /* headings inside content */
    .pg-h1,.pg-h2,.pg-h3 { color:var(--text); font-weight:700; margin:32px 0 12px; }
    .pg-h1 { font-size:24px; }
    .pg-h2 { font-size:20px; }
    .pg-h3 { font-size:17px; color:var(--accent); }

    /* ── LIGHTBOX ── */
    #_lightbox {
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,0.95); z-index:9999;
      align-items:center; justify-content:center;
      flex-direction:column; gap:14px; padding:20px;
    }
    #_lightbox.open { display:flex; }
    #_lb_img_wrap {
      max-width:95vw; max-height:82vh;
      overflow:auto; border-radius:8px;
      border:1px solid var(--border);
    }
    #_lb_img_wrap img { display:block; max-width:100%; height:auto; }
    #_lb_counter { font-family:'Space Mono',monospace; font-size:12px; color:var(--muted); }
    #_lb_close {
      position:fixed; top:16px; right:20px;
      font-family:'Space Mono',monospace; font-size:22px;
      color:var(--muted); cursor:pointer; z-index:10000;
      transition:color .2s;
    }
    #_lb_close:hover { color:var(--accent); }
    #_lb_nav { display:flex; gap:12px; }
    #_lb_nav button {
      font-family:'Space Mono',monospace; font-size:13px;
      background:var(--bg3); border:1px solid var(--border);
      color:var(--text); padding:8px 22px; border-radius:4px;
      cursor:pointer; transition:border-color .2s, color .2s;
    }
    #_lb_nav button:hover { border-color:var(--accent); color:var(--accent); }

    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    #_wrap { animation:fadeUp .5s ease both; }
    @media(max-width:600px){ #_nav .logo{display:none} #_wrap{padding:32px 16px 60px} }
  `;
  document.head.appendChild(style);

  /* ── HELPERS ── */
  function isImgSrc(s) { return s && /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(s); }

  function detectLang(code) {
    if (/import\s+\w|from\s+\w+\s+import|def\s+\w+\(|pandas|matplotlib|plt\.|df\[/i.test(code)) return 'python';
    if (/SELECT|FROM|WHERE|JOIN|GROUP BY|INSERT|UPDATE|CREATE TABLE/i.test(code)) return 'sql';
    if (/function\s+\w+\s*\(|const\s+\w+\s*=|=>\s*{|console\.log/i.test(code)) return 'javascript';
    return 'code';
  }

  /* ── MAIN BUILD ── */
  function build() {
    const rawTitle = document.title || 'Project';

    /* ── collect all images for lightbox ── */
    const allImgSrcs = [];
    function registerImg(src) {
      const clean = src.split('?')[0];
      if (!allImgSrcs.includes(clean)) allImgSrcs.push(clean);
      return allImgSrcs.indexOf(clean);
    }

    /* ── walk Notion body and build content blocks ── */
    const body = document.body;
    const contentBlocks = []; // array of {type, ...data}

    /* Notion structures code as <div class="code"> or <pre> or <code> */
    /* Images as <a href="*.png"><img></a> or just <img> */
    /* Text as <p>, <h1-h3> */

    function walkNode(node) {
      if (node.nodeType !== 1) return; // elements only
      const tag = node.tagName.toLowerCase();

      /* skip scripts/styles/nav already injected */
      if (['script','style','link','meta','title'].includes(tag)) return;

      /* CODE: <pre>, or any element containing only code-like text */
      if (tag === 'pre' || (tag === 'div' && node.querySelector('code'))) {
        const codeEl = node.querySelector('code') || node;
        const codeText = codeEl.innerText || codeEl.textContent || '';
        if (codeText.trim().length > 10) {
          contentBlocks.push({ type:'code', text: codeText.trim(), lang: detectLang(codeText) });
          return;
        }
      }

      /* IMAGE LINK: <a href="image.ext"> */
      if (tag === 'a') {
        const href = node.getAttribute('href') || '';
        if (isImgSrc(href)) {
          contentBlocks.push({ type:'img', src: href });
          registerImg(href);
          return;
        }
      }

      /* BARE IMAGE: <img src="image.ext"> */
      if (tag === 'img') {
        const src = node.getAttribute('src') || '';
        if (isImgSrc(src) && !/notion-logo|^data:|icons\//i.test(src)) {
          contentBlocks.push({ type:'img', src });
          registerImg(src);
          return;
        }
      }

      /* HEADINGS */
      if (['h1','h2','h3'].includes(tag)) {
        const text = node.innerText.trim();
        if (text && text !== rawTitle) {
          contentBlocks.push({ type:'heading', level: tag, text });
          return;
        }
      }

      /* PARAGRAPH text (skip if empty or just whitespace) */
      if (tag === 'p') {
        const text = node.innerText.trim();
        if (text.length > 3) {
          contentBlocks.push({ type:'text', html: node.innerHTML });
          return;
        }
      }

      /* recurse into children */
      for (const child of node.children) walkNode(child);
    }

    for (const child of body.children) walkNode(child);

    /* ── group consecutive images into rows (max 2 side by side) ── */
    const grouped = [];
    let i = 0;
    while (i < contentBlocks.length) {
      const b = contentBlocks[i];
      if (b.type === 'img' && contentBlocks[i+1] && contentBlocks[i+1].type === 'img'
          && !(contentBlocks[i+2] && contentBlocks[i+2].type === 'img')) {
        // exactly 2 consecutive images → side by side
        grouped.push({ type:'imgrow', items:[b, contentBlocks[i+1]] });
        i += 2;
      } else {
        grouped.push(b);
        i++;
      }
    }

    /* ── auto-detect tool tags ── */
    const fullText = body.innerText || '';
    const tools = [];
    if (/excel/i.test(fullText)||/xlsx/i.test(fullText)) tools.push('EXCEL');
    if (/power.?bi/i.test(fullText)||/\bdax\b/i.test(fullText)) tools.push('POWER BI');
    if (/\bsql\b/i.test(fullText)||/\bquery\b/i.test(fullText)) tools.push('SQL');
    if (/python/i.test(fullText)||/pandas/i.test(fullText)||/matplotlib/i.test(fullText)) tools.push('PYTHON');
    if (/cognos/i.test(fullText)) tools.push('IBM COGNOS');
    if (/scraping/i.test(fullText)||/beautifulsoup/i.test(fullText)) tools.push('WEB SCRAPING');
    if (tools.length === 0) tools.push('DATA ANALYSIS');

    /* ── NAV ── */
    const nav = document.createElement('div');
    nav.id = '_nav';
    nav.innerHTML = `
      <span class="logo">VG_</span>
      <a href="../index.html" class="back">← Back to portfolio</a>
      <a href="https://www.linkedin.com/in/viorelgrozea/" target="_blank">LinkedIn</a>
    `;

    /* ── WRAP ── */
    const wrap = document.createElement('div');
    wrap.id = '_wrap';

    /* title */
    const titleEl = document.createElement('div');
    titleEl.id = '_title';
    const words = rawTitle.split(' ');
    const half = Math.ceil(words.length / 2);
    titleEl.innerHTML = words.slice(0,half).join(' ') + ' <span>' + words.slice(half).join(' ') + '</span>';

    /* meta tags */
    const meta = document.createElement('div');
    meta.id = '_meta';
    meta.innerHTML = tools.map(t => `<span>${t}</span>`).join('');

    wrap.appendChild(titleEl);
    wrap.appendChild(meta);

    /* ── render blocks ── */
    let imgCounter = 0;

    function makeImgWrap(src) {
      const idx = allImgSrcs.indexOf(src.split('?')[0]);
      imgCounter++;
      const wrap = document.createElement('div');
      wrap.className = 'pg-img-wrap';
      wrap.innerHTML = `
        <img src="${src}" alt="Screenshot ${imgCounter}" loading="lazy">
        <span class="expand-btn">⤢ expand</span>
        <span class="img-num">${imgCounter} / ${allImgSrcs.length}</span>
      `;
      wrap.addEventListener('click', () => openLb(idx));
      return wrap;
    }

    grouped.forEach(block => {
      if (block.type === 'img') {
        wrap.appendChild(makeImgWrap(block.src));

      } else if (block.type === 'imgrow') {
        const row = document.createElement('div');
        row.className = 'pg-img-row';
        block.items.forEach(b => row.appendChild(makeImgWrap(b.src)));
        wrap.appendChild(row);

      } else if (block.type === 'code') {
        const codeWrap = document.createElement('div');
        codeWrap.className = 'pg-code';
        codeWrap.innerHTML = `
          <div class="pg-code-lang">${block.lang}</div>
          <button class="pg-code-copy">copy</button>
          <pre>${escapeHtml(block.text)}</pre>
        `;
        codeWrap.querySelector('.pg-code-copy').addEventListener('click', () => {
          navigator.clipboard.writeText(block.text).then(() => {
            codeWrap.querySelector('.pg-code-copy').textContent = 'copied!';
            setTimeout(() => codeWrap.querySelector('.pg-code-copy').textContent = 'copy', 1500);
          });
        });
        wrap.appendChild(codeWrap);

      } else if (block.type === 'heading') {
        const h = document.createElement('div');
        h.className = 'pg-' + block.level;
        h.textContent = block.text;
        wrap.appendChild(h);

      } else if (block.type === 'text') {
        const p = document.createElement('div');
        p.className = 'pg-text';
        p.innerHTML = block.html;
        wrap.appendChild(p);
      }
    });

    /* ── LIGHTBOX ── */
    let currentIdx = 0;
    const lb = document.createElement('div');
    lb.id = '_lightbox';
    lb.innerHTML = `
      <span id="_lb_close">✕</span>
      <div id="_lb_img_wrap"><img id="_lb_img" src="" alt=""></div>
      <div id="_lb_counter"></div>
      <div id="_lb_nav">
        <button id="_lb_prev">← prev</button>
        <button id="_lb_next">next →</button>
      </div>
    `;

    function openLb(idx) {
      currentIdx = idx;
      lb.querySelector('#_lb_img').src = allImgSrcs[currentIdx];
      lb.querySelector('#_lb_counter').textContent = `${currentIdx+1} / ${allImgSrcs.length}`;
      lb.classList.add('open');
    }
    function closeLb() { lb.classList.remove('open'); }

    lb.querySelector('#_lb_close').addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    lb.querySelector('#_lb_prev').addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + allImgSrcs.length) % allImgSrcs.length;
      lb.querySelector('#_lb_img').src = allImgSrcs[currentIdx];
      lb.querySelector('#_lb_counter').textContent = `${currentIdx+1} / ${allImgSrcs.length}`;
    });
    lb.querySelector('#_lb_next').addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % allImgSrcs.length;
      lb.querySelector('#_lb_img').src = allImgSrcs[currentIdx];
      lb.querySelector('#_lb_counter').textContent = `${currentIdx+1} / ${allImgSrcs.length}`;
    });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') lb.querySelector('#_lb_prev').click();
      if (e.key === 'ArrowRight') lb.querySelector('#_lb_next').click();
    });

    /* ── INJECT ── */
    document.body.innerHTML = '';
    document.body.appendChild(nav);
    document.body.appendChild(wrap);
    document.body.appendChild(lb);
  }

  function escapeHtml(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
