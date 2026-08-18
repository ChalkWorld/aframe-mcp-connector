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

function getActiveTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    callback(tabs[0]);
  });
}

function refreshStatus() {
  var statusEl = document.getElementById('status');
  getActiveTab(function(tab) {
    chrome.tabs.sendMessage(tab.id, { type: 'GET_STATUS' }, function(response) {
      if (chrome.runtime.lastError || !response || !response.tab) {
        statusEl.className = 'undetected';
        statusEl.textContent = 'No Matrix tab detected on this page.';
        return;
      }
      statusEl.className = 'detected';
      statusEl.textContent = 'Detected: ' + (TAB_LABELS[response.tab] || response.tab);
    });
  });
}

document.getElementById('fillBtn').addEventListener('click', function() {
  var resultEl = document.getElementById('result');
  var raw = document.getElementById('payload').value;
  var payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    resultEl.textContent = 'Invalid JSON: ' + e.message;
    return;
  }

  getActiveTab(function(tab) {
    chrome.tabs.sendMessage(tab.id, { type: 'FILL_PAYLOAD', payload: payload }, function(response) {
      if (chrome.runtime.lastError) {
        resultEl.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      if (!response.ok) {
        resultEl.textContent = 'Failed on ' + (response.tab || 'unknown tab') + ': ' + response.error;
        return;
      }
      var msg = 'Filled ' + (TAB_LABELS[response.tab] || response.tab) + '.';
      if (typeof response.fieldsAttempted === 'number') {
        msg += ' ' + response.fieldsAttempted + ' fields attempted';
        if (response.fieldsMissing && response.fieldsMissing.length) {
          msg += ', ' + response.fieldsMissing.length + ' not found on page: ' + response.fieldsMissing.join(', ');
        } else {
          msg += ', all found.';
        }
      }
      resultEl.textContent = msg;
    });
  });
});

refreshStatus();
