window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data?.type === "SEND_TOKEN") {
    chrome.runtime.sendMessage({
      type: "STORE_TOKEN",
      token: event.data.token,
      refreshToken: event.data.refreshToken,
      userId: event.data.userId,
      email: event.data.email
    });
  }
});

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data?.type === "LOGOUT") {
    chrome.runtime.sendMessage({
      type: "LOGOUT"
    });
  }
});