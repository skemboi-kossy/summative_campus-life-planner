// Regex rules (see README regex catalog)
export const RE = {
  title: /^\S(?:.*\S)?$/,                                   // no leading/trailing spaces
  number: /^(0|[1-9]\d*)(\.\d{1,2})?$/,                     // 0, 12, 12.5, 12.50
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,    // YYYY-MM-DD
  tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,                     // letters, spaces, hyphens
  dupWord: /\b(\w+)\s+\1\b/i,                               // advanced: back-reference
};

export function validTitle(v) {
  if (!RE.title.test(v)) return 'Enter a title with no leading or trailing spaces.';
  if (/\s{2,}/.test(v)) return 'Use single spaces between words.';
  if (RE.dupWord.test(v)) return 'A word is repeated (for example "the the"). Remove it.';
  return '';
}
export const validDuration = v =>
  RE.number.test(v) ? '' : 'Use a number like 90 or 1.5 (no leading zeros, up to 2 decimals).';
export function validDate(v) {
  if (!RE.date.test(v)) return 'Use the format YYYY-MM-DD.';
  const [y, m, d] = v.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getMonth() === m - 1 && dt.getDate() === d ? '' : 'That date does not exist.';
}
export const validTag = v =>
  RE.tag.test(v) ? '' : 'Use letters, spaces and hyphens only (for example Group-Work).';
