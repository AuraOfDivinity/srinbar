const SHEET_NAME = "Interest submissions";
const HEADERS = ["Submitted at", "Submission ID", "First name", "Last name",
  "Occupation", "Email", "Phone number", "Queries / interest in bamboo"];
const FIELD_LIMITS = {
  firstName: 100, lastName: 100, occupation: 300,
  email: 254, phone: 50, description: 5000
};

// Run once from the editor opened through your Google Sheet.
// This remembers the sheet because web app requests have no active spreadsheet.
function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Open Apps Script from your Google Sheet, then run setup.");
  PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", spreadsheet.getId());
  getOrCreateSheet_();
}

function doPost(e) {
  let lock;
  try {
    const body = e && e.postData && e.postData.contents;
    if (!body || body.length > 65536) throw new Error("Missing or oversized request body.");
    const data = JSON.parse(body);
    if (!data || typeof data !== "object") throw new Error("Invalid request.");
    const fields = data.fields;
    const submissionId = data.submissionId;
    if (data.version !== 2 || data.action !== "submitInterest") throw new Error("Invalid submission type.");
    if (typeof submissionId !== "string" || !/^[a-zA-Z0-9-]{16,80}$/.test(submissionId)) {
      throw new Error("Missing or invalid submission ID.");
    }
    if (!fields || typeof fields !== "object") throw new Error("Missing form fields.");

    const values = Object.keys(FIELD_LIMITS).map(function (key) {
      if (typeof fields[key] !== "string" || (key !== "phone" && !fields[key].trim())) {
        throw new Error("Missing required field: " + key);
      }
      const value = fields[key].trim();
      if (value.length > FIELD_LIMITS[key]) throw new Error("Field too long: " + key);
      return value;
    });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[3])) throw new Error("Invalid email address.");
    const digits = values[4].replace(/\D/g, "").length;
    if (values[4] && (!/^[+\d\s().-]+$/.test(values[4]) || digits < 7 || digits > 15)) throw new Error("Invalid phone number.");

    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) throw new Error("Busy. Please try again.");
    const sheet = getOrCreateSheet_();
    const lastRow = sheet.getLastRow();
    // The website reuses the ID on retry; only save each submission once.
    const duplicate = lastRow > 1 && sheet.getRange(2, 2, lastRow - 1, 1)
      .createTextFinder(submissionId).matchEntireCell(true).useRegularExpression(false).findNext();
    if (!duplicate) {
      sheet.appendRow([new Date(), submissionId].concat(values.map(function (value) {
        // Store input as text, preserving phone zeroes and avoiding formulas.
        return value ? "'" + value : "";
      })));
      SpreadsheetApp.flush();
    }
    return jsonResponse_({ success: true, submissionId: submissionId, message: "Interest submitted successfully." });
  } catch (error) {
    // Only return known validation/configuration messages, not Google's internal errors.
    const message = error && typeof error.message === "string" ? error.message : "";
    const known = /^(Missing|Invalid|Field too long:|Busy\.|Run setup|Unexpected sheet headers)/.test(message);
    return jsonResponse_({ success: false, error: known ? message : "Unable to save submission. Check sheet access and deployment permissions." });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function getOrCreateSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("Run setup from the Apps Script editor first.");
  const spreadsheet = SpreadsheetApp.openById(id);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else {
    const headers = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (HEADERS.some(function (heading, i) { return headers[i] !== heading; })) {
      throw new Error("Unexpected sheet headers. Restore the original columns or change SHEET_NAME.");
    }
  }
  return sheet;
}

function doGet() {
  return jsonResponse_({ service: "SRINBAR interest form", message: "Submit through the SRINBAR website." });
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
