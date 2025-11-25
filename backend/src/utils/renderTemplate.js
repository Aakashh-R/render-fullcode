// utils/templateRenderer.js
export function safeEscapeValue(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderTemplate(body = '', values = {}) {
  if (!body) return '';
  return body.replace(/{{\s*([^}]+)\s*}}/g, (m, key) => {
    const v = values?.[key] ?? '';
    return safeEscapeValue(v);
  });
}

export function stripHtml(html = '') {
  if (!html) return '';
  // simple server-side stripper (works for small templates)
  return html
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
