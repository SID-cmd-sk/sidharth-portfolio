/* ============================================================
   ADMIN PANEL JS — Sidharth Portfolio
   ============================================================ */

let DATA = {};

async function loadData() {
  try {
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
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderProjectsTable();
  renderSkillsList();
  renderExpList();
  renderCertsList();
  renderMetaForm();
  refreshJSON();
  renderAnalytics();
}

/* ===== PANEL NAVIGATION ===== */
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  event.currentTarget && event.currentTarget.classList.add('active');
  // Manual fallback
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick') && n.getAttribute('onclick').includes(name)) n.classList.add('active');
  });
}

/* ===== DASHBOARD ===== */
function renderDashboard() {
  const statsRow = document.getElementById('stats-row');
  const stats = [
    { num: DATA.projects?.length || 0, label: 'Projects' },
    { num: DATA.certifications?.length || 0, label: 'Certifications' },
    { num: DATA.skills?.length || 0, label: 'Skills' },
    { num: DATA.experience?.length || 0, label: 'Experiences' },
  ];
  statsRow.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-card-num">${s.num}</div>
      <div class="stat-card-label">${s.label}</div>
    </div>
  `).join('');

  const recent = document.getElementById('recent-projects-list');
  recent.innerHTML = (DATA.projects || []).slice(0, 3).map(p => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.8rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
      <div>
        <div style="color:var(--text);font-size:0.9rem;font-weight:500;">${p.title}</div>
        <div style="font-size:0.75rem;color:var(--text-dim);">${p.category} · ${p.tools.join(', ')}</div>
      </div>
      ${p.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
    </div>
  `).join('');
}

/* ===== PROJECTS ===== */
function renderProjectsTable() {
  const tbody = document.getElementById('projects-table');
  tbody.innerHTML = (DATA.projects || []).map((p, i) => `
    <tr>
      <td>${p.title}</td>
      <td><span class="badge badge-cat">${p.category}</span></td>
      <td style="font-size:0.75rem;">${p.tools.join(', ')}</td>
      <td>${p.featured ? '<span class="badge badge-featured">Yes</span>' : '<span style="color:var(--text-dim);font-size:0.75rem;">No</span>'}</td>
      <td>
        <div style="display:flex;gap:0.4rem;">
          <button class="btn btn-ghost btn-sm" onclick="editProject(${i})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteItem('projects', ${i})">Del</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function addProject() {
  const title = document.getElementById('proj-title').value.trim();
  const desc = document.getElementById('proj-desc').value.trim();
  if (!title || !desc) { showToast('Title and description are required.'); return; }

  const project = {
    id: 'p' + Date.now(),
    title,
    category: document.getElementById('proj-cat').value,
    tools: document.getElementById('proj-tools').value.split(',').map(t => t.trim()).filter(Boolean),
    description: desc,
    highlights: document.getElementById('proj-highlights').value.split('\n').map(h => h.trim()).filter(Boolean),
    image: '',
    featured: document.getElementById('proj-featured').value === 'true',
  };

  DATA.projects = DATA.projects || [];
  DATA.projects.push(project);
  saveToStorage();
  renderProjectsTable();
  renderDashboard();
  clearProjectForm();
  showToast('Project added!');
}

function clearProjectForm() {
  ['proj-title','proj-desc','proj-tools','proj-highlights'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('proj-cat').value = 'CAD';
  document.getElementById('proj-featured').value = 'false';
}

function editProject(i) {
  const p = DATA.projects[i];
  document.getElementById('proj-title').value = p.title;
  document.getElementById('proj-desc').value = p.description;
  document.getElementById('proj-tools').value = p.tools.join(', ');
  document.getElementById('proj-highlights').value = p.highlights.join('\n');
  document.getElementById('proj-cat').value = p.category;
  document.getElementById('proj-featured').value = p.featured ? 'true' : 'false';
  showPanel('projects');
  DATA.projects.splice(i, 1);
  renderProjectsTable();
  showToast('Project loaded for editing. Modify and click Add.');
}

/* ===== SKILLS ===== */
function renderSkillsList() {
  const list = document.getElementById('skills-list');
  list.innerHTML = (DATA.skills || []).map((s, i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.7rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
      <div>
        <span style="color:var(--text);font-size:0.9rem;">${s.name}</span>
        <span style="margin-left:0.8rem;font-family:var(--font-mono);font-size:0.7rem;color:var(--neon);">${s.level}%</span>
        <span class="badge badge-cat" style="margin-left:0.5rem;">${s.category}</span>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteItem('skills', ${i})">Remove</button>
    </div>
  `).join('');
}

function addSkill() {
  const name = document.getElementById('skill-name').value.trim();
  const level = parseInt(document.getElementById('skill-level').value);
  if (!name || isNaN(level)) { showToast('Name and level required.'); return; }

  DATA.skills = DATA.skills || [];
  DATA.skills.push({ name, level: Math.min(100, Math.max(0, level)), category: document.getElementById('skill-cat').value });
  saveToStorage();
  renderSkillsList();
  document.getElementById('skill-name').value = '';
  document.getElementById('skill-level').value = '';
  showToast('Skill added!');
}

/* ===== EXPERIENCE ===== */
function renderExpList() {
  const list = document.getElementById('exp-list');
  list.innerHTML = (DATA.experience || []).map((e, i) => `
    <div style="padding:1rem;border:1px solid var(--border);border-radius:8px;margin-bottom:0.8rem;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="color:var(--text-bright);font-size:0.9rem;font-weight:600;">${e.role}</div>
          <div style="color:var(--neon2);font-size:0.8rem;">${e.company}</div>
          <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-top:0.2rem;">${e.period}</div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('experience', ${i})">Remove</button>
      </div>
    </div>
  `).join('');
}

function addExperience() {
  const company = document.getElementById('exp-company').value.trim();
  const role = document.getElementById('exp-role').value.trim();
  if (!company || !role) { showToast('Company and role required.'); return; }

  DATA.experience = DATA.experience || [];
  DATA.experience.unshift({
    id: 'exp' + Date.now(),
    company, role,
    period: document.getElementById('exp-period').value,
    type: document.getElementById('exp-type').value,
    description: document.getElementById('exp-desc').value,
    highlights: document.getElementById('exp-highlights').value.split('\n').map(h => h.trim()).filter(Boolean),
  });
  saveToStorage();
  renderExpList();
  renderDashboard();
  ['exp-company','exp-role','exp-period','exp-desc','exp-highlights'].forEach(id => document.getElementById(id).value = '');
  showToast('Experience added!');
}

/* ===== CERTIFICATIONS ===== */
function renderCertsList() {
  const list = document.getElementById('certs-list');
  list.innerHTML = (DATA.certifications || []).map((c, i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.7rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
      <div>
        <div style="color:var(--text);font-size:0.85rem;">${c.name}</div>
        <div style="color:var(--text-dim);font-size:0.75rem;">${c.issuer} · <span style="color:var(--neon);">${c.level}</span></div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteItem('certifications', ${i})">Remove</button>
    </div>
  `).join('');
}

function addCert() {
  const name = document.getElementById('cert-name').value.trim();
  const issuer = document.getElementById('cert-issuer').value.trim();
  if (!name) { showToast('Certification name required.'); return; }

  DATA.certifications = DATA.certifications || [];
  DATA.certifications.push({ id: 'c' + Date.now(), name, issuer, level: document.getElementById('cert-level').value });
  saveToStorage();
  renderCertsList();
  renderDashboard();
  document.getElementById('cert-name').value = '';
  document.getElementById('cert-issuer').value = '';
  showToast('Certification added!');
}

/* ===== META FORM ===== */
function renderMetaForm() {
  const m = DATA.meta || {};
  const fields = {
    'meta-name': m.name, 'meta-title': m.title, 'meta-subtitle': m.subtitle,
    'meta-email': m.email, 'meta-phone': m.phone, 'meta-location': m.location,
    'meta-about': DATA.about, 'meta-ga': DATA.analytics?.googleAnalyticsId,
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  });

  const gaEl = document.getElementById('ga-id-display');
  if (gaEl) gaEl.value = DATA.analytics?.googleAnalyticsId || 'Not set';
}

function saveMeta() {
  DATA.meta = DATA.meta || {};
  DATA.meta.name = document.getElementById('meta-name').value;
  DATA.meta.title = document.getElementById('meta-title').value;
  DATA.meta.subtitle = document.getElementById('meta-subtitle').value;
  DATA.meta.email = document.getElementById('meta-email').value;
  DATA.meta.phone = document.getElementById('meta-phone').value;
  DATA.meta.location = document.getElementById('meta-location').value;
  DATA.about = document.getElementById('meta-about').value;
  DATA.analytics = DATA.analytics || {};
  DATA.analytics.googleAnalyticsId = document.getElementById('meta-ga').value;
  saveToStorage();
  showToast('Profile saved!');
}

/* ===== JSON EDITOR ===== */
function refreshJSON() {
  document.getElementById('json-editor').value = JSON.stringify(DATA, null, 2);
}

function applyJSON() {
  try {
    const parsed = JSON.parse(document.getElementById('json-editor').value);
    DATA = parsed;
    saveToStorage();
    renderAll();
    showToast('JSON applied successfully!');
  } catch (e) {
    showToast('Invalid JSON: ' + e.message);
  }
}

/* ===== ANALYTICS ===== */
function renderAnalytics() {
  const stats = document.getElementById('analytics-stats');
  const visits = parseInt(localStorage.getItem('pf_visits') || '0') + 1;
  localStorage.setItem('pf_visits', visits);
  stats.innerHTML = [
    { num: visits, label: 'Total Page Loads' },
    { num: DATA.projects?.filter(p => p.featured)?.length || 0, label: 'Featured Projects' },
    { num: DATA.certifications?.length || 0, label: 'Certifications Listed' },
  ].map(s => `
    <div class="stat-card">
      <div class="stat-card-num">${s.num}</div>
      <div class="stat-card-label">${s.label}</div>
    </div>
  `).join('');
}

/* ===== DELETE ITEM ===== */
function deleteItem(collection, index) {
  showConfirm(`Delete this ${collection.slice(0,-1)}? This cannot be undone.`, () => {
    DATA[collection].splice(index, 1);
    saveToStorage();
    renderAll();
    showToast('Item deleted.');
  });
}

/* ===== SAVE / DOWNLOAD ===== */
function saveToStorage() {
  localStorage.setItem('portfolio_data', JSON.stringify(DATA));
  refreshJSON();
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio.json';
  a.click();
  showToast('JSON downloaded! Replace data/portfolio.json with this file.');
}

function resetData() {
  showConfirm('Reset all data to defaults? All unsaved changes will be lost.', () => {
    localStorage.removeItem('portfolio_data');
    location.reload();
  });
}

/* ===== CONFIRM MODAL ===== */
let confirmCallback = null;
function showConfirm(msg, cb) {
  document.getElementById('confirm-desc').textContent = msg;
  confirmCallback = cb;
  document.getElementById('confirm-modal').classList.add('open');
  document.getElementById('confirm-yes').onclick = () => { cb(); closeConfirm(); };
}
function closeConfirm() {
  document.getElementById('confirm-modal').classList.remove('open');
}

/* ===== TOAST ===== */
function showToast(msg) {
  const t = document.getElementById('admin-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ===== INIT ===== */
loadData();
