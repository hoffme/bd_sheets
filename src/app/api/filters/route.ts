import { NextRequest, NextResponse } from "next/server"

import { getGoogleSheetsData } from "@app/backend/google_sheets";

export const GET = async (req: NextRequest) => {
    const data = await getGoogleSheetsData();

    const status: { [k: string]: string } = {};
    const country: { [k: string]: string } = {};
    const totalScore: { [k: string]: string } = {};

    data.forEach((row) => {
        status[row.status] = row.status;
        country[row.country] = row.country;
        totalScore[row.totalScore] = row.totalScore;
    })

    return NextResponse.json({
        status: 200,
        data: {
            status: Array.from(Object.entries(status)).map(([key, value]) => ({ key, value })),
            country: Array.from(Object.entries(country)).map(([key, value]) => ({ key, value })),
            totalScore: Array.from(Object.entries(totalScore)).map(([key, value]) => ({ key, value })),
        }
    })
}