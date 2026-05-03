// =============================================
// VELOURA — product.js  (Product Detail Page)
// Step 4: Product Detail + Interactive Features
// =============================================

// ── Toast utility ──
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

// ── State ──
let currentProduct  = {};
let currentQuantity = 1;
let currentPrice    = 0;

const productContainer = document.getElementById('product-detail');
const urlParams        = new URLSearchParams(window.location.search);
const productId        = urlParams.get('id');

// ── Fetch Product ──
async function fetchProductDetails() {
  if (!productId) {
    productContainer.innerHTML = '<p style="padding:40px;color:var(--muted)">Product not found.</p>';
    return;
  }

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!res.ok) throw new Error();
    currentProduct = await res.json();
    currentProduct._priceINR = Math.floor(currentProduct.price * 85);
    renderProduct(currentProduct);
  } catch {
    productContainer.innerHTML = `
      <div style="padding:60px 5%;text-align:center;color:var(--muted)">
        <p>Could not load product details.</p>
        <a href="index.html" class="btn-primary" style="margin-top:20px;display:inline-block;">Back to Shop</a>
      </div>`;
  }
}

// ── Render Product ──
function renderProduct(product) {
  currentPrice = product._priceINR;
  document.title = `${product.title} | Veloura`;

  productContainer.innerHTML = `
    <div class="detail-image" id="zoom-container">
      <img 
        src="${product.image}" 
        alt="${product.title}" 
        id="zoom-img"
        width="500" height="500"
        loading="eager"
      >
    </div>
    <div class="detail-info">
      <p class="detail-category">${product.category}</p>
      <h1 class="detail-title">${product.title}</h1>
      <p class="detail-price">₹${currentPrice.toLocaleString('en-IN')}</p>
      <p class="detail-desc">${product.description}</p>
      
      <div class="product-options">
        <div class="option-group">
          <label>Select Size</label>
          <select id="size-select" class="custom-select">
            <option value="XS">XS — Extra Small</option>
            <option value="S">S — Small</option>
            <option value="M" selected>M — Medium</option>
            <option value="L">L — Large</option>
            <option value="XL">XL — Extra Large</option>
          </select>
        </div>

        <div class="option-group">
          <label>Quantity</label>
          <div class="quantity-selector">
            <button class="qty-btn" onclick="updateQuantity(-1)">−</button>
            <input type="text" id="qty-display" class="qty-input" value="1" readonly>
            <button class="qty-btn" onclick="updateQuantity(1)">+</button>
          </div>
          <div class="total-price-display" style="margin-top:12px;font-size:18px;font-weight:600">
            Total: ₹<span id="total-price">${currentPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <button class="add-to-cart-btn-large" onclick="addToCartWithOptions()">
        Add to Cart
      </button>
      <a href="index.html" class="back-btn">← Back to Shop</a>
    </div>
  `;

  initZoom();
}

// ── Quantity Logic ──
window.updateQuantity = function(change) {
  currentQuantity = Math.min(10, Math.max(1, currentQuantity + change));
  document.getElementById('qty-display').value = currentQuantity;
  document.getElementById('total-price').innerText =
    (currentPrice * currentQuantity).toLocaleString('en-IN');
};

// ── Zoom on Hover ──
function initZoom() {
  const container = document.getElementById('zoom-container');
  const img       = document.getElementById('zoom-img');
  if (!container || !img) return;

  container.addEventListener('mousemove', e => {
    const { left, top, width, height } = container.getBoundingClientRect();
    const xp = ((e.clientX - left) / width)  * 100;
    const yp = ((e.clientY - top)  / height) * 100;
    img.style.transformOrigin = `${xp}% ${yp}%`;
    img.style.transform = 'scale(2.2)';
  });

  container.addEventListener('mouseleave', () => {
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center center';
  });
}

// ── Add to Cart ──
window.addToCartWithOptions = function() {
  const size     = document.getElementById('size-select').value;
  const uniqueId = `${currentProduct.id}-${size}`;
  let   cart     = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(i => i.uniqueId === uniqueId);
  if (existing) {
    existing.quantity += currentQuantity;
  } else {
    cart.push({
      id:       currentProduct.id,
      uniqueId,
      title:    currentProduct.title,
      price:    currentPrice,
      image:    currentProduct.image,
      quantity: currentQuantity,
      size
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  createToast(`${currentQuantity}× ${size} — ${currentProduct.title.substring(0,28)}… added!`, 'success');
};

function updateCartCount() {
  const cart  = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = total);
}

// ── User Bar ──
function renderUserBar() {
  const session = JSON.parse(localStorage.getItem('veloura_session'));
  if (!session) return;
  const bar = document.createElement('div');
  bar.className = 'user-bar';
  bar.innerHTML = `<span>नमस्ते, ${session.name} 🙏</span><button onclick="localStorage.removeItem('veloura_session');location.reload()">Logout</button>`;
  const navbar = document.querySelector('.navbar');
  if (navbar) navbar.parentNode.insertBefore(bar, navbar);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  renderUserBar();
  fetchProductDetails();
  updateCartCount();
});
