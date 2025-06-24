
document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const mainUI = document.getElementById("main-ui");
  const toggle = document.getElementById("checkNativeSwitch");

  // Check if user is logged in
  chrome.storage.sync.get("authToken", (data) => {
    const token = data.authToken;

    if (token) {
      // Logged in
      loginSection.style.display = "none";
      mainUI.style.display = "block";

      // Load incognito switch state
      chrome.storage.sync.get("incognito", (data) => {
        toggle.checked = data.incognito || false;
      });

      toggle.addEventListener("change", () => {
        chrome.storage.sync.set({ incognito: toggle.checked });
      });

      let username = document.getElementById("username");
      if (username) {
        chrome.storage.sync.get("userId", (data) => {
          username.innerText = data.userId || "(Unknown User)";
        });
      }

    } else {
      // Not logged in
      mainUI.style.display = "none";
      loginSection.style.display = "block";
    }
  });
});
