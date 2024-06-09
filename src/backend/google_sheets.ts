import { google } from "googleapis";

export const getGoogleSheetsData = async () => {
    const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS || ''
    const SPREAD_SHEETS_ID = process.env.SPREAD_SHEETS_ID || ''
    const SPREAD_SHEETS_RANGE = process.env.SPREAD_SHEETS_RANGE || ''

    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(atob(GOOGLE_CREDENTIALS)),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREAD_SHEETS_ID,
        range: SPREAD_SHEETS_RANGE
    });
    if (!res.data.values) {
        throw new Error('error to get data from google sheets');
    }

    const data = res.data.values.slice(1).map((cells) => ({
        company: cells[0],
        product: cells[1],
        efficacy: cells[2],
        effectiveness: cells[3],
        ethics: cells[4],
        equity: cells[5],
        environment: cells[6],
        status: cells[7],
        country: cells[8],
        url: cells[9],
        totalScore: cells[10]
    }));

    return data;
}
