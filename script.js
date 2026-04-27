/* ============================================================
   PORTFOLIO SCRIPT — Sidharth CAD/CAM Engineer
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

let DATA = {};

/* ===== DATA LOAD ===== */
async function loadData() {
  try {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      DATA = JSON.parse(saved);
    } else {
      const res = await fetch('data/portfolio.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      DATA = await res.json();
    }
  } catch (e) {
    console.warn('portfolio.json load failed, using fallback data.', e);
    DATA = {
      meta: {
        name: 'Sidharth',
        title: 'Application Engineer',
        subtitle: 'SolidWorks · SolidCAM · DraftSight · CNC Programming',
        email: 'sidharthkr1859@gmail.com',
        phone: '7042071859',
        location: 'Badarpur, South Delhi, Delhi – 110044',
        socialLinks: { linkedin: '#', github: '#' }
      },
      about: 'Application Engineer with hands-on expertise in SolidWorks, SolidCAM, and DraftSight. Passionate about bridging the gap between digital design and physical manufacturing—from generating precision CAD models and CAM toolpaths to automating drafting workflows with AutoLISP scripts and validating G-code for CNC machines.',
      skills: [
        { name: 'SolidWorks', level: 95, category: 'CAD' },
        { name: 'SolidCAM', level: 90, category: 'CAM' },
        { name: 'DraftSight', level: 88, category: 'CAD' },
        { name: 'CNC Programming (G-Code)', level: 82, category: 'CNC' },
        { name: 'AutoLISP Scripting', level: 75, category: 'Programming' },
        { name: 'CAM Toolpath Generation', level: 87, category: 'CAM' }
      ],
      experience: [
        {
          id: 'exp1',
          company: 'SKS Scan tech Engg. Exim Pvt. Ltd.',
          role: 'Application Engineer',
          period: 'Dec 2024 – Present',
          type: 'Full-Time',
          description: 'Handle technical support, training, and workflow issues for SolidWorks, SolidCAM and DraftSight. Create and refine CAD models, CAM toolpaths, and CNC post processors. Build AutoLISP scripts to automate drafting tasks.',
          highlights: ['Technical Support', 'CAD/CAM Training', 'AutoLISP Automation', 'G-Code Validation', 'Post Processor Development']
        },
        {
          id: 'exp2',
          company: 'Rico Auto Industries',
          role: 'Apprentice – Design & Machining Support',
          period: 'May 2024 – Dec 2024',
          type: 'Apprenticeship',
          description: 'Reviewed and interpreted engineering drawings and CAD models before part production. Modified CAD models to improve manufacturability and machining feasibility.',
          highlights: ['Engineering Drawing Review', 'CAD Model Modification', 'G-Code Editing', 'Tool Offset Adjustment', 'Design-to-Production Workflow']
        }
      ],
      certifications: [
        { id: 'c1', name: 'SOLIDWORKS API Professional (CSWP-API)', issuer: 'Dassault Systèmes', level: 'Professional' },
        { id: 'c2', name: 'SOLIDWORKS Design Professional (CSWP)', issuer: 'Dassault Systèmes', level: 'Professional' },
        { id: 'c3', name: 'SOLIDWORKS Simulation Associate', issuer: 'Dassault Systèmes', level: 'Associate' },
        { id: 'c4', name: 'DraftSight Specialist', issuer: 'Dassault Systèmes', level: 'Specialist' },
        { id: 'c5', name: '3DSwymer Associate', issuer: 'Dassault Systèmes', level: 'Associate' },
        { id: 'c6', name: 'SOLIDWORKS Design Associate (CSWA)', issuer: 'Dassault Systèmes', level: 'Associate' },
        { id: 'c7', name: 'SOLIDWORKS CAM Professional', issuer: 'Dassault Systèmes', level: 'Professional' },
        { id: 'c8', name: 'DraftSight Associate', issuer: 'Dassault Systèmes', level: 'Associate' },
        { id: 'c9', name: 'Certified SolidCAM Academic Professional', issuer: 'SolidCAM', level: 'Professional' },
        { id: 'c10', name: 'Certified SolidCAM Academic Associate', issuer: 'SolidCAM', level: 'Associate' }
      ],
      projects: [
        {
          id: 'p1', title: 'CNC Post Processor Development', category: 'CNC',
          tools: ['SolidCAM', 'G-Code', 'CNC'], featured: true,
          description: 'Developed and refined custom CNC post processors to translate SolidCAM toolpaths into machine-specific G-code. Ensured compatibility across multiple CNC machine configurations at client sites.',
          highlights: ['Custom post processor scripts', 'Multi-machine compatibility', 'G-code validation workflow']
        },
        {
          id: 'p2', title: 'AutoLISP Drafting Automation Suite', category: 'Programming',
          tools: ['DraftSight', 'AutoLISP'], featured: true,
          description: 'Built a suite of AutoLISP scripts to automate repetitive drafting tasks in DraftSight—including auto-dimensioning, layer management, and title block population—reducing manual effort by over 60%.',
          highlights: ['Auto-dimensioning routines', 'Layer automation', 'Title block population']
        },
        {
          id: 'p3', title: 'CAM Toolpath Optimization', category: 'CAM',
          tools: ['SolidCAM', 'SolidWorks'], featured: false,
          description: 'Optimized multi-axis CAM toolpaths for complex parts, reducing machining time while maintaining tight tolerances.',
          highlights: ['Multi-axis machining', 'Cycle time reduction', 'Tolerance validation']
        },
        {
          id: 'p4', title: 'SolidWorks Training Program', category: 'Training',
          tools: ['SolidWorks', 'SolidCAM'], featured: false,
          description: 'Designed and delivered structured training programs for engineering clients covering SolidWorks 3D modelling, assembly, drawing, and SolidCAM fundamentals.',
          highlights: ['Curriculum development', 'Client-facing delivery', 'Technical documentation']
        },
        {
          id: 'p5', title: 'Manufacturability CAD Model Rework', category: 'CAD',
          tools: ['SolidWorks', 'DraftSight'], featured: false,
          description: 'At Rico Auto, reviewed and modified production CAD models to improve manufacturability and reduce machining complexity.',
          highlights: ['Design-for-manufacturing', 'Part feasibility review', 'Cross-team collaboration']
        },
        {
          id: 'p6', title: 'Software–Machine Integration Troubleshooting', category: 'CNC',
          tools: ['SolidCAM', 'CNC', 'G-Code'], featured: true,
          description: 'Diagnosed and resolved integration issues between CAM software and CNC machines at multiple client sites.',
          highlights: ['Root cause analysis', 'On-site troubleshooting', 'G-code debugging']
        }
      ]
    };
  }
  init();
}

/* ===== INIT ===== */
function init() {
  initLoader();
  initCursor();
  initParticles();
  initNavbar();
  renderHero();
  renderAbout();
  renderSkills();
  renderTimeline();
  renderProjects();
  renderCertifications();
  renderContact();
  initScrollProgress();
  initAnimations();
}

/* ===== LOADER ===== */
function initLoader() {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => { loader.style.display = 'none'; }, 700);
    }
    triggerHeroAnimation();
  }, 1600);
}

/* ===== CUSTOM CURSOR ===== */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

/* ===== PARTICLES ===== */
function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const count = 55;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,200,255,${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,200,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.getElementById('nav-links').classList.toggle('open');
    });
  }
}

/* ===== SCROLL PROGRESS ===== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  });
}

/* ===== HERO RENDER ===== */
function renderHero() {
  const desc = document.getElementById('hero-desc');
  if (desc) desc.textContent = DATA.about;
}

function triggerHeroAnimation() {
  // FIX: Set initial states FIRST, then animate into place
  gsap.set(['#hero-badge','#hero-name','#hero-title','#hero-desc','#hero-btns','#hero-stats'], { opacity: 0, y: 30 });
  gsap.set('#hero-visual', { opacity: 0, x: 50 });

  const tl = gsap.timeline();
  tl.to('#hero-badge',  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.1)
    .to('#hero-name',   { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.25)
    .to('#hero-title',  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.4)
    .to('#hero-desc',   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.55)
    .to('#hero-btns',   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.65)
    .to('#hero-stats',  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.75)
    .to('#hero-visual', { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.3);
}

/* ===== ABOUT RENDER ===== */
function renderAbout() {
  const aboutText = document.getElementById('about-text');
  if (aboutText) aboutText.textContent = DATA.about;

  const m = DATA.meta;
  const infoData = [
    { icon: '📧', label: m.email },
    { icon: '📱', label: m.phone },
    { icon: '📍', label: m.location },
  ];

  const infoList = document.getElementById('info-list');
  if (infoList) {
    infoList.innerHTML = infoData.map(i => `
      <div class="info-item">
        <div class="info-item-icon">${i.icon}</div>
        <span>${i.label}</span>
      </div>
    `).join('');
  }

  const panel = document.getElementById('skills-panel');
  if (panel) {
    panel.innerHTML = DATA.skills.slice(0, 6).map(s => `
      <div class="skill-item">
        <div class="skill-header">
          <span class="skill-name">${s.name}</span>
          <span class="skill-pct">${s.level}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-fill" data-level="${s.level}"></div>
        </div>
      </div>
    `).join('');
  }
}

/* ===== SKILLS RENDER ===== */
function renderSkills() {
  // Skills are rendered inline within about section.
}

/* ===== TIMELINE RENDER ===== */
function renderTimeline() {
  const container = document.getElementById('timeline');
  if (!container) return;
  container.innerHTML = DATA.experience.map((exp, i) => `
    <div class="timeline-item" data-index="${i}">
      <div class="timeline-dot"></div>
      <div class="timeline-meta">
        <span class="timeline-period">${exp.period}</span>
        <span class="timeline-badge">${exp.type}</span>
      </div>
      <div class="timeline-role">${exp.role}</div>
      <div class="timeline-company">${exp.company}</div>
      <p class="timeline-desc">${exp.description}</p>
      <div class="timeline-pills">
        ${exp.highlights.map(h => `<span class="pill">${h}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ===== PROJECTS RENDER ===== */
const CATEGORY_ICONS = { CAD: '🔷', CAM: '⚙️', CNC: '🔩', Programming: '💻', Training: '📚', Design: '✏️' };

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const filterGroup = document.getElementById('filter-group');
  if (!grid || !filterGroup) return;

  const categories = [...new Set(DATA.projects.map(p => p.category))];
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = cat;
    btn.textContent = cat;
    filterGroup.appendChild(btn);
  });

  grid.innerHTML = DATA.projects.map(p => `
    <div class="project-card" data-category="${p.category}" data-tools="${p.tools.join(',')}" data-title="${p.title}" onclick="openModal('${p.id}')">
      <div class="project-thumb">
        <div class="project-thumb-icon">${CATEGORY_ICONS[p.category] || '🔧'}</div>
        <div class="project-thumb-label">${p.category}</div>
        ${p.featured ? '<div class="project-featured">Featured</div>' : ''}
      </div>
      <div class="project-body">
        <div class="project-tools">${p.tools.map(t => `<span class="project-tool">${t}</span>`).join('')}</div>
        <div class="project-title">${p.title}</div>
        <p class="project-desc">${p.description.slice(0, 100)}...</p>
      </div>
      <div class="project-arrow">→</div>
    </div>
  `).join('');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', filterProjects);
}

function filterProjects() {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const catMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
    const searchMatch = !searchTerm ||
      card.dataset.title.toLowerCase().includes(searchTerm) ||
      card.dataset.tools.toLowerCase().includes(searchTerm) ||
      card.dataset.category.toLowerCase().includes(searchTerm);

    if (catMatch && searchMatch) {
      card.classList.remove('hidden');
      gsap.fromTo(card, { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    } else {
      gsap.to(card, { opacity: 0, scale: 0.92, y: 20, duration: 0.25, onComplete: () => card.classList.add('hidden') });
    }
  });
}

/* ===== MODAL ===== */
function openModal(id) {
  const project = DATA.projects.find(p => p.id === id);
  if (!project) return;

  document.getElementById('modal-cat').textContent = project.category;
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-desc').textContent = project.description;
  document.getElementById('modal-tools').innerHTML = project.tools.map(t =>
    `<span class="project-tool" style="padding:0.3rem 0.8rem;font-size:0.75rem;">${t}</span>`
  ).join('');
  document.getElementById('modal-highlights').innerHTML = project.highlights.map(h =>
    `<li style="color:var(--text-dim);font-size:0.9rem;padding-left:1rem;position:relative;">
      <span style="position:absolute;left:0;color:var(--neon);">▸</span>${h}
    </li>`
  ).join('');

  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay') && !e.target.classList.contains('modal-close')) return;
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ===== CERTIFICATIONS RENDER ===== */
function renderCertifications() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;
  grid.innerHTML = DATA.certifications.map(c => `
    <div class="cert-card">
      <div class="cert-icon">🏆</div>
      <div class="cert-info">
        <div class="cert-level ${c.level === 'Professional' ? 'pro' : c.level === 'Specialist' ? 'spec' : 'assoc'}">${c.level}</div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-issuer">${c.issuer}</div>
      </div>
    </div>
  `).join('');
}

/* ===== CONTACT RENDER ===== */
function renderContact() {
  const m = DATA.meta;
  const contactItems = document.getElementById('contact-items');
  if (!contactItems) return;
  const items = [
    { icon: '📧', label: 'Email', value: m.email },
    { icon: '📱', label: 'Phone', value: m.phone },
    { icon: '📍', label: 'Location', value: m.location },
  ];
  contactItems.innerHTML = items.map(i => `
    <div class="contact-item">
      <div class="contact-item-icon">${i.icon}</div>
      <div>
        <div class="contact-item-label">${i.label}</div>
        <div class="contact-item-value">${i.value}</div>
      </div>
    </div>
  `).join('');
}

/* ===== FORM SUBMIT ===== */
function submitForm() {
  const name = document.getElementById('form-name').value;
  const email = document.getElementById('form-email').value;
  const msg = document.getElementById('form-msg').value;
  if (!name || !email || !msg) { showToast('Please fill all fields.'); return; }
  showToast('Message sent! I\'ll get back to you soon.');
  document.getElementById('form-name').value = '';
  document.getElementById('form-email').value = '';
  document.getElementById('form-msg').value = '';
}

/* ===== TOAST ===== */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ===== SCROLL ANIMATIONS ===== */
function initAnimations() {
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 60%',
    onEnter: () => {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        const level = bar.dataset.level;
        gsap.to(bar, { width: level + '%', duration: 1.4, ease: 'power3.out', delay: 0.2 });
      });
    }
  });

  ScrollTrigger.create({
    trigger: '#projects-grid',
    start: 'top 85%',
    onEnter: () => {
      gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.1 });
      });
    }
  });

  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
      delay: i * 0.15
    });
  });

  ScrollTrigger.create({
    trigger: '#certs-grid',
    start: 'top 85%',
    onEnter: () => {
      gsap.utils.toArray('.cert-card').forEach((card, i) => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: i * 0.07 });
      });
    }
  });
}

/* ===== START ===== */
loadData();
