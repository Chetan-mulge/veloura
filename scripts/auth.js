// ==============================
// SIMPLE AUTH (FINAL CLEAN)
// ==============================

// SWITCH LOGIN / SIGNUP FORM
window.switchForm = function(type) {
  document.getElementById("login-form").classList.toggle("hidden", type !== "login");
  document.getElementById("signup-form").classList.toggle("hidden", type !== "signup");
};

// ==============================
// SESSION HANDLING
// ==============================

function setSession(user) {
  localStorage.setItem("veloura_session", JSON.stringify({
    name: user.name,
    email: user.email,
    loggedIn: true
  }));
}

function getSession() {
  return JSON.parse(localStorage.getItem("veloura_session"));
}

function getUser() {
  return JSON.parse(localStorage.getItem("veloura_user"));
}

// ==============================
// SIGNUP
// ==============================

window.handleSignup = function(e) {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-pass").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (password !== confirm) {
    alert("Passwords do not match ❌");
    return;
  }

  const user = { name, email, password };

  localStorage.setItem("veloura_user", JSON.stringify(user));

  alert("Account created successfully ");
  switchForm("login");
};

// ==============================
// LOGIN
// ==============================

window.handleLogin = function(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = getUser();

  if (!user) {
    alert("No account found. Please sign up.");
    return;
  }

  if (email === user.email && password === user.password) {
    setSession(user);

    alert("Login successful ");
    window.location.href = "index.html";
  } else {
    alert("Wrong email or password ");
  }
};

// ==============================
// LOGOUT
// ==============================

window.handleLogout = function() {
  localStorage.removeItem("veloura_session");
  window.location.href = "login.html";
};

// ==============================
// AUTO REDIRECT (OPTIONAL)
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();

  // If already logged in → prevent opening login page again
  if (session && window.location.pathname.includes("login.html")) {
    window.location.href = "index.html";
  }
});