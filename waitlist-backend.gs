/**
 * SpaceBank Waitlist backend (Google Apps Script)
 * --------------------------------------------------
 * Bound to a Google Sheet. Handles:
 *   - doPost: appends a waitlist signup as a new row
 *   - doGet:  returns the current signup count as JSON
 *
 * Setup instructions are in SETUP-WAITLIST.md
 */

// Header row written to the sheet on first run
var HEADERS = ['Timestamp', 'Name', 'Email', 'Role', 'Destination', 'Message'];

function getSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

// Returns the number of signups (rows minus the header row).
function doGet(e) {
  var sheet = getSheet();
  var count = Math.max(0, sheet.getLastRow() - 1);
  return ContentService
    .createTextOutput(JSON.stringify({ count: count }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Adds a new signup. Uses form-encoded params to avoid CORS preflight.
function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var sheet = getSheet();
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.email || '',
      p.role || '',
      p.destination || '',
      p.message || ''
    ]);
    var count = Math.max(0, sheet.getLastRow() - 1);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, count: count }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
