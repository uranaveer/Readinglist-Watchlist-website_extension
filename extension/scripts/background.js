
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_TOKEN") {
    chrome.storage.sync.set({
      authToken: message.token,
      userId: message.userId,
      refreshToken: message.refreshToken,
    }, () => {
      console.log(" Token stored in chrome.storage");
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LOGOUT") {
    chrome.storage.sync.remove(["authToken", "refreshToken", "userId"], () => {
        console.warn("Tokens cleared from storage");
    });
  }
});

function refreshAccessToken() {
  chrome.storage.sync.get(["refreshToken"], ({ refreshToken }) => {
    if (!refreshToken) {
      console.warn("❌ No refresh token available.");
      return;
    }

    fetch("https://api.uranaveer.xyz/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refresh: refreshToken })
    })
    .then(res => {
      if (!res.ok){
        chrome.storage.sync.remove(["authToken", "refreshToken", "userId"], () => {
            console.warn("Tokens cleared from storage");
        });
        throw new Error("Failed to refresh token");
      }
      return res.json();
    })
    .then(data => {
      if (data.access) {
        chrome.storage.sync.set({ authToken: data.access }, () => {
          console.log(" Access token refreshed successfully.");
        });
      } else {
        console.error("❌ Invalid refresh response:", data);
      }
    })
    .catch(err => {
      console.error("❌ Error during token refresh:", err);
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "Refresh Token") {
    refreshAccessToken();
  }
});



