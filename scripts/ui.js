import { state, getVisible, getStats } from './state.js';
import { highlight, esc } from './search.js';

const $ = id => document.getElementById(id);

// Durations are stored in minutes. This shows them as minutes or hours.
export function formatTime(mins) {
  if (state.settings.unit === 'hours') return (mins / 60).toFixed(2) + ' h';
  return Math.round(mins* 100) / 100 + 'min';
}


export function renderStats() {
  const s = getStats();
  const cap = state.settings.cap;
  $('summary').textContent = s.count + ' record - ' + formatTime(s.total) + 'total';
  $('stat-total').textContent = s.count;
  $('stat-duration').textContent = formatTime(s.total);
  $('stat-tag').textContent = s.topTag;
  $('stat-week').textContent = formatTime(s.week);


// Cap message: polite when under, assertive when over
const msg = $('cap-message');
if (s.week > cap) {
  msg.setAttribute('aria-live', 'assertive');
  msg.className = 'cap over';
  msg.textContent = 'Over your weekly cap by ' + formatTime(s.week - cap) + '-';
} else {
  msg.setAttribute('aria-live', 'polite');
  msg.className = 'cap';
  msg.textContent = formatTime(cap - s.week) + ' left under your weekly cap of' + formatTime(cap) + '-';
}

// Simple bar chart
let max = 1;
for (const d of s.days) { if (d.mins > max) max = d.mins; }
let bars = '', summary = '';
for (const d of s.days) {
  bars += '<div class="bar-col"><span class="bar" style="height:' + (d.mins /max) * 100 + '%"></span><span class="bar-label">' + d.day.slice(5) + '</span></div>';
  summary += d.day + ':' + d.mins + 'min';
}
$('chart').innerHTML + bars;
$('chart').setAttribute('aria-label', 'Planned time per day.' +summary);
}


function normalRow(r, re) {
  return '<tr>' + 
    '<td data-label="Title">' + highlight(r.title, re) + '</td>' +
    '<td data-label="Due date">' + highlight(r.dueDate, re) + '</td>' +
    '<td data-label="Duration">' + formatTime(r.duration) + '</td>' +
    '<td data-label="Tag">' + highlight(r.tag, re) + '</td>' +
    'td data-label="Actions">' + 
      '<button type="button" class=btn small" data-edit="' + r.id + '" aria-label=Edit ' + esc(r.title) + '">Edit</button>' +
      '<button type="button" class="btn small plain" data-del="' + r.id + '" aria-label="Delete ' + esc(r.title) + '">Delete</button>' +
    '</td></tr>';
}

// The row turns into inputs while you edit it
function editRow(r) {
  return '<tr>' + 
    '<td data-label="Title"><input id="edit-title" type="text" value="' + esc(r.title) + '" aria-label="Title"></td>' +
    '<td data-label="Due date"><input id="edit-date" type="text" value="' + r.dueDate + '" aria-label="Due date"></td>' +
    '<td data-label="Minutes"><input id="edit-duration" type="text" value="' + r.duration + '" aria-label="Duration in minutes"></td>' +
    '<td data-label="Tag"><input id="edit-tag" type="text" value="' + esc(r.tag) + '" aria-label="Tag"></td>' +
    '<td data-label="Actions">' +
      '<button type="button" class="btn small" data-save="' + r.id + '">Save</button>' +
      '<button type="button" class="btn small plain" data-cancel="1">Cancel</button>' +
    '</td></tr>';
}

export function renderTable() {
  const result = getVisible();
  let html = '';
  for (const r of result.list) {
    html += (r.id === state.editingId) ? editRow(r) : normalRow(r, result.re);
  }
  if (html === '') html = '<tr><td colspan="5">No records match your search.</td></tr>';
  $('rows').innerHTML = html;
  $('search').setAttribute('aria-invalid', String(result.invalid));
$('search-status').textContent = result.invalid 
  ? 'That pattern is not valid yet,so all records are shown.'
  :result.list.length + ' of ' + state.records.length + 'records shown.';
const box = $('edit-title');
if (box) box.focus();
}

export function renderSettings() {
  $('unit').value = state.settings.unit;
  $('cap').value = state.settings.cap;
  let list = '', options = '';
  for (const t of state.settings.tags) {
    list += '<li>' + esc(t) + ' <button type="button" class="btn small plain" data-removetag+"' + esc(t) + '" aria-label="Remove tag ' + esc(t) + '">Remove</button></li>';
    options += 'option valu="' + esc(t) + '"></option>';
  }
  $('tag-list').innerHTML = list;
  $('tag-options').innerHTML = options;
}

export function renderAll() {
  renderStats();
  renderTable();
  renderSettings();
}
