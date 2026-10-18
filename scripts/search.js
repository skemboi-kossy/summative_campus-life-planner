export const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Safe regex compiler: returns null for empty or invalid patterns
export function compileRegex(input, flags = 'i') {
  try { return input ? new RegExp(input, flags) : null; } catch { return null; }
}

// Escapes text first, then wraps matches in <mark> (safe against HTML injection)
export function highlight(text, re) {
  text = String(text);
  if (!re) return esc(text);
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  let out = '', last = 0, m;
  while ((m = g.exec(text))) {
    if (m[0] === '') { g.lastIndex++; continue; }
    out += esc(text.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>';
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}
