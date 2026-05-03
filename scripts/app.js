// =============================================
// VELOURA — app.js  (Homepage + Shared Utilities)
// Step 7.2: Performance Optimised
// =============================================

// ── Toast Utility (shared across pages) ──
window.createToast = function(message, type = 'default', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icon}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// ── Elements ──
const hamburger   = document.querySelector('.hamburger');
const navLinks    = document.querySelector('.nav-links');
const productGrid = document.getElementById('product-grid');
const cartBadge   = document.getElementById('cart-count');

// ── Mobile Menu ──
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('nav-active'));
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('nav-active');
    }
  });
}

// ── Render User Bar if logged in ──
function renderUserBar() {
  const session = JSON.parse(localStorage.getItem('veloura_session'));
  if (!session) return;
  const existing = document.querySelector('.user-bar');
  if (existing) return;
  const bar = document.createElement('div');
  bar.className = 'user-bar';
  bar.innerHTML = `
    <span>नमस्ते, ${session.name} 🙏</span>
    <button onclick="logoutUser()">Logout</button>
  `;
  const header = document.querySelector('header') || document.querySelector('.navbar');
  if (header) header.parentNode.insertBefore(bar, header);
}

window.logoutUser = function() {
  localStorage.removeItem('veloura_session');
  createToast('You have been logged out.', 'default');
  setTimeout(() => window.location.reload(), 800);
};

// ── Fallback Products (Indian context) ──
const localProducts = [
  { id: 1, title: "Khadi Kurta Set",           price: 1299, image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" },
  { id: 2, title: "Oxidised Silver Necklace",  price: 849,  image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg" },
  { id: 3, title: "Gold Plated Earrings",       price: 599,  image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg" },
  { id: 4, title: "Handloom Silk Stole",        price: 2199, image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg" }
];

// ── Search Functionality ──
const searchInput = document.querySelector('.search-bar input');
const searchBtn   = document.querySelector('.search-bar button');

let allProducts = [];

function filterProducts(query) {
  if (!query.trim()) { renderProducts(allProducts); return; }
  const q = query.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q))
  );
  renderProducts(filtered);
  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div class="loading" style="color:var(--muted)">
        No products found for "<strong>${query}</strong>"
      </div>`;
  }
}

if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') filterProducts(searchInput.value);
  });
}
if (searchBtn) {
  searchBtn.addEventListener('click', () => filterProducts(searchInput?.value || ''));
}

// ── Fetch Products ──
async function fetchProducts() {
  if (!productGrid) return;

  try {
    const res = await fetch('https://fakestoreapi.com/products?limit=8');
    if (!res.ok) throw new Error('Network error');
    const products = await res.json();

    // Convert USD → INR
    allProducts = products.map(p => ({
      ...p,
      price: Math.floor(p.price * 85)
    }));
    renderProducts(allProducts);
  } catch (err) {
    console.warn('API failed. Using fallback data.', err);
    allProducts = localProducts;
    renderProducts(localProducts);
  }
}

// ── Render Products ──
function renderProducts(products) {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  products.forEach((product, index) => {
    const safeTitle = product.title.replace(/'/g, "\\'");
    const card = document.createElement('div');
    card.classList.add('product-card');
    // Staggered fade-in
    card.style.animationDelay = `${index * 60}ms`;
    card.style.animation = 'fadeUp 0.5s ease both';

    card.innerHTML = `
      <div class="card-image">
        <a href="product.html?id=${product.id}">
          <img 
            src="${product.image}" 
            alt="${product.title}"
            loading="lazy"
            width="300" height="300"
          >
        </a>
      </div>
      <div class="card-info">
        <a href="product.html?id=${product.id}">
          <h3 class="card-title">${product.title}</h3>
        </a>
        <p class="card-price">₹${product.price.toLocaleString('en-IN')}</p>
        <button 
          class="add-to-cart-btn" 
          onclick="addToCart(${product.id}, '${safeTitle}', ${product.price}, '${product.image}')"
        >
          Add to Cart
        </button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  updateCartCount();
}

// ── Add to Cart ──
window.addToCart = function(id, title, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const uniqueId = `${id}-M`;
  const existing = cart.find(i => i.uniqueId === uniqueId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, uniqueId, title, price, image, quantity: 1, size: 'M' });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  createToast(`${title.substring(0, 30)}… added to cart!`, 'success');
};

// ── Update Cart Badge ──
function updateCartCount() {
  const cart  = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = total);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  renderUserBar();
  fetchProducts();
  updateCartCount();
});
