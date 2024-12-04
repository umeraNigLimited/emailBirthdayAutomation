import { google } from "googleapis";
import { format } from "date-fns";
// import path from "path";
// import "fs";

const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
// const KEY_FILE_PATH = path.join(__dirname, "path/to/google.json");
const key_file = process.env.GOOGLE_AUTH;


// Load service account credentials
const auth = new google.auth.GoogleAuth({
  keyFile: key_file,
  scopes: SCOPES,
});

// Create Google Sheets API client
const sheets = google.sheets({ version: "v4", auth });
const normalizeDate = (dateStr) => {
  try {
    const cleanedDate = dateStr.replace(/(st|nd|rd|th|of|,)/gi, "").trim(); // Remove ordinals and unnecessary characters
    // console.log(cleanedDate)

    const parsedDate =
      format(cleanedDate, "d-MMM-yyyy", new Date()) ||
      format(cleanedDate, "MMM-yyyy", new Date()) ||
      format(cleanedDate, "d-MMM", new Date()) ||
      format(cleanedDate, "MMM-d", new Date()) ||
      format(cleanedDate, "dd-MM-yyyy", new Date()) ||
      format(cleanedDate, "d-MMMM-yyyy", new Date()) ||
      format(cleanedDate, "d/M/yyyy", new Date()) ||
      format(cleanedDate, "dd-MM-yyyy", new Date()) ||
      format(cleanedDate, "dd/MM/yyyy", new Date()) ||
      format(cleanedDate, "M/dd/yyyy", new Date()) ||
      format(cleanedDate, "MMM-yy", new Date());

    // console.log(parsedDate);
    return format(parsedDate, "yyyy-MM-dd");
  } catch (err) {
    console.log(`Error parsing ${dateStr}: ${err.message}`);
    return null; // Handle errors gracefully
  }
};

export const readFiles = async () => {
  const spreadsheetId = process.env.SPREADSHEET_ID;; 
  //   const range = "BIRTHDAY!D3";
  const rangeName = "BIRTHDAY!M:O";

  try {
    const data = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: rangeName,
    });

    const response = data.data.values;
    const filteredData = response.slice(1);
    // console.log(response);
    // console.log(filteredData);
    // console.log(response.length);

    // Handle case where there is no data
    if (!response || response.length === 0) {
      console.log("No data found in the specified range.");
      return [];
    }

    // Normalize dates before returning
    const normalizedData = filteredData.map((row) => {
      row[2] = normalizeDate(row[2]); // Assuming birthday is in 3rd column
      // console.log("this is ", row);
      // console.log(row[2], row[0])
      return row;
    });

    // console.log(normalizedData);
    return normalizedData;

    // return response;
  } catch (err) {
    console.error("Error reading data:", err);
  }
};

export const updateSheet = async (name, email, birthday, data, status) => {
  //   const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = `BIRTHDAY!P${
    data.findIndex((row) => row[0] === name && row[1] === email) + 2
  }`; // Finding the row and updating status
  console.log(status);
  const values = [[status]];

  const resource = {
    values,
  };
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource,
    });
  } catch (err) {
    console.error(err);
  }
};
