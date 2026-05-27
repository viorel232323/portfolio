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
      font-size:16px;line-height:1.7;
      margin:0 !important; padding:0 !important;
      max-width:100% !important;
    }

    /* kill all Notion default styles */
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
    #_wrap { max-width:860px; margin:0 auto; padding:48px 24px 80px; }

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
      margin-bottom:40px; display:flex; gap:16px; flex-wrap:wrap;
    }
    #_meta span {
      border:1px solid var(--border); border-radius:3px;
      padding:3px 10px;
    }

    /* IMAGE GALLERY */
    #_gallery {
      display:grid;
      grid-template-columns:1fr;
      gap:16px;
    }
    #_gallery figure {
      margin:0; border-radius:10px; overflow:hidden;
      border:1px solid var(--border);
      background:var(--card);
      transition:border-color .25s, transform .25s;
      cursor:pointer;
    }
    #_gallery figure:hover { border-color:var(--accent); transform:translateY(-2px); }
    #_gallery img {
      width:100%; height:auto; display:block;
      transition:opacity .3s;
    }

    /* LIGHTBOX */
    #_lightbox {
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,0.92); z-index:9999;
      align-items:center; justify-content:center; padding:24px;
    }
    #_lightbox.open { display:flex; }
    #_lightbox img {
      max-width:100%; max-height:90vh;
      border-radius:8px; border:1px solid var(--border);
      box-shadow:0 0 60px rgba(0,229,160,0.08);
    }
    #_lb_close {
      position:fixed; top:20px; right:24px;
      font-family:'Space Mono',monospace; font-size:20px;
      color:var(--muted); cursor:pointer; z-index:10000;
      transition:color .2s;
    }
    #_lb_close:hover { color:var(--accent); }
    #_lb_nav {
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      display:flex; gap:12px; z-index:10000;
    }
    #_lb_nav button {
      font-family:'Space Mono',monospace; font-size:13px;
      background:var(--bg3); border:1px solid var(--border);
      color:var(--text); padding:8px 20px; border-radius:4px;
      cursor:pointer; transition:border-color .2s, color .2s;
    }
    #_lb_nav button:hover { border-color:var(--accent); color:var(--accent); }

    /* FADE IN ANIMATION */
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

  /* 3. Wait for DOM then build UI */
  function build() {
    /* collect raw title and images from Notion body */
    const rawTitle = document.title || 'Project';
    const allImgs = Array.from(document.querySelectorAll('img')).filter(i => {
      const src = i.getAttribute('src') || '';
      return src && !src.includes('notion-logo') && !src.includes('icons/');
    });
    const allLinks = Array.from(document.querySelectorAll('a[href]')).filter(a => {
      const h = a.getAttribute('href') || '';
      return (h.endsWith('.png') || h.endsWith('.jpg') || h.endsWith('.jpeg') || h.endsWith('.gif') || h.endsWith('.webp'));
    });

    /* prefer linked images (higher res) over img src */
    let srcs = [];
    if (allLinks.length > 0) {
      srcs = allLinks.map(a => a.getAttribute('href'));
    } else {
      srcs = allImgs.map(i => i.getAttribute('src'));
    }
    srcs = [...new Set(srcs)]; /* dedupe */

    /* detect tool tags */
    const text = document.body.innerText || '';
    const tools = [];
    if (/excel/i.test(text) || /xlsx/i.test(text)) tools.push('EXCEL');
    if (/sql/i.test(text) || /query/i.test(text)) tools.push('SQL');
    if (/power.?bi/i.test(text) || /dax/i.test(text)) tools.push('POWER BI');
    if (/python/i.test(text) || /pandas/i.test(text)) tools.push('PYTHON');
    if (/tableau/i.test(text)) tools.push('TABLEAU');
    if (/cognos/i.test(text)) tools.push('IBM COGNOS');
    if (/scraping/i.test(text)) tools.push('WEB SCRAPING');
    if (tools.length === 0) tools.push('DATA ANALYSIS');

    /* build nav */
    const nav = document.createElement('div');
    nav.id = '_nav';
    nav.innerHTML = `
      <span class="logo">VG_</span>
      <a href="../index.html" class="back">← Back to portfolio</a>
      <a href="https://www.linkedin.com/in/viorelgrozea/" target="_blank">LinkedIn</a>
    `;

    /* build wrap */
    const wrap = document.createElement('div');
    wrap.id = '_wrap';

    /* title */
    const titleEl = document.createElement('div');
    titleEl.id = '_title';
    const words = rawTitle.split(' ');
    const half = Math.ceil(words.length / 2);
    titleEl.innerHTML = words.slice(0, half).join(' ') + ' <span>' + words.slice(half).join(' ') + '</span>';

    /* meta tags */
    const meta = document.createElement('div');
    meta.id = '_meta';
    meta.innerHTML = tools.map(t => `<span>${t}</span>`).join('') + `<span>${srcs.length} SCREENSHOTS</span>`;

    /* gallery */
    const gallery = document.createElement('div');
    gallery.id = '_gallery';
    srcs.forEach((src, i) => {
      const fig = document.createElement('figure');
      const img = document.createElement('img');
      img.src = src;
      img.alt = rawTitle + ' screenshot ' + (i + 1);
      img.loading = 'lazy';
      fig.appendChild(img);
      fig.addEventListener('click', () => openLightbox(i));
      gallery.appendChild(fig);
    });

    wrap.appendChild(titleEl);
    wrap.appendChild(meta);
    wrap.appendChild(gallery);

    /* lightbox */
    let currentIdx = 0;
    const lb = document.createElement('div');
    lb.id = '_lightbox';
    lb.innerHTML = `
      <span id="_lb_close">✕</span>
      <img id="_lb_img" src="" alt="">
      <div id="_lb_nav">
        <button id="_lb_prev">← prev</button>
        <button id="_lb_next">next →</button>
      </div>
    `;

    function openLightbox(idx) {
      currentIdx = idx;
      document.getElementById('_lb_img').src = srcs[currentIdx];
      lb.classList.add('open');
    }
    function closeLightbox() { lb.classList.remove('open'); }
    lb.querySelector('#_lb_close').addEventListener('click', closeLightbox);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    lb.querySelector('#_lb_prev').addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + srcs.length) % srcs.length;
      document.getElementById('_lb_img').src = srcs[currentIdx];
    });
    lb.querySelector('#_lb_next').addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % srcs.length;
      document.getElementById('_lb_img').src = srcs[currentIdx];
    });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lb.querySelector('#_lb_prev').click();
      if (e.key === 'ArrowRight') lb.querySelector('#_lb_next').click();
    });

    /* inject everything */
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
