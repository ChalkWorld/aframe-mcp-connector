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
// Deliberately NOT persisted to chrome.storage — closing and reopening the panel resets
// these dots. The payload text and the toggle preference ARE persisted (below); this is
// the one known, deliberate gap in this pass. Flag to Andrew if this needs to change.
var tabStatus = {};
TAB_ORDER.forEach(function(t) { tabStatus[t] = 'unvisited'; });

var currentDetectedTab = null;
var currentTabId = null;

var payloadEl = document.getElementById('payload');
var toggleEl = document.getElementById('autoFillToggle');
var fillBtn = document.getElementById('fillBtn');
var currentStatusEl = document.getElementById('currentStatus');
var tabListEl = document.getElementById('tabList');

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
  fillBtn.style.display = toggleEl.checked ? 'none' : 'block';
}

// ---------- Rendering ----------

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

// ---------- Fill logic ----------

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
// Covers the case where the panel opens on a Matrix page that already finished
// loading before the panel existed — that page's TAB_DETECTED announcement fired
// with no listener registered yet to catch it.

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  if (!tabs[0]) { return; }
  currentTabId = tabs[0].id;
  chrome.tabs.sendMessage(currentTabId, { type: 'GET_STATUS' }, function(response) {
    if (chrome.runtime.lastError) { return; } // not a Matrix tab — stay in initial state
    if (response && response.tab) { setCurrentStatus(response.tab); }
  });
});

renderTabList();
