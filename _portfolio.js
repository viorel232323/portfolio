(function () {
  /* ── shared dark theme injected into all Notion project pages ── */

  /* 1. Fonts */
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap';
  document.head.appendChild(fontLink);

  /* 2. Global CSS */
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg:#0a0a0a; --bg2:#111; --bg3:#1a1a1a;
      --accent:#00e5a0; --accent2:#00b37d;
      --text:#f0f0f0; --muted:#888; --border:#222; --card:#131313;
    }
    *,*::before,*::after{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      background:var(--bg) !important;
      color:var(--text) !important;
      font-family:'Syne',sans-serif !important;
      font-size:16px; line-height:1.7;
      margin:0 !important; padding:0 !important;
      max-width:100% !important;
    }
    body > *:not(#_nav):not(#_wrap) { display:none !important; }

    /* NAV */
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

    /* WRAP */
    #_wrap { max-width:900px; margin:0 auto; padding:48px 24px 80px; }

    /* TITLE */
    #_title {
      font-size:clamp(28px,5vw,48px);
      font-weight:800; letter-spacing:-0.02em;
      line-height:1.1; margin-bottom:8px;
    }
    #_title span { color:var(--accent); }
    #_meta {
      font-family:'Space Mono',monospace; font-size:11px;
      color:var(--muted); letter-spacing:0.1em;
      margin-bottom:40px; display:flex; gap:12px; flex-wrap:wrap;
    }
    #_meta span {
      border:1px solid var(--border); border-radius:3px;
      padding:3px 10px;
    }

    /* IMAGE GALLERY */
    #_gallery {
      display:grid;
      grid-template-columns:1fr;
      gap:20px;
    }

    /* figure wrapper */
    #_gallery figure {
      margin:0; position:relative;
      border-radius:10px; overflow:hidden;
      border:1px solid var(--border);
      background:var(--card);
      cursor:zoom-in;
      transition:border-color .25s, transform .25s;
    }
    #_gallery figure:hover { border-color:var(--accent); transform:translateY(-2px); }

    /* image itself — full quality, no crop */
    #_gallery img {
      width:100%;
      height:auto;
      display:block;
      /* preserve sharpness for screenshots & code */
      image-rendering:-webkit-optimize-contrast;
      image-rendering:crisp-edges;
      transition:filter .3s;
    }
    #_gallery figure:hover img { filter:brightness(1.05); }

    /* expand overlay — always subtly visible, bright on hover */
    #_gallery .expand-btn {
      position:absolute;
      top:10px; right:10px;
      background:rgba(0,0,0,0.65);
      border:1px solid var(--border);
      border-radius:5px;
      padding:5px 10px;
      font-family:'Space Mono',monospace;
      font-size:11px;
      color:var(--muted);
      opacity:0.5;
      transition:opacity .2s, color .2s, border-color .2s;
      pointer-events:none;
      letter-spacing:0.05em;
    }
    #_gallery figure:hover .expand-btn {
      opacity:1;
      color:var(--accent);
      border-color:var(--accent);
    }

    /* image counter badge */
    #_gallery .img-num {
      position:absolute;
      bottom:10px; left:12px;
      font-family:'Space Mono',monospace;
      font-size:10px;
      color:var(--muted);
      background:rgba(0,0,0,0.6);
      border-radius:3px;
      padding:2px 7px;
    }

    /* LIGHTBOX */
    #_lightbox {
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,0.95); z-index:9999;
      align-items:center; justify-content:center;
      flex-direction:column; gap:14px;
      padding:20px;
    }
    #_lightbox.open { display:flex; }
    #_lb_img_wrap {
      max-width:95vw; max-height:82vh;
      overflow:auto; /* allow scroll for very wide code screenshots */
      border-radius:8px;
      border:1px solid var(--border);
    }
    #_lb_img_wrap img {
      display:block;
      max-width:100%;
      height:auto;
      /* for wide code screenshots let them render at natural size */
      min-width:0;
    }
    #_lb_counter {
      font-family:'Space Mono',monospace;
      font-size:12px; color:var(--muted);
    }
    #_lb_close {
      position:fixed; top:16px; right:20px;
      font-family:'Space Mono',monospace; font-size:22px;
      color:var(--muted); cursor:pointer; z-index:10000;
      transition:color .2s; line-height:1;
    }
    #_lb_close:hover { color:var(--accent); }
    #_lb_nav {
      display:flex; gap:12px;
    }
    #_lb_nav button {
      font-family:'Space Mono',monospace; font-size:13px;
      background:var(--bg3); border:1px solid var(--border);
      color:var(--text); padding:8px 22px; border-radius:4px;
      cursor:pointer; transition:border-color .2s, color .2s;
    }
    #_lb_nav button:hover { border-color:var(--accent); color:var(--accent); }

    /* FADE IN */
    @keyframes fadeUp {
      from{opacity:0;transform:translateY(16px)}
      to{opacity:1;transform:translateY(0)}
    }
    #_wrap { animation: fadeUp .5s ease both; }

    @media(max-width:600px){
      #_nav .logo { display:none; }
      #_wrap { padding:32px 16px 60px; }
    }
  `;
  document.head.appendChild(style);

  /* 3. Build UI after DOM ready */
  function build() {
    const rawTitle = document.title || 'Project';

    /* collect image sources — prefer high-res linked versions */
    const allLinks = Array.from(document.querySelectorAll('a[href]')).filter(a => {
      const h = a.getAttribute('href') || '';
      return /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(h);
    });
    const allImgs = Array.from(document.querySelectorAll('img')).filter(i => {
      const s = i.getAttribute('src') || '';
      return s && !/notion-logo|^data:|icons\//i.test(s);
    });

    let srcs = allLinks.length > 0
      ? allLinks.map(a => a.getAttribute('href'))
      : allImgs.map(i => i.getAttribute('src'));
    srcs = [...new Set(srcs)];

    /* auto-detect tools */
    const text = document.body.innerText || '';
    const tools = [];
    if (/excel/i.test(text) || /xlsx/i.test(text)) tools.push('EXCEL');
    if (/power.?bi/i.test(text) || /dax/i.test(text)) tools.push('POWER BI');
    if (/\bsql\b/i.test(text) || /query/i.test(text)) tools.push('SQL');
    if (/python/i.test(text) || /pandas/i.test(text) || /matplotlib/i.test(text)) tools.push('PYTHON');
    if (/cognos/i.test(text)) tools.push('IBM COGNOS');
    if (/scraping/i.test(text)) tools.push('WEB SCRAPING');
    if (tools.length === 0) tools.push('DATA ANALYSIS');

    /* NAV */
    const nav = document.createElement('div');
    nav.id = '_nav';
    nav.innerHTML = `
      <span class="logo">VG_</span>
      <a href="../index.html" class="back">← Back to portfolio</a>
      <a href="https://www.linkedin.com/in/viorelgrozea/" target="_blank">LinkedIn</a>
    `;

    /* WRAP */
    const wrap = document.createElement('div');
    wrap.id = '_wrap';

    /* Title */
    const titleEl = document.createElement('div');
    titleEl.id = '_title';
    const words = rawTitle.split(' ');
    const half = Math.ceil(words.length / 2);
    titleEl.innerHTML = words.slice(0,half).join(' ') + ' <span>' + words.slice(half).join(' ') + '</span>';

    /* Meta tags */
    const meta = document.createElement('div');
    meta.id = '_meta';
    meta.innerHTML = tools.map(t => `<span>${t}</span>`).join('');

    /* Gallery */
    const gallery = document.createElement('div');
    gallery.id = '_gallery';

    srcs.forEach((src, i) => {
      const fig = document.createElement('figure');

      const img = document.createElement('img');
      img.src = src;
      img.alt = `${rawTitle} — screenshot ${i+1}`;
      img.loading = 'lazy';

      const expandBtn = document.createElement('span');
      expandBtn.className = 'expand-btn';
      expandBtn.textContent = '⤢ expand';

      const numBadge = document.createElement('span');
      numBadge.className = 'img-num';
      numBadge.textContent = `${i+1} / ${srcs.length}`;

      fig.appendChild(img);
      fig.appendChild(expandBtn);
      fig.appendChild(numBadge);
      fig.addEventListener('click', () => openLb(i));
      gallery.appendChild(fig);
    });

    wrap.appendChild(titleEl);
    wrap.appendChild(meta);
    wrap.appendChild(gallery);

    /* LIGHTBOX */
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
      lb.querySelector('#_lb_img').src = srcs[currentIdx];
      lb.querySelector('#_lb_counter').textContent = `${currentIdx+1} / ${srcs.length}`;
      lb.classList.add('open');
    }
    function closeLb() { lb.classList.remove('open'); }

    lb.querySelector('#_lb_close').addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if(e.target === lb || e.target.id === '_lb_img_wrap') closeLb(); });
    lb.querySelector('#_lb_prev').addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + srcs.length) % srcs.length;
      lb.querySelector('#_lb_img').src = srcs[currentIdx];
      lb.querySelector('#_lb_counter').textContent = `${currentIdx+1} / ${srcs.length}`;
    });
    lb.querySelector('#_lb_next').addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % srcs.length;
      lb.querySelector('#_lb_img').src = srcs[currentIdx];
      lb.querySelector('#_lb_counter').textContent = `${currentIdx+1} / ${srcs.length}`;
    });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') lb.querySelector('#_lb_prev').click();
      if (e.key === 'ArrowRight') lb.querySelector('#_lb_next').click();
    });

    /* INJECT */
    document.body.innerHTML = '';
    document.body.appendChild(nav);
    document.body.appendChild(wrap);
    document.body.appendChild(lb);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
