// Lennar CVRMLS Matrix Filler — side panel script
// Phase 2: adds a Cognito entry picker (dropdown + Load button) that fetches
// recent Form 17 submissions from the Railway payload API, drops the generated
// payload into the textarea, and lets the existing fill flow take over.

var TAB_ORDER = [
  'listing_info', 'bath_info', 'features', 'general_info', 'remarks',
  'fee_info', 'owner_info', 'agent_office_info', 'showing_instructions',
  'virtual_tour_info', 'internet_display_info'
];

var TAB_LABELS = {
  listing_info: 'Listing Info',
  bath_info: 'Bath Info',
  features: 'Features',
  general_info: 'General Info',
  remarks: 'Remarks',
  fee_info: 'Fee Info',
  owner_info: 'Owner Info',
  agent_office_info: 'Agent/Office Info',
  showing_instructions: 'Showing Instructions',
  virtual_tour_info: 'Virtual Tour Info',
  internet_display_info: 'Internet Display Info'
};

// Per-tab status for this panel session only: 'unvisited' | 'pending' | 'filled' | 'error'.
// Deliberately NOT persisted — closing and reopening the panel resets these dots.
var tabStatus = {};
TAB_ORDER.forEach(function(t) { tabStatus[t] = 'unvisited'; });

var currentDetectedTab = null;
var currentTabId = null;

// Picker state (Phase 2)
var recentEntries = [];       // most-recent Form 17 submissions from /recent-entries
var lastFetchedAt = null;     // ms since epoch; null if never fetched

// DOM refs — existing
var payloadEl = document.getElementById('payload');
var toggleEl = document.getElementById('autoFillToggle');
var fillBtn = document.getElementById('fillBtn');
var currentStatusEl = document.getElementById('currentStatus');
var tabListEl = document.getElementById('tabList');

// DOM refs — picker (Phase 2)
var entrySelect = document.getElementById('entrySelect');
var loadBtn = document.getElementById('loadBtn');
var refreshBtn = document.getElementById('refreshBtn');
var pickerFooter = document.getElementById('pickerFooter');
var pickerStatus = document.getElementById('pickerStatus');
var clearBtn = document.getElementById('clearBtn');

// Config lives on window.LENNAR_PAYLOAD_CONFIG via extension/config.js.
var CONFIG = window.LENNAR_PAYLOAD_CONFIG || {};

// ---------- Persistence: payload text + toggle survive panel close/reopen ----------

chrome.storage.local.get(['matrixFillerPayload', 'matrixFillerAutoFill'], function(result) {
  if (result.matrixFillerPayload) { payloadEl.value = result.matrixFillerPayload; }
  toggleEl.checked = !!result.matrixFillerAutoFill;
  updateFillButtonVisibility();
});

payloadEl.addEventListener('input', function() {
  chrome.storage.local.set({ matrixFillerPayload: payloadEl.value });
});

toggleEl.addEventListener('change', function() {
  chrome.storage.local.set({ matrixFillerAutoFill: toggleEl.checked });
  updateFillButtonVisibility();
  // If the user flips auto-fill on while already sitting on an unfilled detected
  // tab, fill it immediately rather than waiting for the next tab switch.
  if (toggleEl.checked && currentDetectedTab && tabStatus[currentDetectedTab] !== 'filled') {
    runFill();
  }
});

function updateFillButtonVisibility() {
  // Empty string lets the button inherit its default inline-block layout as a
  // flex child of .toggle-row. 'block' would break the inline flow.
  fillBtn.style.display = toggleEl.checked ? 'none' : '';
}

// ---------- Picker: time formatting ----------

// Hybrid: relative for today, "yesterday" for yesterday, absolute date otherwise.
function formatEntryTime(iso) {
  if (!iso) { return ''; }
  var d = new Date(iso);
  if (isNaN(d.getTime())) { return ''; }
  var now = new Date();
  var sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    var diffMin = Math.round((now - d) / 60000);
    if (diffMin < 1) { return 'just now'; }
    if (diffMin < 60) { return diffMin + 'm ago'; }
    var h = Math.round(diffMin / 60);
    return h + 'h ago';
  }
  var yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) { return 'yesterday'; }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatUpdatedAgo(ms) {
  if (!ms) { return ''; }
  var diffMin = Math.round((Date.now() - ms) / 60000);
  if (diffMin < 1) { return 'Updated just now'; }
  if (diffMin < 60) { return 'Updated ' + diffMin + 'm ago'; }
  var h = Math.round(diffMin / 60);
  return 'Updated ' + h + 'h ago';
}

// ---------- Picker: Railway calls ----------

function railwayHeaders() {
  return { 'X-API-Key': CONFIG.API_SHARED_SECRET || '' };
}

function fetchRecentEntries() {
  if (!CONFIG.RAILWAY_BASE_URL) {
    setPickerError('Missing RAILWAY_BASE_URL in extension/config.js.');
    return;
  }
  setPickerLoading();
  var url = CONFIG.RAILWAY_BASE_URL + '/recent-entries';
  fetch(url, { headers: railwayHeaders() })
    .then(function(res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status); }
      return res.json();
    })
    .then(function(body) {
      if (!body || body.status !== 'ok') {
        var msg = (body && body.message) || 'Unknown error from Railway.';
        setPickerError('Failed to load entries: ' + msg);
        console.error('[picker] /recent-entries error envelope:', body);
        return;
      }
      recentEntries = Array.isArray(body.entries) ? body.entries : [];
      lastFetchedAt = Date.now();
      renderPicker();
    })
    .catch(function(err) {
      setPickerError("Can't reach Railway. Click refresh to retry.");
      console.error('[picker] /recent-entries fetch failed:', err);
    });
}

function generatePayload(entryId) {
  if (!CONFIG.RAILWAY_BASE_URL) {
    setPickerError('Missing RAILWAY_BASE_URL in extension/config.js.');
    return;
  }
  setLoadBusy(true);
  var url = CONFIG.RAILWAY_BASE_URL + '/generate';
  var headers = railwayHeaders();
  headers['Content-Type'] = 'application/json';
  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ entry_id: entryId })
  })
    .then(function(res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status); }
      return res.json();
    })
    .then(function(body) {
      if (!body || body.status !== 'ok' || !body.payload) {
        var msg = (body && body.message) || 'Unknown error from Railway.';
        setPickerError('Generation failed: ' + msg);
        console.error('[picker] /generate error envelope:', body);
        return;
      }
      // Clear-and-replace on success. Failure leaves the textarea untouched
      // so the paste fallback stays intact.
      payloadEl.value = JSON.stringify(body.payload, null, 2);
      chrome.storage.local.set({ matrixFillerPayload: payloadEl.value });
      // Nudge the existing fill flow: if auto-fill is on and a tab is already
      // detected, fill immediately.
      if (toggleEl.checked && currentDetectedTab) { runFill(); }
      // Clear any lingering picker error after a successful generate.
      clearPickerError();
    })
    .catch(function(err) {
      setPickerError("Can't reach Railway. Try refresh or paste manually.");
      console.error('[picker] /generate fetch failed:', err);
    })
    .then(function() {
      setLoadBusy(false);
    });
}

// ---------- Picker: rendering + state ----------

function setPickerLoading() {
  pickerFooter.classList.remove('error');
  entrySelect.innerHTML = '<option>Loading recent entries…</option>';
  entrySelect.disabled = true;
  loadBtn.disabled = true;
  pickerStatus.textContent = '';
}

function setPickerError(msg) {
  pickerFooter.classList.add('error');
  entrySelect.innerHTML = '<option>— no entries loaded —</option>';
  entrySelect.disabled = true;
  loadBtn.disabled = true;
  pickerStatus.textContent = msg;
}

function clearPickerError() {
  pickerFooter.classList.remove('error');
  if (recentEntries.length) {
    pickerStatus.textContent = formatUpdatedAgo(lastFetchedAt);
  }
}

function setLoadBusy(busy) {
  if (busy) {
    loadBtn.disabled = true;
    loadBtn.textContent = 'Loading…';
  } else {
    loadBtn.disabled = !recentEntries.length;
    loadBtn.textContent = 'Load';
  }
}

function renderPicker() {
  pickerFooter.classList.remove('error');
  entrySelect.innerHTML = '';
  if (!recentEntries.length) {
    var opt = document.createElement('option');
    opt.textContent = 'No recent Form 17 entries.';
    entrySelect.appendChild(opt);
    entrySelect.disabled = true;
    loadBtn.disabled = true;
    pickerStatus.textContent = formatUpdatedAgo(lastFetchedAt);
    return;
  }
  recentEntries.forEach(function(entry) {
    var opt = document.createElement('option');
    opt.value = String(entry.entry_id);
    var addr = entry.address || ('Entry #' + entry.entry_id);
    var when = formatEntryTime(entry.submitted_at);
    opt.textContent = when ? (addr + ' · ' + when) : addr;
    entrySelect.appendChild(opt);
  });
  entrySelect.disabled = false;
  loadBtn.disabled = false;
  pickerStatus.textContent = formatUpdatedAgo(lastFetchedAt);
}

// Refresh the "Updated Xm ago" label once a minute so it stays accurate.
setInterval(function() {
  if (!pickerFooter.classList.contains('error') && recentEntries.length) {
    pickerStatus.textContent = formatUpdatedAgo(lastFetchedAt);
  }
}, 60000);

// ---------- Picker: event wiring ----------

refreshBtn.addEventListener('click', function() {
  fetchRecentEntries();
});

loadBtn.addEventListener('click', function() {
  var selected = entrySelect.value;
  if (!selected) { return; }
  var entryId = parseInt(selected, 10);
  if (isNaN(entryId)) { return; }
  generatePayload(entryId);
});

clearBtn.addEventListener('click', function() {
  payloadEl.value = '';
  // Also clear the persisted value so a panel reopen does not resurrect it.
  chrome.storage.local.remove('matrixFillerPayload');
  // Reset the per-tab status dots back to all-unvisited, since Clear means
  // we're starting fresh on a new listing. The currently-detected tab goes
  // back to 'pending' to match setCurrentStatus's first-detection behavior.
  TAB_ORDER.forEach(function(t) { tabStatus[t] = 'unvisited'; });
  if (currentDetectedTab) { tabStatus[currentDetectedTab] = 'pending'; }
  renderTabList();
});

// ---------- Rendering (unchanged) ----------

function renderTabList() {
  tabListEl.innerHTML = '';
  TAB_ORDER.forEach(function(tab) {
    var row = document.createElement('div');
    row.className = 'tab-btn status-' + tabStatus[tab] + (tab === currentDetectedTab ? ' current' : '');
    row.textContent = TAB_LABELS[tab];
    tabListEl.appendChild(row);
  });
}

function setCurrentStatus(tab) {
  currentDetectedTab = tab;
  if (!tab) {
    currentStatusEl.className = 'undetected';
    currentStatusEl.textContent = 'No Matrix tab detected on this page.';
    fillBtn.disabled = true;
  } else {
    currentStatusEl.className = 'detected';
    currentStatusEl.textContent = 'Detected: ' + (TAB_LABELS[tab] || tab);
    fillBtn.disabled = false;
    if (tabStatus[tab] === 'unvisited') { tabStatus[tab] = 'pending'; }
  }
  renderTabList();
}

// ---------- Fill logic (unchanged) ----------

function parsePayloadOrNull() {
  try {
    return JSON.parse(payloadEl.value);
  } catch (e) {
    currentStatusEl.className = 'undetected';
    currentStatusEl.textContent = 'Invalid JSON: ' + e.message;
    return null;
  }
}

function runFill() {
  if (!currentDetectedTab || !currentTabId) { return; }
  var payload = parsePayloadOrNull();
  if (!payload) { return; }

  chrome.tabs.sendMessage(currentTabId, { type: 'FILL_PAYLOAD', payload: payload }, function(response) {
    if (chrome.runtime.lastError || !response || !response.ok) {
      tabStatus[currentDetectedTab] = 'error';
      currentStatusEl.className = 'undetected';
      currentStatusEl.textContent = 'Fill failed: ' +
        (chrome.runtime.lastError ? chrome.runtime.lastError.message : (response && response.error));
    } else if (response.fieldsMissing && response.fieldsMissing.length) {
      tabStatus[currentDetectedTab] = 'error';
      currentStatusEl.className = 'undetected';
      currentStatusEl.textContent = 'Filled ' + TAB_LABELS[currentDetectedTab] + ' — ' +
        response.fieldsMissing.length + ' field(s) not found: ' + response.fieldsMissing.join(', ');
    } else {
      tabStatus[currentDetectedTab] = 'filled';
      currentStatusEl.className = 'detected';
      currentStatusEl.textContent = 'Filled ' + TAB_LABELS[currentDetectedTab] + ' — all ' +
        response.fieldsAttempted + ' fields found.';
    }
    renderTabList();
  });
}

fillBtn.addEventListener('click', runFill);

// ---------- Messaging: content script announces its detected tab on every load ----------

chrome.runtime.onMessage.addListener(function(message, sender) {
  if (message.type === 'TAB_DETECTED' && sender.tab) {
    currentTabId = sender.tab.id;
    setCurrentStatus(message.tab);
    if (message.tab && toggleEl.checked) {
      runFill();
    }
  }
});

// ---------- Fallback: query the active tab directly when the panel first opens ----------

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  if (!tabs[0]) { return; }
  currentTabId = tabs[0].id;
  chrome.tabs.sendMessage(currentTabId, { type: 'GET_STATUS' }, function(response) {
    if (chrome.runtime.lastError) { return; }
    if (response && response.tab) { setCurrentStatus(response.tab); }
  });
});

renderTabList();

// Kick off the first picker fetch when the panel loads.
fetchRecentEntries();
