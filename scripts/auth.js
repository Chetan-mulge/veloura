// ==============================
// SIMPLE AUTH (FINAL CLEAN)
// ==============================

// SWITCH FORMS
window.switchForm = function(type) {
  document.getElementById("login-form").classList.toggle("hidden", type !== "login");
  document.getElementById("signup-form").classList.toggle("hidden", type !== "signup");
};

// SESSION
function setSession(user) {
  localStorage.setItem("veloura_session", JSON.stringify({
    name: user.name,
    email: user.email,
    loggedIn: true
  }));
}

function getUser() {
  return JSON.parse(localStorage.getItem("veloura_user"));
}

// SIGNUP
window.handleSignup = function(e) {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const pass = document.getElementById("signup-pass").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (pass !== confirm) return alert("Passwords do not match");

  localStorage.setItem("veloura_user", JSON.stringify({ name, email, password: pass }));

  alert("Account created ✅");
  switchForm("login");
};

// LOGIN
window.handleLogin = function(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;

  const user = getUser();

  if (!user || user.email !== email || user.password !== pass) {
    return alert("Invalid credentials ❌");
  }

  setSession(user);

  alert("Login successful ✅");
  window.location.href = "index.html";
};

// LOGOUT
window.handleLogout = function() {
  localStorage.removeItem("veloura_session");
  window.location.href = "login.html";
};
