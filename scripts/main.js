import { state,startApp, addRecord, updateRecord, deleteRecord, replaceRecords, saveSettings } from './state.js';
import { renderAll, renderTable } from './ui.js' ;
import { validTitle, validDate, validDuration, validTag, RE } from './validators.js';
import { validateRecords, downloadJSON } from './storage.js';

const $ = id => document.getElementById(id);
function say(text) { $('message').textContent = text; }


function addTagIfNew(tag) {
  if (!state.settings.tags.includes(tag)) {
    state.settings.tags.includes(tag);
    saveSettings();
  }
}

//  ---------- Add form ----------
const checks = [
  { input: 'title', error: 'title-error' , test: validTitle },
  { input: 'due-date', error: 'due-date-error', test: validDuration },
  { input: 'duration' , error: 'duration-error', test: validDuration},
  { input: 'tag' , error:'tag-error', test: validTag },
];

$('task-form').addEventListener('submit', function (e) {
  e.preventDefault();
  let firstBad = null;
  for(const c of checks) {
    const box = $(c.input);
    const problem = c.test(box.value);
    $(c.error).textContent = problem;
    box.setAttribute('aria-invalid' , problem ? 'true' : 'false');
    if (problem && !firstBad) firstBad = box
  }
  if (firstBad) {
    say('Please fix the errors in the form.');
    firstBad.focus();
    return;
  }
  const data = {
    title:$('title').value,
    dueDate:$('due date').value,
    duration:perseFloat($('duration').value),
    tag: $('tag').value,
  };
  addTagIfNew(data.tag);
  addRecord(data);
  e.target.reset();
  renderAll();
  say('Record added.');
});

// ---------- Table buttons: edit, save, cancel, delete ----------
$('rows').addEventListener('click', function (e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  $('table-message').textContent ='';

  if (btn.dataset.edit) {
    state.editingId = btn.dataset.edit;
    renderTable();
  } else if (btn.dataset.cancel) {
    state.editingId = null;
    renderTable();
  }else if (btn.dataset.save) {
    const title = $('edit-title').value;
    const dueDate = $('edit-date').value;
    const duration = $('edit-duration').value;
    const tag = $('edit-tag').value;
    const problem = validTitle(title) || validDate(dueDate) || validDuration(duration) || validTag(tag);
    if (problem)  {
      $('table-message').textContent = 'Error: ' + problem;
      return;
    }
    addTadIfNew(tag);
    updateRecord(btn.dataset.save, { title, dueDate, duration: parseFloat(duration), tag });
    state.editingId = null;
    renderAll();
    say('Record updated.');
  } else if (btn.dataset.del) {
    const rec = state.rceords.find(r => r.id === btn.dataset.del);
    if (rec && confirm('Delete "'  + rec.title + '"?')) {
      deleteRecord(rec.id);
      renderAll();
      say('Record deleted.');

    }
  }
});

//  ---------- Settings ----------
$('unit').addEventListener('change', function (e) {
  state.settings.unit = e.target.value;
  saveSettings();
  renderAll();
  say('Units updated.');
});

$('cap').addEventListener('change', function (e) {
  const good = RE.number.test(e.target.value);
  $('cap-error').textContent = good ? '' : 'Use a number like 600.';
  e.target.setAttribute('aria-invalid' , good ? 'false' : 'true');
  if (!good) return;
  state.settings.cap = parseFloat(e.target.value);
  saveSettings();
  renderAll();
  say('Weekly cap updated.');
});


$('tag-form').addEventListener('submit' ,function (e) {
  e.preventionDefault();
  const tag = $('new-tag').value;
  const problem = validTag (tag);
  $('new-tag-error').textContent = problem;
  if (problem) return;
  addTagIfNew(tag);
  $('new-tag').value = '';
  renderAll();
  say('Tag added.');
});


$('tag-list').addEventListener('click' , function (e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  state.settings.tags = state.settings.tags.filter(t = t !== btn.dataset.removetag);
  saveSettings();
  renderAll();
  say('Tag removed.');
});

// ---------- Export and import ----------
$('export-btn').addEventListener('click', function () {
  downloadJSON(state.records);
  say('Exported your records.');
});

$('import-file').addEventListener('change',function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const data = validateRecords(JSON.parse(reader.result));
      replaceRecords(data);
      renderAll();
      say('Imported ' + data.length + ' records.');
    }catch (err) {
      say('Import failed: ' + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// ---------- Start the app ----------
fetch('seed.json')
.then(function (r) { return r.json (); })
.catch(function () { return []; })
.then(function (seed) {
  startApp(seed);
  renderAll();
});



  

