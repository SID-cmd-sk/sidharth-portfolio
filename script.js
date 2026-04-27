/* ============================================================
   PORTFOLIO SCRIPT — Sidharth CAD/CAM Engineer
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

let DATA = {};

/* ===== DATA LOAD ===== */
async function loadData() {
  try {
    // Try localStorage admin overrides first
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      DATA = JSON.parse(saved);
    } else {
      const res = await fetch('data/portfolio.json');
      DATA = await res.json();
    }
  } catch (e) {
    const res = await fetch('data/portfolio.json');
    DATA = await res.json();
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
    document.getElementById('loader').classList.add('hidden');
    triggerHeroAnimation();
  }, 1600);
}

/* ===== CUSTOM CURSOR ===== */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
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
    // draw connections
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
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
  });
}

/* ===== SCROLL PROGRESS ===== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  });
}

/* ===== HERO RENDER ===== */
function renderHero() {
  const m = DATA.meta;
  document.getElementById('hero-desc').textContent = DATA.about;
}

function triggerHeroAnimation() {
  const tl = gsap.timeline();
  tl.to('#hero-badge',   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.1)
    .to('#hero-name',    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.25)
    .to('#hero-title',   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.4)
    .to('#hero-desc',    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.55)
    .to('#hero-btns',    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.65)
    .to('#hero-stats',   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.75)
    .to('#hero-visual',  { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.3);

  // Set initial states
  gsap.set(['#hero-badge','#hero-name','#hero-title','#hero-desc','#hero-btns','#hero-stats'],
    { y: 30 });
  gsap.set('#hero-visual', { x: 50 });
}

/* ===== ABOUT RENDER ===== */
function renderAbout() {
  document.getElementById('about-text').textContent = DATA.about;

  const m = DATA.meta;
  const infoData = [
    { icon: '📧', label: m.email },
    { icon: '📱', label: m.phone },
    { icon: '📍', label: m.location },
  ];

  const infoList = document.getElementById('info-list');
  infoList.innerHTML = infoData.map(i => `
    <div class="info-item">
      <div class="info-item-icon">${i.icon}</div>
      <span>${i.label}</span>
    </div>
  `).join('');

  const panel = document.getElementById('skills-panel');
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

/* ===== SKILLS RENDER ===== */
function renderSkills() {
  // Skills are rendered inline within about. Extra tag cloud if needed.
}

/* ===== TIMELINE RENDER ===== */
function renderTimeline() {
  const container = document.getElementById('timeline');
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

  // Filter logic
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  document.getElementById('search-input').addEventListener('input', filterProjects);
}

function filterProjects() {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
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
    document.getElementById('modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ===== CERTIFICATIONS RENDER ===== */
function renderCertifications() {
  const grid = document.getElementById('certs-grid');
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
  const items = [
    { icon: '📧', label: 'Email', value: m.email },
    { icon: '📱', label: 'Phone', value: m.phone },
    { icon: '📍', label: 'Location', value: m.location },
  ];
  document.getElementById('contact-items').innerHTML = items.map(i => `
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
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ===== SCROLL ANIMATIONS ===== */
function initAnimations() {
  // Reveal elements
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // Skill bars
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

  // Project cards
  ScrollTrigger.create({
    trigger: '#projects-grid',
    start: 'top 85%',
    onEnter: () => {
      gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.1 });
      });
    }
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
      delay: i * 0.15
    });
  });

  // Cert cards
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
