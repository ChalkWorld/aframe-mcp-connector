// Registers the toolbar icon to open the side panel on click. This is a
// runtime call, not a manifest field — there is no equivalent manifest.json
// key for this in current Chrome versions, confirmed against 2026 docs.
chrome.runtime.onInstalled.addListener(function() {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(function(error) {
    console.error(error);
  });
});
