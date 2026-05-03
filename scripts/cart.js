const cartItemsContainer = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal-price');
const totalEl = document.getElementById('total-price');
const emptyEl = document.getElementById('cart-empty');
const summaryBox = document.getElementById('cart-summary-box');

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "";
    emptyEl.style.display = "block";
    summaryBox.style.display = "none";
    return;
  }

  emptyEl.style.display = "none";
  summaryBox.style.display = "block";

  let total = 0;
  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p>${item.title} (x${item.quantity}) - ₹${item.price}</p>
      <button onclick="removeItem(${index})">Remove</button>
    `;

    cartItemsContainer.appendChild(div);

    total += item.price * item.quantity;
  });

  subtotalEl.innerText = "₹" + total;
  totalEl.innerText = "₹" + total;
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

window.onload = loadCart;