import { RE } from './validators.js';
const KEYS = { data: 'clp:data', settings: 'clp:settings' };
export const DEFAULT_SETTINGS = { unit: 'minutes', cap: 600, tags: ['Study', 'Club', 'Personal', 'Career', 'Health'] };

const read = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full or blocked */ } };

export const loadRecords = () => read(KEYS.data, null);
export const saveRecords = d => write(KEYS.data, d);
export const loadSettings = () => ({ ...DEFAULT_SETTINGS, ...read(KEYS.settings, {}) });
export const saveSettings = s => write(KEYS.settings, s);

// Throws an Error with a clear message if the imported data is invalid
export function validateRecords(data) {
  if (!Array.isArray(data)) throw new Error('The file must contain a JSON array of records.');
  const ids = new Set();
  data.forEach((r, i) => {
    const bad = msg => { throw new Error(`Record ${i + 1}: ${msg}`); };
    if (!r || typeof r !== 'object') bad('not an object.');
    if (typeof r.id !== 'string' || !r.id || ids.has(r.id)) bad('missing or duplicate id.');
    ids.add(r.id);
    if (typeof r.title !== 'string' || !RE.title.test(r.title)) bad('invalid title.');
    if (!RE.date.test(String(r.dueDate))) bad('invalid dueDate (use YYYY-MM-DD).');
    if (typeof r.duration !== 'number' || r.duration < 0) bad('invalid duration.');
    if (typeof r.tag !== 'string' || !RE.tag.test(r.tag)) bad('invalid tag.');
    if (!r.createdAt || !r.updatedAt) bad('missing timestamps.');
  });
  return data;
}

export function downloadJSON(data, name = 'campus-life-planner.json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
