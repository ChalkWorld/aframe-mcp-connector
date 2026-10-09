// Lennar Payload API config for the Chrome extension (Phase 2).
//
// Copy this file to extension/config.js (git-ignored) and fill in API_SHARED_SECRET
// with the value from Railway → lennar-payload-script → Variables.
//
// Loaded by sidepanel.html before sidepanel.js. Exposes CONFIG as a global on window.

window.LENNAR_PAYLOAD_CONFIG = {
  // Railway base URL for the Lennar payload API.
  RAILWAY_BASE_URL: "https://lennar-payload-script-production.up.railway.app",

  // Shared secret, must match API_SHARED_SECRET in Railway's Variables tab.
  // DO NOT commit the real value — this file is a template.
  API_SHARED_SECRET: "PASTE_SECRET_HERE"
};
