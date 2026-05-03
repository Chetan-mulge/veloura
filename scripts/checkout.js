// ==============================
// VELOURA CHECKOUT (FINAL VERSION)
// ==============================

// 🔥 GET ELEMENTS
const itemsContainer = document.getElementById("checkout-items");
const totalEl = document.getElementById("checkout-total");

// ==============================
// RENDER CHECKOUT
// ==============================
function renderCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!itemsContainer || !totalEl) {
    console.error("❌ Missing HTML IDs");
    return;
  }

  itemsContainer.innerHTML = "";
  let total = 0;

  // EMPTY CART
  if (cart.length === 0) {
    itemsContainer.innerHTML = "<p style='color:#aaa;'>Your cart is empty</p>";
    totalEl.innerText = "₹0";
    return;
  }

  // LOOP ITEMS
  cart.forEach(item => {
    const div = document.createElement("div");

    div.style.background = "rgba(255,255,255,0.95)";
    div.style.padding = "12px";
    div.style.borderRadius = "10px";
    div.style.marginBottom = "12px";

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        
        <div style="display:flex;gap:12px;align-items:center;">
          <img src="${item.image}" 
               style="width:55px;height:55px;border-radius:8px;object-fit:cover;" />

          <div>
            <div style="font-weight:600;color:#000;">${item.title}</div>
            <div style="font-size:12px;color:#666;">Qty: ${item.quantity}</div>
          </div>
        </div>

        <div style="font-weight:600;color:#000;">
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </div>

      </div>
    `;

    itemsContainer.appendChild(div);
    total += item.price * item.quantity;
  });

  // TOTAL DISPLAY
  totalEl.innerHTML = `
    <span style="font-size:24px;font-weight:700;color:#b48a2c;">
      ₹${total.toLocaleString("en-IN")}
    </span>
  `;
}

// ==============================
// LOAD PAGE
// ==============================
document.addEventListener("DOMContentLoaded", renderCheckout);


// ==============================
// PAYMENT (RAZORPAY)
// ==============================
document.getElementById("checkout-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Cart is empty ❌");
    return;
  }

  let total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (typeof Razorpay === "undefined") {
    alert("Razorpay not loaded ❌");
    return;
  }

  const rzp = new Razorpay({
    key: "rzp_test_Se6hFZFpCBryEv",
    amount: total * 100,
    currency: "INR",
    name: "VELOURA",
    description: "Order Payment",

    method: {
      upi: true,
      card: true,
      netbanking: true,
      wallet: true
    },

    prefill: {
      name: "Customer",
      email: "test@veloura.com",
      contact: "9999999999"
    },

    handler: async function (res) {
      try {
        await fetch((window.BACKEND_URL || "https://veloura-backend.onrender.com") + "/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            items: cart,
            total,
            paymentId: res.razorpay_payment_id
          })
        });

        localStorage.setItem("orderId", "ORD" + Date.now());
        localStorage.removeItem("cart");

        window.location.href = "success.html";

      } catch (err) {
        console.error(err);
        alert("Server error ❌");
      }
    }
  });

  rzp.open();
});