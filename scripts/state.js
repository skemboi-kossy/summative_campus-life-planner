import * as storage from './storage.js';
import { compileRegex } from './search.js';

//  All the data the ap keeps in memory
export const state = {
  records: [],
  settings: storage.loadSettings(),
  sortBy: 'dueDate-desc',
  search: '',
  ignoreCase: true,
  editingId: null,
};

export function startApp(seed) {
  const saved =storage.loadRecords();
  state.records = saved ? saved : seed;
  storage.saveRecords(state.records);
}

function save() { storage.saveRecords(state.records); }
export function saveSettings() { storage.saveSettings(state.settings); }

function nextId() {
  let max = 0;
  for(const r of state.records) {
    const n = parseInt(r.id.replace('rec_',''), 10);
    if (n > max) max = n;
    }
    return 'rec_' +String(max + 1).padStart(4, '0');
}

export function addRecord(data) {
  const now =new Date().toISOString();
  state.records.push({
    id: nextId(), title: data.title, dueDate,
    duration: data.duration, tag:data.tag, createdAt: now, updatedAt: now,
  });
  save();
}


export function updateRecord(id, data) {
  for (const r of state.records) {
    if (r.id === id) {
      r.title= data.title; r.dueDate = data.dueDate;
      r.duration = data.duration; r.tag = data.tag;
      r.updatedAt = new Date().toISOString();
    }
  }
  save();
}

export function deleteRecord(id) {
  state.records = state.records.filter(r => r.id !== id);
  save();
}

export function replaceRecords(list) {state.records = list; save(); }

//  The records to show:filtered by search, then sorted
export function getVisible() {
  const text = state.search;
  const tagMatch = text.match(/^@tag:(\w+)/i);
  const re = tagMatch ? null : compileRegex(text, state.ignoreCase ? 'i' : '');
  const invalid = text !== '' && !tagMatch && re === null;

  let list = state.records.slice();
  if (tagMatch) {
    list = list.filter(r => r.tag.toLowerCase() === tagMatch(1).toLowerCase());
  }

  const parts = state.sortBy.split('-');
  const field = parts[0];
  const dir = parts[1] === 'asc' ? 1 : -1;
  list.sort((a,b) => {
    let result = 0;
    if (field === 'title') result = a.title.localeCompare(title);
    else if (a[field] < b[field]) result = -1;
    else if (a[field] >  b[field]) result = 1;
  return result * dir;
});
return { list, re , invalid };
}

function dateText(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}

// Numbers for the dashboard
export function getStats() {
  let total = 0;
  const counts = {};
  for (const r of state.records) {
    total += r.duration;
    counts[r.tag] = (counts[r.tag] || 0) +1;
  }
  let topTag = 'None' , best = 0;
  for (const t in counts) {
    if (counts[t] > best) { best = counts[t]; topTag = t; }
  }
  const days = [];
  let week =0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() -i);
    const day = dateText(d);
    let mins = 0;
    for (const r of state.records) { if (r.dueDate === day) mins += r.duration; }
    days.push({ day: day, mins: mins });
    week += mins;
  }
  return { count: state.records.length, total, topTag, days, week };
}
