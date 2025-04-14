async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkLogin(inputUsername, inputPassword) {
  const res = await fetch("https://loadbit.github.io/shared-auth/login.json");
  const data = await res.json();
  const inputHash = await hashPassword(inputPassword);

  return inputUsername === data.username && inputHash === data.passwordHash;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn").onclick = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const success = await checkLogin(username, password);
    if (success) {
      document.body.classList.remove("locked");
      document.getElementById("loginScreen").remove();
    } else {
      document.getElementById("loginStatus").innerText = "❌ Login failed.";
    }
  };
});
