const { JSDOM } = require('jsdom');

function isSafeUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function renderSafeTextWithLinks(text) {
  const dom = new JSDOM(`<!doctype html><body></body>`);
  const document = dom.window.document;
  const container = document.createElement('div');
  const urlRegex = /(https?:\/\/[\w\-._~:\/?#\[\]@!$&'()*+,;=%]+)/g;
  let lastIndex = 0;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) {
      before.split('\n').forEach((line, idx) => {
        container.appendChild(document.createTextNode(line));
        if (idx < before.split('\n').length - 1) container.appendChild(document.createElement('br'));
      });
    }
    // Trim trailing punctuation from the matched candidate (e.g., .,:;!?) and closing brackets
    let candidate = match[0];
    let suffix = '';
    while (candidate.length && /[\.\,\!\?\:\;\)\]\}]/.test(candidate[candidate.length - 1])) {
      suffix = candidate[candidate.length - 1] + suffix;
      candidate = candidate.slice(0, -1);
    }
    if (isSafeUrl(candidate)) {
      const a = document.createElement('a');
      a.href = candidate;
      a.target = '_blank';
      a.rel = 'noopener noreferrer nofollow';
      a.textContent = candidate;
      container.appendChild(a);
      if (suffix) container.appendChild(document.createTextNode(suffix));
    } else {
      container.appendChild(document.createTextNode(match[0]));
    }
    lastIndex = urlRegex.lastIndex;
  }
  const rest = text.slice(lastIndex);
  if (rest) {
    rest.split('\n').forEach((line, idx) => {
      container.appendChild(document.createTextNode(line));
      if (idx < rest.split('\n').length - 1) container.appendChild(document.createElement('br'));
    });
  }
  return container.innerHTML;
}

const tests = [
  "Check this out: https://example.com",
  "Multiple URLs http://a.test/path and https://b.test?q=1",
  "URL with trailing punctuation: https://example.com.",
  "Wrapped in parentheses (https://example.com)",
  "Javascript scheme: javascript:alert(1)",
  "Data scheme: data:text/html;base64,PHNjcmlwdD5hbGVydCgnJyk8L3NjcmlwdD4=",
  "Text with newline and url:\nVisit https://example.com/page for details",
  "URL with query and hash: https://example.com/path?x=1#frag",
  "Malformed URL: https://",
  "Edge punctuation: https://example.com,!?:;" 
];

for (const t of tests) {
  console.log('---');
  console.log('Input:', t);
  console.log('Output HTML:', renderSafeTextWithLinks(t));
}
