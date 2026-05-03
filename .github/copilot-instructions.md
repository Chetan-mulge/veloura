# Veloura E-Commerce Codebase Guide

## ⚠️ Critical DO NOT Break Rules

**These constraints must be preserved in all changes:**
- **Do NOT change cart structure** (`localStorage.cart` format)
- **Do NOT modify `uniqueId` format** (must stay `${productId}-${size}`)
- **Do NOT remove Razorpay handler logic** (payment flow is critical)
- **Do NOT rename element IDs used in JS** (e.g., `#cart-count`, `#product-grid`, `#checkout-form`)
- **Do NOT change API endpoints** without updating both frontend fetch URLs and backend routes

---

## Architecture Overview

**Veloura** is a vanilla JS e-commerce frontend for Indian fashion with a Node/Mongoose backend. No frameworks—all vanilla HTML/CSS/JavaScript with localStorage persistence.

- **Frontend**: Static HTML pages + modular scripts (app.js, product.js, cart.js, auth.js, checkout.js)
- **Backend**: Express + MongoDB for order storage + Razorpay payment verification
- **Data Flow**: FakeStore API → Products grid → Product detail → Cart (localStorage) → Checkout → Razorpay → Backend order save

## Critical Patterns

### 1. **Cart State Management** (localStorage-based)
- Cart stored as JSON array in `localStorage.cart`
- Each item has: `{id, uniqueId, title, price, image, quantity, size}`
- `uniqueId = ${productId}-${size}` ensures same product in different sizes are separate
- Cart badge updated via `updateCartCount()` (called after every cart operation)

```javascript
// Always use this pattern to read/update cart:
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// Check for existing item by uniqueId before pushing
const existing = cart.find(i => i.uniqueId === uniqueId);
if (existing) existing.quantity += newQty;
else cart.push({...item});
localStorage.setItem('cart', JSON.stringify(cart));
updateCartCount();
```

### 2. **Global Window Functions**
All cross-page functions exposed on `window` object:
- `createToast(message, type, duration)` - Toast notifications (success/error/default)
- `addToCart(id, title, price, image)` - Quick add from product grid (default size M)
- `addToCartWithOptions()` - Add with size selection from detail page
- `updateCartCount()` - Sync badge across all pages
- `logoutUser()` - Clear session and reload

### 3. **Authentication** (Mock localStorage-based)
- **Session**: `localStorage.veloura_session = {name, email, loggedIn: true}` (created after login)
- **User data**: `localStorage.veloura_user = {name, email, password}` (mock storage only)
- User greeting bar appears on all pages if session exists via `renderUserBar()`
- Firebase config ready in auth.js—switch `AUTH_MODE = 'mock'` to `'firebase'` to enable real auth

### 4. **Price Conversion**
- FakeStore API returns prices in USD
- **Always convert on fetch**: `price * 85` (USD→INR multiplier)
- Store converted price in product object as `_priceINR` or just use `price` after conversion
- Display with: `₹${price.toLocaleString('en-IN')}`

### 5. **URL Query Parameters**
Product detail page uses URL search params:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
// Link format: product.html?id=1
```

## Performance Optimizations Implemented

1. **Images**: `loading="lazy"` on below-fold images + `width/height` attrs to prevent CLS
2. **Fonts**: Async-loaded via `media="print" onload="this.media='all'"` trick
3. **Scripts**: All use `defer` attribute
4. **CSS Variables**: Theme system in `:root` (`--gold`, `--charcoal`, `--ivory`)
5. **No external JS frameworks** at runtime

## Backend Integration Points

### Payment Verification (`/api/verify`)
```javascript
// Called from checkout.js after Razorpay returns signature
POST /api/verify
Body: {order_id, payment_id, signature}
Returns: {success: true/false}
```

### Order Creation (`/api/order`)
```javascript
// Save order after payment verified
POST /api/order
Body: {name, address, city, state, pincode, phone, items: [], total, paymentId}
Returns: {success: true, orderId: ObjectId}
```

**Note**: Backend env variables stored in `.env` (MONGO_URI, PORT, RAZORPAY_SECRET)—these are committed to repo for dev/test (not recommended for production)

## Page-by-Page Responsibility

| Page | Purpose | Key Scripts |
|------|---------|------------|
| index.html | Homepage + grid | app.js (fetch FakeStore, render products, search) |
| product.html | Detail + options | product.js (zoom, size select, add to cart) |
| cart.html | Cart CRUD | checkout.js (renders cart from localStorage) |
| checkout.html | Shipping form | checkout.js (collects address, triggers Razorpay, saves order) |
| login.html | Auth forms | auth.js (signup/login/logout, session mgmt) |
| success.html | Order confirmed | Static page + order ID display |

## Common Dev Tasks

### Add a new product feature (e.g., color selection)
1. Add `<select>` in product.html detail section
2. Read value in `addToCartWithOptions()` 
3. Update `uniqueId` logic: `uniqueId = ${id}-${size}-${color}`
4. Pass to cart item object

### Modify cart display logic
- **Update cart item**: `cart.js` or inline in `checkout.html`
- **Update cart summary**: `checkout.js` renders from localStorage
- **Update badge**: Always call `updateCartCount()` after cart changes

### Connect real backend
- Change all `fetch()` URLs from `http://127.0.0.1:5000` to production URL
- Add auth headers if backend requires JWT (currently open)
- Update CORS policy in `backend/server.js` if deploying to different domain

### Switch to Firebase Auth
1. Create Firebase project + enable Email/Password auth
2. Paste config into `auth.js` (inside `firebaseConfig` object)
3. Change `AUTH_MODE = 'mock'` to `AUTH_MODE = 'firebase'`
4. Uncomment Firebase CDN scripts in `login.html`
5. Implement Firebase API calls in `auth.js` signup/login handlers

## Naming & Convention Deviations

- **No components**: Vanilla HTML—functions return HTML strings
- **No state management library**: Just localStorage + window functions
- **Toast instead of alert()**: Custom `createToast()` used throughout
- **Grid vs flex**: Responsive grid for products, flex for layout
- **CSS Variables**: All colors/spacing via `:root` (update there for theme changes)

## Debugging Tips

**Cart issues:**
- **Cart not updating?** Check if `updateCartCount()` was called after `localStorage.setItem()`
- **Cart empty after checkout?** Normal—localStorage cleared after successful payment
- **Total = 0?** Verify `price * quantity` calculation logic in checkout.js

**Product issues:**
- **Product not appearing?** Verify FakeStore API is reachable + prices converted to INR (USD × 85)
- **Images broken?** Check `loading="lazy"` and `width/height` attributes preserved

**Auth issues:**
- **Login not persisting?** Ensure `veloura_session` is set in localStorage (check DevTools)
- **User bar not showing?** Verify `renderUserBar()` called on page load

**Payment issues:**
- **Razorpay failing?** Verify test key in `checkout.js` + backend `/api/verify` endpoint accessible
- **Payment success but DB empty?** Check fetch URL points to correct backend (currently `http://127.0.0.1:5000`)
- **Signature verification failed?** Verify `RAZORPAY_SECRET` in `.env` matches test key

**Styles broken?** 
- Check CSS variables in `:root` + responsive breakpoints for mobile
- Verify no element IDs were accidentally renamed

## Deployment Notes

- **Frontend**: Static files only—works with GitHub Pages, Netlify, Vercel directly
- **Backend**: Requires Node.js + MongoDB connection (must be publicly accessible via MONGO_URI)
- **Environment**: Create `.env` in `backend/` with MONGO_URI, PORT, RAZORPAY_SECRET before running `npm start`
- **CORS**: Currently `origin: "*"` in backend—restrict to frontend domain before production
