function getArticleText() {
  const article = document.querySelector("article");
  if (article) return article.innerText;

  const paragraphs = Array.from(document.querySelectorAll("p"));
  return paragraphs.map((p) => p.innerText).join("\n");
}

function handleArticlePage() {
  const articleText = getArticleText();
  console.log("Article Text:", articleText);
}

function handleYouTubePage() {
  const title = document.querySelector('div#title h1 > yt-formatted-string')?.innerText?.trim();
  const description = document.querySelector('ytd-text-inline-expander')?.textContent?.trim();
  const videoUrl = window.location.href;

  console.log("YouTube Video Title:", title);
  console.log("URL:", videoUrl);
  console.log("Description:", description);
}

function setupPageWatcher() {
  let lastUrl = location.href;

  function handlePageChange() {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
    }

    if (currentUrl.includes("youtube.com/watch")) {
      handleYouTubePage();
    } else {
      handleArticlePage();
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

// Check incognito mode and run watcher only if off
chrome.storage.sync.get("incognito", (data) => {
  if (data.incognito) {
    console.log("Incognito mode is ON — skipping content analysis.");
    return;
  }

  setupPageWatcher();
});
