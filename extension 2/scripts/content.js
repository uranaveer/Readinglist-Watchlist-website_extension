

function getArticleText() {
  const article = document.querySelector("article");
  if (article) return article.innerText;

  const paragraphs = Array.from(document.querySelectorAll("p"));
  return paragraphs.map((p) => p.innerText).join("\n");
}

function handleArticlePage(token) {
  const videoUrl = window.location.href;
  const articleText = getArticleText();
  const title = document.querySelector('title')?.innerText?.trim();
  console.log("Article Text:", articleText);

  const payload = {
    link: videoUrl,
    title: title,
    description: articleText
  };

  fetch("https://api.uranaveer.xyz/api/add-post/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
    .then((res) => {
      if (res.status === 401) {
        console.warn("🔒 Token expired — requesting refresh");
        chrome.runtime.sendMessage({ type: "Refresh Token" });
        throw new Error("Access token expired");
      }
      if (!res.ok) throw new Error("Failed to save");
      
      return res.json();
    })
    .then((data) => {
      console.log(" Data saved successfully:", data);
    })
    .catch((err) => {
      console.error(" Error saving data:", err);
    });

}

function handleYouTubePage(token) {
  const title = document.querySelector('div#title h1 > yt-formatted-string')?.innerText?.trim();
  const description = document.querySelector('ytd-text-inline-expander')?.textContent?.trim();
  const videoUrl = window.location.href;

  console.log("YouTube Video Title:", title);
  console.log("URL:", videoUrl);
  console.log("Description:", description);

  const payload = {
    link: videoUrl,
    title: title,
    description: description
  };

  fetch("https://api.uranaveer.xyz/api/add-post/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
    .then((res) => {
      if (res.status === 401) {
        console.warn("🔒 Token expired — requesting refresh");
        chrome.runtime.sendMessage({ type: "Refresh Token" });
        throw new Error("Access token expired");
      }

      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    })
    .then((data) => {
      console.log("Data saved successfully:", data);
    })
    .catch((err) => {
      console.error("Error saving data:", err);
    });

}

function setupPageWatcher(token) {
  let lastUrl ="aaa";

  function handlePageChange() {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;

      chrome.storage.sync.get("authToken", (data) => {
        token= data.authToken;
        if (!token) {
          console.warn("User not logged in ");
          return;
        }
        chrome.storage.sync.get("incognito", (data) => {
          if (data.incognito) {
            console.log("Incognito mode is ON — skipping content analysis.");
            return;
          }

          if (currentUrl.includes("youtube.com/watch")) {
            setTimeout(() => {
              handleYouTubePage(token);
            }, 5000);

          } else {
            handleArticlePage(token);
          }
          
        });

      });
    }
  }

  const pushState = history.pushState;
  history.pushState = function (...args) {
    pushState.apply(this, args);
    setTimeout(handlePageChange, 0);
  };

  const replaceState = history.replaceState;
  history.replaceState = function (...args) {
    replaceState.apply(this, args);
    setTimeout(handlePageChange, 0);
  };

  window.addEventListener("popstate", handlePageChange);

  setInterval(() => {
    if (location.href !== lastUrl) {
      handlePageChange();
    }
  }, 1000);

  handlePageChange();
}


chrome.storage.sync.get("authToken", (data) => {
  let token = data.authToken;

  if (!token) {
    console.warn("User not logged in ");
    return;
  }
  console.log("User is logged in. Token:", token);


// Check incognito mode and run watcher only if off
chrome.storage.sync.get("incognito", (data) => {
  if (data.incognito) {
    console.log("Incognito mode is ON — skipping content analysis.");
    return;
  }

  setupPageWatcher(token);
});


});
