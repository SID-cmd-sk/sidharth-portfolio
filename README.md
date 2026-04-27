# Sidharth — CAD/CAM Engineer Portfolio

A premium, animated, futuristic engineering portfolio with admin panel and JSON data system.

## 🚀 Live Deployment via GitHub Pages

### Step 1 — Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `portfolio` (or your preferred name)
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Upload Files

**Option A: GitHub Web UI (Easiest)**
1. Open your new repo
2. Click **Add file → Upload files**
3. Drag and drop ALL portfolio files:
   - `index.html`
   - `admin.html`
   - `script.js`
   - `admin.js`
   - `data/portfolio.json`
   - `README.md`
4. Click **Commit changes**

**Option B: Git Command Line**
```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repo, go to **Settings → Pages**
2. Under **Source**: select `Deploy from a branch`
3. Branch: `main` / folder: `/ (root)`
4. Click **Save**

### Step 4 — Access Live URL

Your portfolio will be live at:
```
https://YOUR_USERNAME.github.io/portfolio/
```
(Takes ~2 minutes to deploy after saving settings)

---

## 📊 Enable Google Analytics

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a new GA4 property → Web stream
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Open `index.html` and replace **both** occurrences of `G-XXXXXXXXXX`

---

## ⚙️ Updating Content

### Via Admin Panel
1. Open `https://your-site.github.io/portfolio/admin.html`
2. Add/edit projects, skills, certifications
3. Click **Download JSON**
4. Replace `data/portfolio.json` in your repo

### Via JSON File
Edit `data/portfolio.json` directly and push to GitHub.

---

## 🗂️ File Structure

```
portfolio/
├── index.html          ← Main portfolio page
├── admin.html          ← Admin control panel
├── script.js           ← Portfolio animations & logic
├── admin.js            ← Admin panel logic
├── data/
│   └── portfolio.json  ← All content (editable)
└── README.md
```

---

## 🎨 Features

- **Futuristic dark UI** with neon glow effects
- **GSAP animations** — smooth, premium feel
- **Custom particle system** with constellation connections
- **Custom cursor** with trailing ring effect
- **Animated grid background**
- **Scroll-triggered animations** for all sections
- **Project modal** with zoom-in effect
- **Filter + search** projects by category/tool
- **Skill progress bars** with animated fill
- **Experience timeline** with step reveal
- **Admin panel** — full CRUD for all content
- **JSON download** — update data without coding
- **Google Analytics** ready (just add your ID)
- **Fully responsive** (mobile + desktop)

---

Built with: HTML5, CSS3, Vanilla JS, GSAP 3
