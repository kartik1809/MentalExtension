let startTime, totalTimeSpent = 0;

function extractContent() {
  let content = {};

  if (window.location.host.includes('youtube.com')) {
    content = extractYouTubeContent();
  } else if (window.location.host.includes('netflix.com') || window.location.host.includes('amazon.com')) {
    content = extractStreamingContent();
  } else if (window.location.host.includes('facebook.com') || window.location.host.includes('x.com')) {
    content = extractSocialMediaContent();
  } else {
    content = extractNewsContent();
  }

  return content;
}

function extractYouTubeContent() {
  const videoData = document.querySelector('.ytd-watch-metadata')?.innerText || 'No Data';
  const videos = document.querySelector('#video-title')?.innerText || 'No Data';
  return { videoData, videos };
}

function extractStreamingContent() {
  const titles = Array.from(document.querySelectorAll('.title-card')).map(card => card.innerText);
  return { titles };
}

function extractSocialMediaContent() {
  // Extract tweet text
  const tweetTexts = Array.from(document.querySelectorAll('h1[role="heading"], div[data-testid="inlinePrompt"] h1')).map(el => el.innerText);

  // Extract other potential relevant content
  const otherTexts = Array.from(document.querySelectorAll('div[data-testid="inlinePrompt"] div')).map(el => el.innerText);

  return { tweetTexts, otherTexts };
}

function extractNewsContent() {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText);
  const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText);
  return { headings, paragraphs };
}

window.onfocus = function() {
  startTime = new Date().getTime();
};

window.onblur = function() {
  const endTime = new Date().getTime();
  totalTimeSpent += (endTime - startTime);

  chrome.storage.local.set({
    content: extractContent(),
    timeSpent: totalTimeSpent
  });
};

window.addEventListener('beforeunload', function() {
  chrome.storage.local.set({
    content: extractContent(),
    timeSpent: totalTimeSpent
  });
});
