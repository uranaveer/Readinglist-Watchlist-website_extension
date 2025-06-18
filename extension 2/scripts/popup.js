// popup.js
const toggle = document.getElementById("checkNativeSwitch");

chrome.storage.sync.get("incognito", (data) => {
  toggle.checked = data.incognito || false;
});

toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ incognito: toggle.checked });
});
