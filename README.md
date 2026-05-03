# VELOURA — Responsive E-Commerce Website
**Retro Cinematic Indian Fashion Store**

A fully responsive, performance-optimised e-commerce frontend built with vanilla HTML, CSS, and JavaScript. All prices in Indian Rupees (₹).

---

## Project Structure

```
veloura/
├── index.html          # Homepage + product grid
├── product.html        # Product detail page
├── cart.html           # Shopping cart
├── login.html          # Login & signup
├── styles/
│   └── main.css        # All styles (CSS variables, responsive)
├── scripts/
│   ├── app.js          # Homepage logic, cart utilities, search
│   ├── product.js      # Product detail, zoom, add-to-cart
│   ├── cart.js         # Cart CRUD, totals
│   └── auth.js         # Login/signup (mock + Firebase ready)
└── README.md
```

---

## Features Completed

| Step | Feature | Status |
|------|---------|--------|
| 1 | Project setup & environment | ✅ |
| 2 | Homepage layout (navbar, hero) | ✅ |
| 3 | Dynamic product grid + API fetch | ✅ |
| 4 | Product detail page + zoom + size/qty | ✅ |
| 5 | Cart (add/remove/quantity) + localStorage | ✅ |
| 6.1 | Login & signup forms with validation | ✅ |
| 6.2 | Authentication (mock + Firebase ready) | ✅ |
| 7.1 | Lazy loading images, width/height attrs | ✅ |
| 7.2 | Async fonts, deferred JS, preconnect | ✅ |
| 8 | Deployment-ready (see below) | ✅ |

---

## Firebase Authentication Setup (Step 6.2)

To switch from mock auth to real Firebase auth:

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Go to **Authentication → Sign-in method → Email/Password → Enable**
4. Go to **Project Settings → Your apps → Web → Add app**
5. Copy your config object
6. Open `scripts/auth.js` and paste your config in `firebaseConfig`
7. Change `AUTH_MODE = 'mock'` to `AUTH_MODE = 'firebase'`
8. In `login.html`, uncomment the two Firebase CDN script tags

---

## Performance Optimisations (Step 7)

### Images (Step 7.1)
- `loading="lazy"` on all below-fold images
- `width` and `height` attributes to prevent layout shift (CLS)
- `object-fit: contain` prevents distortion
- Hover zoom via CSS `transform` (no new network requests)

### Website Speed (Step 7.2)
- `<link rel="preconnect">` for Google Fonts and API
- Fonts loaded with `media="print" onload="this.media='all'"` trick (render-non-blocking)
- Font Awesome loaded async
- All scripts use `defer` attribute
- CSS variables for consistent theming (no runtime style recalculation)
- Minimal external dependencies (zero npm packages at runtime)

**Before optimising:** Check with [PageSpeed Insights](https://pagespeed.web.dev)  
**After optimising:** Re-run to verify improvements

---

## Deployment (Step 8)

### Option 1: GitHub Pages (Free)
```bash
# Push your code to GitHub
git init
git add .
git commit -m "Initial commit — Veloura e-commerce"
git remote add origin https://github.com/YOUR_USERNAME/veloura-ecommerce.git
git push -u origin main

# In GitHub → Settings → Pages → Branch: main → Save
# Your site: https://YOUR_USERNAME.github.io/veloura-ecommerce/
```

### Option 2: Netlify (Recommended — Free + Custom Domain)
```bash
# Option A: Drag & drop
# Go to app.netlify.com → drag your project folder

# Option B: CLI
npm install -g netlify-cli
netlify deploy --prod --dir .
```

### Option 3: Vercel
```bash
npm install -g vercel
vercel --prod
```

---

## Running Locally

No build step needed — just open in browser:

```bash
# Using VS Code Live Server (recommended)
# Right-click index.html → Open with Live Server

# Or using Python
python3 -m http.server 3000
# Open: http://localhost:3000

# Or using Node
npx serve .
```

---

## Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JS** — No frameworks, pure DOM manipulation
- **LocalStorage** — Cart persistence + mock auth sessions
- **FakeStore API** — Product data ([fakestoreapi.com](https://fakestoreapi.com))
- **Firebase Auth** — Optional real authentication

---

## Design System

| Token | Value |
|-------|-------|
| `--ivory` | `#F5F0E8` — Background |
| `--charcoal` | `#1C1C1E` — Navbar, text |
| `--gold` | `#B8860B` — Accent, prices |
| Font Display | Cormorant Garamond (serif) |
| Font Body | DM Sans (sans-serif) |

---

*Made with 🙏 in India — Prices displayed in ₹ INR*
