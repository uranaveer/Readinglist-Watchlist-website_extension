
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
  return new Promise((resolve) => {
    chrome.storage.sync.get(["refreshToken"], ({ refreshToken }) => {
      if (!refreshToken) return resolve(null);

      fetch("https://api.uranaveer.xyz/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh: refreshToken })
      })
      .then(res => res.json())
      .then(data => {
        if (data.access) {
          chrome.storage.sync.set({ authToken: data.access }, () => {
            console.log("🔑 Token refreshed");
            resolve(data.access);
          });
        } else {
          console.error(" Invalid refresh response");
          resolve(null);
        }
      })
      .catch(err => {
        console.error(" Refresh error:", err);
        resolve(null);
      });
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "Refresh Token") {
    refreshAccessToken().then((newAccessToken) => {
      if (!newAccessToken) return;

      chrome.tabs.sendMessage(sender.tab.id, {
        type: "RetryPost",
        token: newAccessToken,
        payload: message.payload
      });
    });
  }
});



