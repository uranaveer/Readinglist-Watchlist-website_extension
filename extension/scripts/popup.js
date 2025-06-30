document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const mainUI = document.getElementById("main-ui");
  const toggle = document.getElementById("checkNativeSwitch");
  const usernameDisplay = document.getElementById("username");

  // Helper to show/hide sections
  const showSection = (isLoggedIn) => {
    loginSection.classList.toggle("hidden", isLoggedIn);
    mainUI.classList.toggle("hidden", !isLoggedIn);
  };

  // Check if user is logged in
  chrome.storage.sync.get(["authToken", "userId", "incognito"], (data) => {
    const { authToken, userId, incognito } = data;

    if (authToken) {
      // Logged in UI
      showSection(true);

      // Display username
      if (usernameDisplay) {
        usernameDisplay.innerText = userId || "(Unknown)";
      }

      // Load incognito switch
      toggle.checked = incognito || false;
      toggle.addEventListener("change", () => {
        chrome.storage.sync.set({ incognito: toggle.checked });
      });

    } else {
      // Not logged in UI
      showSection(false);
    }
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.authToken && changes.authToken.newValue === undefined) {
      // User logged out: update UI
      document.getElementById("login-section").classList.remove("hidden");
      document.getElementById("main-ui").classList.add("hidden");
      console.log("🧹 UI updated due to logout.");
    }
  });

});
