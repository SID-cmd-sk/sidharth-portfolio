/* ============================================================
   PORTFOLIO SCRIPT v2 — Magnetic Cursor + 3D Viewer
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);
let DATA = {};
let viewer3D = null;
let currentProject = null;

/* ─── DATA LOAD ──────────────────────────────────────────── */
async function loadData() {
  try {
    const saved = localStorage.getItem('portfolio_data');
    DATA = saved ? JSON.parse(saved) : await (await fetch('data/portfolio.json')).json();
  } catch {
    DATA = await (await fetch('data/portfolio.json')).json();
  }
  init();
}

/* ─── INIT ───────────────────────────────────────────────── */
function init() {
  initLoader();
  initMagneticCursor();
  initParticles();
  initNavbar();
  renderHero();
  renderAbout();
  renderTimeline();
  renderProjects();
  renderCertifications();
  renderContact();
  initScrollProgress();
  initScrollAnimations();
}

/* ─── LOADER ─────────────────────────────────────────────── */
function initLoader() {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    triggerHeroAnimation();
  }, 1600);
}

/* ═══════════════════════════════════════════════════════════
   CURSOR — free-moving dot + ring, no magnetic pull to elements
   ═══════════════════════════════════════════════════════════ */
// Shared cursor position — used by both cursor and particle system
const cursor = { x: innerWidth / 2, y: innerHeight / 2 };

function initMagneticCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.documentElement.style.cursor = 'none';

  let ringX = cursor.x, ringY = cursor.y;

  // Track real mouse position
  document.addEventListener('mousemove', e => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  });

  function animate() {
    // Dot snaps directly to cursor
    dot.style.left = cursor.x + 'px';
    dot.style.top  = cursor.y + 'px';

    // Ring lags behind with smooth easing — free trailing ring
    ringX += (cursor.x - ringX) * 0.13;
    ringY += (cursor.y - ringY) * 0.13;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animate);
  }
  animate();

  // Click pulse on ring
  document.addEventListener('mousedown', () => {
    gsap.to(ring, { scale: 0.6,  duration: 0.12, ease: 'power2.out',      overwrite: true });
    gsap.to(dot,  { scale: 2.2,  duration: 0.12, ease: 'power2.out',      overwrite: true });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(ring, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.4)', overwrite: true });
    gsap.to(dot,  { scale: 1, duration: 0.3, ease: 'power2.out',          overwrite: true });
  });

  // Grow ring on interactive elements — purely visual, cursor still free
  const HOVER_ELS = 'a, button, .project-card, .filter-btn, .cert-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVER_ELS)) {
      gsap.to(ring, { width: 54, height: 54, borderColor: 'rgba(0,200,255,0.9)', duration: 0.25, overwrite: true });
      gsap.to(dot,  { opacity: 0.35, scale: 0.5, duration: 0.2, overwrite: true });
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVER_ELS)) {
      gsap.to(ring, { width: 36, height: 36, borderColor: 'rgba(0,200,255,0.45)', duration: 0.3, overwrite: true });
      gsap.to(dot,  { opacity: 1, scale: 1, duration: 0.25, overwrite: true });
    }
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ═══════════════════════════════════════════════════════════
   PARTICLES — cursor-reactive constellation
   · Particles drift freely as before
   · When a particle comes within CONNECT_DIST of the cursor,
     a line is drawn from that particle TO the cursor
   · Line brightness/thickness scales with proximity
   · Particles within REPEL_DIST get gently pushed away
     (soft repulsion, not snapping — stays subtle)
   ═══════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('bg-particles');
  const ctx    = canvas.getContext('2d');
  let W = canvas.width  = innerWidth;
  let H = canvas.height = innerHeight;

  const CONNECT_DIST = 160;  // px — line draws to cursor within this range
  const REPEL_DIST   = 80;   // px — soft push away within this range
  const REPEL_FORCE  = 0.6;  // strength of repulsion (low = subtle)

  const pts = Array.from({ length: 70 }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    ox: 0, oy: 0,            // velocity
    r:  Math.random() * 1.3 + 0.3,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    a:  Math.random() * 0.35 + 0.08,
  }));

  (function draw() {
    ctx.clearRect(0, 0, W, H);

    const mx = cursor.x, my = cursor.y;

    pts.forEach(p => {
      // ── Soft repulsion from cursor ──────────────────────
      const cdx  = p.x - mx, cdy = p.y - my;
      const cdist = Math.hypot(cdx, cdy);
      if (cdist < REPEL_DIST && cdist > 0) {
        const force = (1 - cdist / REPEL_DIST) * REPEL_FORCE;
        p.vx += (cdx / cdist) * force * 0.08;
        p.vy += (cdy / cdist) * force * 0.08;
      }

      // Dampen velocity so it doesn't explode
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Move
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,200,255,${p.a})`;
      ctx.fill();
    });

    // ── Particle ↔ particle connections ─────────────────
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,200,255,${0.07 * (1 - d / 110)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    // ── Particle → CURSOR connections ───────────────────
    pts.forEach(p => {
      const dx   = p.x - mx, dy = p.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < CONNECT_DIST) {
        const alpha     = (1 - dist / CONNECT_DIST);
        const lineAlpha = alpha * 0.55;   // max ~0.55 at closest point
        const lineWidth = alpha * 1.4;

        // Gradient line: bright at cursor end, fades at particle end
        const grad = ctx.createLinearGradient(p.x, p.y, mx, my);
        grad.addColorStop(0, `rgba(0,200,255,${lineAlpha * 0.3})`);
        grad.addColorStop(1, `rgba(0,200,255,${lineAlpha})`);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = lineWidth;
        ctx.stroke();

        // Particle glows brighter when close to cursor
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + alpha * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${p.a + alpha * 0.4})`;
        ctx.fill();
      }
    });

    // ── Cursor glow dot on canvas (soft halo under the cursor) ──
    const glowGrad = ctx.createRadialGradient(mx, my, 0, mx, my, CONNECT_DIST * 0.4);
    glowGrad.addColorStop(0,   'rgba(0,200,255,0.06)');
    glowGrad.addColorStop(1,   'rgba(0,200,255,0)');
    ctx.beginPath();
    ctx.arc(mx, my, CONNECT_DIST * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    requestAnimationFrame(draw);
  })();

  window.addEventListener('resize', () => {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  });
}

/* ─── NAVBAR ─────────────────────────────────────────────── */
function initNavbar() {
  window.addEventListener('scroll', () =>
    document.getElementById('navbar').classList.toggle('scrolled', scrollY>50));
  document.getElementById('hamburger')?.addEventListener('click', () =>
    document.getElementById('nav-links').classList.toggle('open'));
}

/* ─── SCROLL PROGRESS ────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () =>
    bar.style.width = (scrollY/(document.body.scrollHeight-innerHeight)*100)+'%');
}

/* ─── HERO ───────────────────────────────────────────────── */
function renderHero() { document.getElementById('hero-desc').textContent = DATA.about; }
function triggerHeroAnimation() {
  gsap.set(['#hero-badge','#hero-name','#hero-title','#hero-desc','#hero-btns','#hero-stats'],{y:30});
  gsap.set('#hero-visual',{x:50});
  const tl = gsap.timeline();
  tl.to('#hero-badge',{opacity:1,y:0,duration:.6,ease:'power3.out'},.1)
    .to('#hero-name', {opacity:1,y:0,duration:.7,ease:'power3.out'},.25)
    .to('#hero-title',{opacity:1,y:0,duration:.6,ease:'power3.out'},.4)
    .to('#hero-desc', {opacity:1,y:0,duration:.6,ease:'power3.out'},.52)
    .to('#hero-btns', {opacity:1,y:0,duration:.6,ease:'power3.out'},.62)
    .to('#hero-stats',{opacity:1,y:0,duration:.6,ease:'power3.out'},.72)
    .to('#hero-visual',{opacity:1,x:0,duration:.9,ease:'power3.out'},.3);
}

/* ─── ABOUT ──────────────────────────────────────────────── */
function renderAbout() {
  document.getElementById('about-text').textContent = DATA.about;
  const m = DATA.meta;
  document.getElementById('info-list').innerHTML = [
    {icon:'📧',v:m.email},{icon:'📱',v:m.phone},{icon:'📍',v:m.location}
  ].map(i=>`<div class="info-item"><div class="info-item-icon">${i.icon}</div><span>${i.v}</span></div>`).join('');
  document.getElementById('skills-panel').innerHTML = DATA.skills.slice(0,6).map(s=>`
    <div class="skill-item">
      <div class="skill-header"><span class="skill-name">${s.name}</span><span class="skill-pct">${s.level}%</span></div>
      <div class="skill-bar"><div class="skill-fill" data-level="${s.level}"></div></div>
    </div>`).join('');
}

/* ─── TIMELINE ───────────────────────────────────────────── */
function renderTimeline() {
  document.getElementById('timeline').innerHTML = DATA.experience.map(e=>`
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-meta"><span class="timeline-period">${e.period}</span><span class="timeline-badge">${e.type}</span></div>
      <div class="timeline-role">${e.role}</div>
      <div class="timeline-company">${e.company}</div>
      <p class="timeline-desc">${e.description}</p>
      <div class="timeline-pills">${e.highlights.map(h=>`<span class="pill">${h}</span>`).join('')}</div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS — media badges + category icons
   ═══════════════════════════════════════════════════════════ */
const CAT_ICON = {CAD:'🔷',CAM:'⚙️',CNC:'🔩',Programming:'💻',Training:'📚',Design:'✏️'};

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const fg   = document.getElementById('filter-group');
  [...new Set(DATA.projects.map(p=>p.category))].forEach(c=>{
    const b=document.createElement('button'); b.className='filter-btn'; b.dataset.filter=c; b.textContent=c; fg.appendChild(b);
  });
  grid.innerHTML = DATA.projects.map(p=>{
    const has3D    = !!p.model3d;
    const hasPhoto = p.photos?.length>0;
    const hasVideo = p.videos?.length>0;
    const badges   = [
      has3D    ? '<span class="media-badge badge-3d">3D</span>' : '',
      hasPhoto ? `<span class="media-badge badge-photo">📷 ${p.photos.length}</span>` : '',
      hasVideo ? `<span class="media-badge badge-video">▶ ${p.videos.length}</span>` : '',
    ].filter(Boolean).join('');
    const thumb = hasPhoto
      ? `<img src="${p.photos[0].url}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;opacity:.7;" loading="lazy"/>`
      : `<div class="project-thumb-icon">${CAT_ICON[p.category]||'🔧'}</div>`;
    return `
    <div class="project-card" data-category="${p.category}" data-tools="${p.tools.join(',')}" data-title="${p.title}" onclick="openModal('${p.id}')">
      <div class="project-thumb">
        ${thumb}
        <div class="project-thumb-label">${p.category}</div>
        ${p.featured?'<div class="project-featured">Featured</div>':''}
        ${badges?`<div class="project-media-badges">${badges}</div>`:''}
      </div>
      <div class="project-body">
        <div class="project-tools">${p.tools.map(t=>`<span class="project-tool">${t}</span>`).join('')}</div>
        <div class="project-title">${p.title}</div>
        <p class="project-desc">${p.description.slice(0,100)}…</p>
      </div>
      <div class="project-arrow">→</div>
    </div>`;
  }).join('');
  document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); filterProjects();
  }));
  document.getElementById('search-input').addEventListener('input', filterProjects);
}

function filterProjects() {
  const af = document.querySelector('.filter-btn.active')?.dataset.filter||'all';
  const q  = document.getElementById('search-input').value.toLowerCase();
  document.querySelectorAll('.project-card').forEach(card=>{
    const ok = (af==='all'||card.dataset.category===af) && (!q||card.dataset.title.toLowerCase().includes(q)||card.dataset.tools.toLowerCase().includes(q));
    if (ok) { card.classList.remove('hidden'); gsap.fromTo(card,{opacity:0,scale:.93,y:20},{opacity:1,scale:1,y:0,duration:.4,ease:'power3.out'}); }
    else gsap.to(card,{opacity:0,scale:.93,y:20,duration:.22,onComplete:()=>card.classList.add('hidden')});
  });
}

/* ═══════════════════════════════════════════════════════════
   MODAL — info + tabbed media (photos / videos / 3D)
   ═══════════════════════════════════════════════════════════ */
function openModal(id) {
  currentProject = DATA.projects.find(p=>p.id===id);
  if (!currentProject) return;
  const p = currentProject;
  document.getElementById('modal-cat').textContent   = p.category;
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-desc').textContent  = p.description;
  document.getElementById('modal-tools').innerHTML   = p.tools.map(t=>`<span class="project-tool" style="padding:.3rem .8rem;font-size:.75rem;">${t}</span>`).join('');
  document.getElementById('modal-highlights').innerHTML = p.highlights.map(h=>`
    <li style="color:var(--text-dim);font-size:.9rem;padding-left:1.2rem;position:relative;margin-bottom:.4rem;">
      <span style="position:absolute;left:0;color:var(--neon);">▸</span>${h}</li>`).join('');
  buildModalMedia(p);
  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function buildModalMedia(p) {
  const wrap = document.getElementById('modal-media');
  wrap.innerHTML = '';
  const has3D    = !!p.model3d;
  const hasPhoto = p.photos?.length>0;
  const hasVideo = p.videos?.length>0;
  if (!has3D && !hasPhoto && !hasVideo) return;

  const tabs = [];
  if (hasPhoto) tabs.push({id:'photos', label:`📷 Photos (${p.photos.length})`});
  if (hasVideo) tabs.push({id:'videos', label:`▶ Videos (${p.videos.length})`});
  if (has3D)    tabs.push({id:'3d',     label:'🔷 3D Model'});

  wrap.innerHTML = `
    <div class="media-tabs">
      ${tabs.map((t,i)=>`<button class="media-tab${i===0?' active':''}" onclick="switchTab('${t.id}')">${t.label}</button>`).join('')}
    </div>
    <div class="media-panels">
      ${hasPhoto?`<div class="media-panel active" id="mpanel-photos">${buildPhotoGallery(p.photos)}</div>`:''}
      ${hasVideo?`<div class="media-panel" id="mpanel-videos">${buildVideoGallery(p.videos)}</div>`:''}
      ${has3D?`<div class="media-panel" id="mpanel-3d">
        <div id="viewer3d-container" style="width:100%;height:360px;border-radius:10px;overflow:hidden;background:#070b14;border:1px solid var(--border);position:relative;"></div>
        <p style="font-size:.72rem;color:var(--text-dim);margin-top:.5rem;text-align:center;">🖱 Drag to rotate · Scroll to zoom · Right-drag to pan · Touch supported</p>
      </div>`:''}
    </div>`;
  if (tabs[0]?.id==='3d') setTimeout(()=>init3DViewer(p.model3d),80);
}

function switchTab(id) {
  document.querySelectorAll('.media-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.media-panel').forEach(p=>p.classList.remove('active'));
  document.querySelector(`.media-tab[onclick*="${id}"]`)?.classList.add('active');
  document.getElementById(`mpanel-${id}`)?.classList.add('active');
  if (id==='3d' && currentProject?.model3d) setTimeout(()=>init3DViewer(currentProject.model3d),50);
}

function buildPhotoGallery(photos) {
  return `<div class="photo-gallery">
    <div class="photo-main"><img src="${photos[0].url}" alt="" id="photo-main-img" style="width:100%;height:240px;object-fit:contain;border-radius:8px;background:#070b14;" />
      <div class="photo-caption" id="photo-caption">${photos[0].caption||''}</div></div>
    ${photos.length>1?`<div class="photo-thumbs">${photos.map((ph,i)=>`
      <div class="photo-thumb${i===0?' active':''}" onclick="setPhoto('${ph.url}','${ph.caption||''}',${i})">
        <img src="${ph.url}" alt="" loading="lazy" style="width:100%;height:60px;object-fit:cover;border-radius:5px;" /></div>`).join('')}</div>`:''}
  </div>`;
}

function setPhoto(url, cap, idx) {
  const img = document.getElementById('photo-main-img');
  const capEl = document.getElementById('photo-caption');
  gsap.to(img,{opacity:0,duration:.18,onComplete:()=>{ img.src=url; if(capEl) capEl.textContent=cap; gsap.to(img,{opacity:1,duration:.25}); }});
  document.querySelectorAll('.photo-thumb').forEach((t,i)=>t.classList.toggle('active',i===idx));
}

function buildVideoGallery(videos) {
  return `<div class="video-gallery">${videos.map(v=>`
    <div class="video-item" style="margin-bottom:1.2rem;">
      ${v.type==='youtube'
        ?`<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe src="https://www.youtube.com/embed/${v.id}" style="position:absolute;inset:0;width:100%;height:100%;border-radius:8px;border:0;" allowfullscreen loading="lazy"></iframe></div>`
        :`<video controls preload="metadata" style="width:100%;border-radius:8px;"><source src="${v.url}" /></video>`}
      ${v.caption?`<p style="font-size:.75rem;color:var(--text-dim);margin-top:.4rem;">${v.caption}</p>`:''}
    </div>`).join('')}</div>`;
}

/* ═══════════════════════════════════════════════════════════
   3D VIEWER — Three.js · STL · OBJ · GLTF/GLB · fallback
   ═══════════════════════════════════════════════════════════ */
function init3DViewer(modelData) {
  const container = document.getElementById('viewer3d-container');
  if (!container) return;
  if (viewer3D) { viewer3D.dispose(); viewer3D=null; }
  container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:.8rem;">
    <div class="loader-spin"></div>
    <span style="color:var(--text-dim);font-family:var(--font-mono);font-size:.7rem;letter-spacing:2px;">LOADING 3D MODEL…</span></div>`;
  if (!window.THREE) {
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload=()=>setupScene(container,modelData);
    s.onerror=()=>{ container.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-dim);font-size:.85rem;">Three.js unavailable</div>'; };
    document.head.appendChild(s);
  } else setupScene(container,modelData);
}

function setupScene(container, modelData) {
  const THREE=window.THREE;
  if (!THREE) return;
  container.innerHTML='';
  const W=container.clientWidth, H=container.clientHeight||360;
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x070b14);
  const camera=new THREE.PerspectiveCamera(45,W/H,.01,1000); camera.position.set(0,1.5,4);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(W,H); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.shadowMap.enabled=true; container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0x445566,1.4));
  const d1=new THREE.DirectionalLight(0x00c8ff,1.6); d1.position.set(5,10,5); scene.add(d1);
  const d2=new THREE.DirectionalLight(0x7b2fff,.9); d2.position.set(-5,-3,-5); scene.add(d2);
  const pt=new THREE.PointLight(0x00ff9d,.7,20); pt.position.set(0,5,0); scene.add(pt);
  const grid=new THREE.GridHelper(8,24,0x00c8ff,0x112233); grid.position.y=-1.5; scene.add(grid);

  // Orbit state
  let phi=Math.PI/3, theta=Math.PI/4, radius=4, panX=0, panY=0;
  let isDragging=false, isRight=false, lastX=0, lastY=0;
  renderer.domElement.addEventListener('mousedown',e=>{ isDragging=true; isRight=e.button===2; lastX=e.clientX; lastY=e.clientY; e.preventDefault(); });
  renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
  window.addEventListener('mousemove',e=>{ if(!isDragging)return; const dx=e.clientX-lastX, dy=e.clientY-lastY; lastX=e.clientX; lastY=e.clientY;
    if(isRight){panX+=dx*.005;panY-=dy*.005;}else{theta-=dx*.009;phi=Math.max(.05,Math.min(Math.PI-.05,phi+dy*.009));} });
  window.addEventListener('mouseup',()=>isDragging=false);
  renderer.domElement.addEventListener('wheel',e=>{ radius=Math.max(.5,Math.min(30,radius+e.deltaY*.012)); e.preventDefault(); },{passive:false});
  // Touch
  let touches=[];
  renderer.domElement.addEventListener('touchstart',e=>{touches=[...e.touches];},{passive:true});
  renderer.domElement.addEventListener('touchmove',e=>{
    if(e.touches.length===1){const dx=e.touches[0].clientX-touches[0].clientX,dy=e.touches[0].clientY-touches[0].clientY; theta-=dx*.012; phi=Math.max(.1,Math.min(Math.PI-.1,phi+dy*.012));}
    else if(e.touches.length===2){const d0=Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY); const d1=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); radius=Math.max(.5,Math.min(30,radius-(d1-d0)*.02));}
    touches=[...e.touches]; e.preventDefault();
  },{passive:false});

  // Load model
  const fmt=(modelData?.format||'').toLowerCase();
  const url=modelData?.url||'';
  if (url.match(/\.stl$/i)||fmt==='stl') loadSTL(scene,url,THREE,m=>centerModel(m,camera));
  else if (url.match(/\.obj$/i)||fmt==='obj') loadOBJ(scene,url,THREE,m=>centerModel(m,camera));
  else if (url.match(/\.(gltf|glb)$/i)||fmt==='gltf'||fmt==='glb') loadGLTF(scene,url,THREE,m=>centerModel(m.scene||m,camera));
  else buildDemoModel(scene,THREE); // Procedural demo part

  // Render loop
  let raf; function render(){
    raf=requestAnimationFrame(render);
    camera.position.x=radius*Math.sin(phi)*Math.sin(theta)+panX;
    camera.position.y=radius*Math.cos(phi)+panY;
    camera.position.z=radius*Math.sin(phi)*Math.cos(theta);
    camera.lookAt(panX,panY,0);
    if(!isDragging) theta+=.004;
    renderer.render(scene,camera);
  } render();

  const ro=new ResizeObserver(()=>{ const w=container.clientWidth,h=container.clientHeight||360; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); });
  ro.observe(container);
  viewer3D={ dispose:()=>{ cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); container.innerHTML=''; } };
}

function centerModel(obj, camera) {
  if (!obj) return;
  const box=new THREE.Box3().setFromObject(obj);
  const center=box.getCenter(new THREE.Vector3());
  const size=box.getSize(new THREE.Vector3());
  obj.position.sub(center);
  camera.position.z=Math.max(size.x,size.y,size.z)*2.2;
}

function loadSTL(scene,url,THREE,cb){
  fetch(url).then(r=>r.arrayBuffer()).then(buf=>{
    const v=new DataView(buf), n=v.getUint32(80,true);
    const pos=new Float32Array(n*9),nor=new Float32Array(n*9);
    for(let i=0;i<n;i++){const o=84+i*50,nx=v.getFloat32(o,true),ny=v.getFloat32(o+4,true),nz=v.getFloat32(o+8,true);
      for(let j=0;j<3;j++){const vo=o+12+j*12; pos[i*9+j*3]=v.getFloat32(vo,true);pos[i*9+j*3+1]=v.getFloat32(vo+4,true);pos[i*9+j*3+2]=v.getFloat32(vo+8,true);
        nor[i*9+j*3]=nx;nor[i*9+j*3+1]=ny;nor[i*9+j*3+2]=nz;}}
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setAttribute('normal',new THREE.BufferAttribute(nor,3));
    const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x00c8ff,metalness:.85,roughness:.2,side:THREE.DoubleSide}));
    scene.add(mesh); cb(mesh);
  }).catch(()=>{ buildDemoModel(scene,THREE); });
}

function loadOBJ(scene,url,THREE,cb){
  fetch(url).then(r=>r.text()).then(txt=>{
    const verts=[],posArr=[]; txt.split('\n').forEach(line=>{const p=line.trim().split(/\s+/);
      if(p[0]==='v') verts.push([+p[1],+p[2],+p[3]]);
      if(p[0]==='f'){const idx=p.slice(1).map(x=>parseInt(x.split('/')[0])-1);
        for(let i=1;i<idx.length-1;i++) [idx[0],idx[i],idx[i+1]].forEach(vi=>posArr.push(...verts[vi]));} });
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(posArr),3)); geo.computeVertexNormals();
    const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x00c8ff,metalness:.8,roughness:.25,side:THREE.DoubleSide}));
    scene.add(mesh); cb(mesh);
  }).catch(()=>{ buildDemoModel(scene,THREE); });
}

function loadGLTF(scene,url,THREE,cb){
  if(!window.GLTFLoader){
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
    s.onload=()=>_gltf(scene,url,THREE,cb); s.onerror=()=>buildDemoModel(scene,THREE);
    document.head.appendChild(s);
  } else _gltf(scene,url,THREE,cb);
}
function _gltf(scene,url,THREE,cb){
  try{ new THREE.GLTFLoader().load(url,g=>{scene.add(g.scene);cb(g);},undefined,()=>buildDemoModel(scene,THREE)); }
  catch{ buildDemoModel(scene,THREE); }
}

function buildDemoModel(scene,THREE){
  const g=new THREE.Group();
  const mat1=new THREE.MeshStandardMaterial({color:0x334455,metalness:.92,roughness:.25});
  const mat2=new THREE.MeshStandardMaterial({color:0x00c8ff,metalness:.95,roughness:.1,emissive:0x002233});
  g.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(2.2,.18,1.6),mat1)));
  const boss=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.65,32),mat2); boss.position.set(0,.42,0); g.add(boss);
  [[-.75,.12,-.6],[.75,.12,-.6],[-.75,.12,.6],[.75,.12,.6]].forEach(pos=>{
    const h=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.22,14),new THREE.MeshStandardMaterial({color:0x111827,metalness:.5,roughness:.8}));
    h.position.set(...pos); g.add(h);
  });
  [-.55,.55].forEach(x=>{const r=new THREE.Mesh(new THREE.BoxGeometry(.07,.55,1.6),mat1); r.position.set(x,.28,0); g.add(r);});
  scene.add(g); return g;
}

/* ─── CLOSE MODAL ────────────────────────────────────────── */
function closeModal(e) {
  if (e && e.target!==document.getElementById('modal-overlay') && !e.target.classList.contains('modal-close')) return;
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow='';
  if (viewer3D) { viewer3D.dispose(); viewer3D=null; }
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

/* ─── CERTIFICATIONS ─────────────────────────────────────── */
function renderCertifications() {
  document.getElementById('certs-grid').innerHTML=DATA.certifications.map(c=>`
    <div class="cert-card"><div class="cert-icon">🏆</div>
      <div class="cert-info">
        <div class="cert-level ${c.level==='Professional'?'pro':c.level==='Specialist'?'spec':'assoc'}">${c.level}</div>
        <div class="cert-name">${c.name}</div><div class="cert-issuer">${c.issuer}</div>
      </div></div>`).join('');
}

/* ─── CONTACT ────────────────────────────────────────────── */
function renderContact() {
  const m=DATA.meta;
  document.getElementById('contact-items').innerHTML=[
    {icon:'📧',label:'Email',v:m.email},{icon:'📱',label:'Phone',v:m.phone},{icon:'📍',label:'Location',v:m.location}
  ].map(i=>`<div class="contact-item"><div class="contact-item-icon">${i.icon}</div>
    <div><div class="contact-item-label">${i.label}</div><div class="contact-item-value">${i.v}</div></div></div>`).join('');
}

function submitForm() {
  const n=document.getElementById('form-name').value,
        e=document.getElementById('form-email').value,
        m=document.getElementById('form-msg').value;

  if(!n||!e||!m){
    showToast('Please fill all fields.');
    return;
  }

  showToast("Message sent! I'll get back to you soon.");

  gtag('event', 'contact_form_submit', {
    event_category: 'engagement',
    event_label: 'Contact Form'
  });

  ['form-name','form-email','form-msg'].forEach(id =>
    document.getElementById(id).value=''
  );
}

function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);}

/* ─── SCROLL ANIMATIONS ──────────────────────────────────── */
function initScrollAnimations() {
  gsap.utils.toArray('.reveal').forEach(el=>gsap.fromTo(el,{opacity:0,y:40},{opacity:1,y:0,duration:.7,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}}));
  ScrollTrigger.create({trigger:'#about',start:'top 62%',onEnter:()=>document.querySelectorAll('.skill-fill').forEach(b=>gsap.to(b,{width:b.dataset.level+'%',duration:1.4,ease:'power3.out',delay:.2}))});
  ScrollTrigger.create({trigger:'#projects-grid',start:'top 85%',onEnter:()=>gsap.utils.toArray('.project-card').forEach((c,i)=>gsap.to(c,{opacity:1,y:0,duration:.6,ease:'power3.out',delay:i*.09}))});
  gsap.utils.toArray('.timeline-item').forEach((el,i)=>gsap.to(el,{opacity:1,x:0,duration:.7,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'},delay:i*.15}));
  ScrollTrigger.create({trigger:'#certs-grid',start:'top 85%',onEnter:()=>gsap.utils.toArray('.cert-card').forEach((c,i)=>gsap.to(c,{opacity:1,y:0,duration:.5,ease:'power3.out',delay:i*.07}))});
}

loadData();
