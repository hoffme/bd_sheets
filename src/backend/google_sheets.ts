const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSA_ilnVV7YDF4RPF01B6tccgbsiZq3J8cZ_MCkXtk9EY8cvg_BqL4gp0Gs_TlwJ6PlhZ0A4Jh0OPm7/pub?output=csv";

export const getGoogleSheetsData = async () => {
    const response = await fetch(url);
    const text = await response.text();

    return text.split('\r\n').slice(1).map((txt) => {
        const cells = txt.split(',')
        return {
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
        }
    });
}
