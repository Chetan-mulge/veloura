const user = JSON.parse(localStorage.getItem("veloura_user"));

if (!userId) {
  window.location.href = "login.html";
}

async function loadCart() {
  const res = await fetch(`http://localhost:5000/cart/${userId}`);
  const data = await res.json();

  const cart = data.items || [];

  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal-price");
  const totalEl = document.getElementById("total-price");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
    subtotalEl.innerText = "₹0";
    totalEl.innerText = "₹0";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = "";

  cart.forEach(item => {
    const div = document.createElement("div");

    div.innerHTML = `
      ${item.title} (x${item.quantity}) - ₹${item.price}
    `;

    cartItemsContainer.appendChild(div);
    total += item.price * item.quantity;
  });

  subtotalEl.innerText = "₹" + total;
  totalEl.innerText = "₹" + total;
}

window.onload = loadCart;