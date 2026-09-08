export function isEnglish() {
  return document.documentElement.lang === 'en-US';
}

export function dataUrl(file) {
  return `${isEnglish() ? '/en' : ''}/assets/data/${file}`;
}

export function message(key, values = {}) {
  const element = document.getElementById('localized-ui');
  const messages = element ? JSON.parse(element.textContent) : {};
  if (typeof messages[key] !== 'string') throw new Error(`Missing interface message: ${key}`);
  return messages[key].replace(/\{(\w+)\}/g, (token, name) => String(values[name] ?? token));
}

export function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
